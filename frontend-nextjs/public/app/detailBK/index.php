<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'banco_novo';
$user = 'bit';
$pass = 'Atecubanos1#';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    $slug = $_GET['news_detail'] ?? '';
    $date = $_GET['data'] ?? '';

    if (!$slug) {
        echo json_encode(['error' => 'Slug não fornecido']);
        exit;
    }

    // -----------------------------
    // Carrega artigo principal
    // -----------------------------
    $sql = "
        SELECT a.*, au.name AS author, c.name AS category
        FROM articles a
        LEFT JOIN authors au ON a.author_id = au.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.slug = ?
    ";
    $params = [$slug];

    if ($date) {
        $sql .= " AND DATE(a.date) = ?";
        $params[] = $date;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $article = $stmt->fetch();

    if (!$article) {
        echo json_encode(['error' => 'Artigo não encontrado']);
        exit;
    }

    // -----------------------------
    // Carrega todas as tags com ID
    // -----------------------------
    $tagsDB = $pdo->query("SELECT id, name FROM tags")->fetchAll(PDO::FETCH_ASSOC);
    $tagsMap = [];
    foreach ($tagsDB as $t) {
        $tagsMap[ mb_strtolower($t['name']) ] = (int)$t['id'];
    }

    // -----------------------------
    // FUNÇÕES: limpar / normalize / extract keywords with counts
    // -----------------------------
    $stopwords = ['a','o','e','da','de','do','das','dos','na','no','para','em','com','uma','um','dos','das','que','as','os','ao','à','às','é','se','sobre','sua','são','tem','mais','menos','entre','como','ser','ter','vai','já','onde','qual','quais','pode','podem','for','após'];

    function limpar_array($texto, $stopwords) {
        $texto = mb_strtolower((string)$texto, 'UTF-8');
        $texto = preg_replace('/[^a-zá-úà-ùãõâêîôûç0-9\s]/iu', ' ', $texto);
        $parts = preg_split('/\s+/', $texto, -1, PREG_SPLIT_NO_EMPTY);
        $out = [];
        foreach ($parts as $p) {
            if (mb_strlen($p) >= 4 && !in_array($p, $stopwords)) {
                $out[] = $p;
            }
        }
        return $out;
    }

    function normalize_simple($str) {
        $str = mb_strtolower((string)$str, 'UTF-8');
        $str = str_replace(
            ['á','à','ã','â','é','è','ê','í','ì','î','ó','ò','õ','ô','ú','ù','û','ç'],
            ['a','a','a','a','e','e','e','i','i','i','o','o','o','o','u','u','u','c'],
            $str
        );
        $str = preg_replace('/[^a-z0-9\s]/', ' ', $str);
        $str = preg_replace('/\s+/', ' ', $str);
        return trim($str);
    }

    // Extração com contagem (title/subtitle/content)
    $titleWords   = limpar_array($article['title'], $stopwords);
    $subtitleWords= limpar_array($article['subtitle'], $stopwords);

    // Carrega conteúdo (texto combinado) do article_content para contagem
    $stmt = $pdo->prepare("SELECT GROUP_CONCAT(text SEPARATOR ' ') as fulltext FROM article_content WHERE article_id = ?");
    $stmt->execute([$article['id']]);
    $row = $stmt->fetch();
    $fulltext = $row ? $row['fulltext'] : '';
    $contentWords = limpar_array($fulltext, $stopwords);

    // contagens
    $titleCount = array_count_values($titleWords);
    $subCount   = array_count_values($subtitleWords);
    $contentCount = array_count_values($contentWords);

    // -----------------------------
    // Monta tagScoreMap a partir de tags existentes que batem com palavras encontradas
    // Cada palavra ganha: title=3 * count + bonusTitle(10), subtitle=2*count, content=1*count
    // -----------------------------
    $wordScores = []; // palavra => score
    foreach ($titleCount as $w => $q) {
        $wordScores[$w] = ($wordScores[$w] ?? 0) + (3 * $q) + 10; // bônus título
    }
    foreach ($subCount as $w => $q) {
        $wordScores[$w] = ($wordScores[$w] ?? 0) + (2 * $q);
    }
    foreach ($contentCount as $w => $q) {
        $wordScores[$w] = ($wordScores[$w] ?? 0) + (1 * $q);
    }

    // Mapeia palavras para tag IDs (somando scores caso mesma tag mapeie várias palavras)
    $tagScoreMap = []; // tag_id => score
    foreach ($wordScores as $word => $score) {
        if (isset($tagsMap[$word])) {
            $tid = $tagsMap[$word];
            $tagScoreMap[$tid] = ($tagScoreMap[$tid] ?? 0) + $score;
        }
    }

    // -----------------------------
    // Também monta keywords para regex (para matching no texto/título/subtitulo)
    // -----------------------------
    $allKeywords = array_unique(array_merge(array_keys($titleCount), array_keys($subCount), array_keys($contentCount)));
    // evite regex vazia
    if (empty($allKeywords)) $allKeywords = [normalize_simple($article['title'])];

    $regex = implode('|', array_map(function($k){ return preg_quote($k,'/'); }, $allKeywords));

    // -----------------------------
    // Buscar artigos relacionados — combinação tag_score (CASE) + text_score (REGEXP)
    // -----------------------------
    // Construir expressão CASE para ponderar tags (somatório por artigo)
    $caseWhen = '';
    if (!empty($tagScoreMap)) {
        $parts = [];
        foreach ($tagScoreMap as $tid => $score) {
            $tid_i = (int)$tid;
            $score_i = (int)$score;
            // cria partes: WHEN at.tag_id = $tid THEN $score
            $parts[] = "WHEN $tid_i THEN $score_i";
        }
        $caseWhen = "SUM(CASE " . "WHEN at.tag_id IS NOT NULL THEN CASE at.tag_id " . implode(' ', $parts) . " ELSE 0 END ELSE 0 END)"; // resulta em tag_score
    } else {
        // fallback 0
        $caseWhen = "0";
    }

    $sql = "
        SELECT 
            a.id, a.title, a.subtitle, a.image, a.date, a.slug,
            au.name AS author,
            c.name AS category,
            ({$caseWhen}) AS tag_score,
            ((a.title REGEXP ?)*3 + (a.subtitle REGEXP ?)*2 + (a.content REGEXP ?)*1) AS text_score,
            ({$caseWhen}) + ((a.title REGEXP ?)*3 + (a.subtitle REGEXP ?)*2 + (a.content REGEXP ?)*1) AS score
        FROM articles a
        LEFT JOIN authors au ON a.author_id = au.id
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN article_tags at ON at.article_id = a.id
        WHERE a.id != ?
        GROUP BY a.id
        HAVING score > 0
        ORDER BY score DESC, a.date DESC
        LIMIT 6
    ";

    // preparar parâmetros para os 2 conjuntos de REGEXP (aparecem duas vezes)
    $params = [$regex, $regex, $regex, $regex, $regex, $regex, (int)$article['id']];

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $relatedArticles = $stmt->fetchAll();

    // -----------------------------
    // Constrói usedIds e formatador
    // -----------------------------
    $usedIds = [$article['id']];

    function formatArticles($rows, &$usedIds) {
        $articles = [];
        foreach ($rows as $r) {
            $articles[] = [
                'id' => (int)$r['id'],
                'title' => $r['title'],
                'subtitle' => $r['subtitle'] ?? '',
                'image' => $r['image'] ?? '',
                'author' => $r['author'],
                'category' => $r['category'],
                'date' => $r['date'],
                'url' => "/" . date('Y/m/d', strtotime($r['date'])) . "/" . $r['category'] . "/" . $r['slug']
            ];
            $usedIds[] = (int)$r['id'];
        }
        return $articles;
    }

    $relatedFormatted = formatArticles($relatedArticles, $usedIds);

   // 🔥 FALLBACK ABSOLUTO: nunca retornar vazio e nunca repetir artigos já exibidos
    if (empty($relatedFormatted)) {

        // Converte IDs usados em placeholders
        $usedPlaceholders = implode(',', array_fill(0, count($usedIds), '?'));

        $sql = "
            SELECT 
                a.id, a.title, a.subtitle, a.image, a.date, a.slug,
                au.name AS author, c.name AS category
            FROM articles a
            LEFT JOIN authors au ON a.author_id = au.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.id NOT IN ($usedPlaceholders)
            ORDER BY a.date DESC
            LIMIT 6
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($usedIds);

        $fallbackRows = $stmt->fetchAll();

        // Se ainda assim vier vazio (banco com poucos artigos), remove filtro de NOT IN
        if (empty($fallbackRows)) {
            $stmt = $pdo->query("
                SELECT 
                    a.id, a.title, a.subtitle, a.image, a.date, a.slug,
                    au.name AS author, c.name AS category
                FROM articles a
                LEFT JOIN authors au ON a.author_id = au.id
                LEFT JOIN categories c ON a.category_id = c.id
                ORDER BY a.date DESC
                LIMIT 6
            ");
            $fallbackRows = $stmt->fetchAll();
        }

        $relatedFormatted = formatArticles($fallbackRows, $usedIds);
    }


    // -----------------------------
    // LEIA TAMBÉM (por categoria diferente)
    // -----------------------------
    $placeholdersUsed = implode(',', array_fill(0, count($usedIds), '?'));
    $sql = "
        SELECT a.id, a.title, a.subtitle, a.image, a.date,
               au.name AS author, c.name AS category, a.slug
        FROM articles a
        LEFT JOIN authors au ON a.author_id = au.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.category_id != ?
        AND a.id NOT IN ($placeholdersUsed)
        ORDER BY a.date DESC
        LIMIT 3
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_merge([$article['category_id']], $usedIds));
    $leiaTambem = formatArticles($stmt->fetchAll(), $usedIds);

    // -----------------------------
    // MAIS DA CATEGORIA
    // -----------------------------
    $placeholdersUsed = implode(',', array_fill(0, count($usedIds), '?'));
    $sql = "
        SELECT a.id, a.title, a.subtitle, a.image, a.date,
               au.name AS author, c.name AS category, a.slug
        FROM articles a
        LEFT JOIN authors au ON a.author_id = au.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.category_id = ?
        AND a.id NOT IN ($placeholdersUsed)
        ORDER BY a.date DESC
        LIMIT 4
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_merge([$article['category_id']], $usedIds));
    $maisDeCategory = formatArticles($stmt->fetchAll(), $usedIds);

    // -----------------------------
    // Conteúdo do artigo (detalhado)
    // -----------------------------
    $stmt = $pdo->prepare("
        SELECT type, text
        FROM article_content
        WHERE article_id = ?
        ORDER BY id ASC
    ");
    $stmt->execute([$article['id']]);
    $content = $stmt->fetchAll();

    foreach ($content as &$block) {
        if (in_array($block['type'], ['image', 'list'])) {
            $decoded = json_decode($block['text'], true);
            if ($decoded !== null) {
                $block['text'] = $decoded;
            }
        }
    }

    // -----------------------------
    // Tags do artigo principal (nomes e ids)
    // -----------------------------
    $stmt = $pdo->prepare("
        SELECT t.id, t.name
        FROM tags t
        INNER JOIN article_tags at ON at.tag_id = t.id
        WHERE at.article_id = ?
    ");
    $stmt->execute([$article['id']]);
    $tagsData = $stmt->fetchAll();
    $tags = array_column($tagsData, 'name');
    $tagIds = array_column($tagsData, 'id');

    // -----------------------------
    // Resposta final
    // -----------------------------
    echo json_encode([
        'id' => (int)$article['id'],
        'title' => $article['title'],
        'subtitle' => $article['subtitle'],
        'slug' => $article['slug'],
        'category' => $article['category'],
        'date' => $article['date'],
        'author' => $article['author'],
        'image' => $article['image'] ?? null,
        'tags' => $tags,
        'NoticiasRelacionadas' => $relatedFormatted,
        'LeiaTambem' => $leiaTambem,
        'MaisdeCategory' => $maisDeCategory,
        'content' => $content
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
