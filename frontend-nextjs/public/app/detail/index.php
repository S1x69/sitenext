<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'banco_novo2';
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

    // ==========================
    // ARTIGO PRINCIPAL
    // ==========================
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

    // ==========================
    // PEGAR TAGS DO ARTICLE_CONTENT
    // ==========================
    $stmt = $pdo->prepare("SELECT tags FROM article_content WHERE article_id = ?");
    $stmt->execute([$article['id']]);
    $tagRow = $stmt->fetch();

    $tagIds = [];
    $tags = [];
    if ($tagRow && $tagRow['tags']) {
        $tagIds = array_values(array_filter(array_map('trim', explode(',', $tagRow['tags']))));
        if ($tagIds) {
            $placeholders = implode(',', array_fill(0, count($tagIds), '?'));
            $stmt = $pdo->prepare("SELECT id, name FROM tags WHERE id IN ($placeholders)");
            $stmt->execute($tagIds);
            $tagsResult = $stmt->fetchAll();
            $tags = array_column($tagsResult, 'name');
        }
    }

    // ==========================
    // IDs já usados para não repetir notícias
    // ==========================
    $usedIds = [$article['id']];

    // ==========================
    // FUNÇÃO PARA FORMATAR ARTIGOS
    // ==========================
    function formatArticles($rows, &$usedIds) {
        $result = [];
        foreach ($rows as $r) {
            $result[] = [
                'id' => (int)$r['id'],
                'title' => $r['title'],
                'subtitle' => $r['subtitle'] ?? '',
                'image' => $r['image'] ? ("https://boca.com.br" . $r['image']) : null,
                'author' => $r['author'],
                'category' => $r['category'],
                'date' => $r['date'],
                'url' => "/" . date('Y/m/d', strtotime($r['date'])) . "/" . $r['category_slug'] . "/" . $r['slug']
            ];
            $usedIds[] = $r['id'];
        }
        return $result;
    }

    // ==========================
    // NOTÍCIAS RELACIONADAS (PRIORIDADE TAGS MAIS IGUAIS)
    // ==========================
    $relatedFormatted = [];
    if ($tagIds) {
        $conditions = [];
        foreach ($tagIds as $t) {
            $conditions[] = "FIND_IN_SET(?, ac.tags)";
        }
        $whereTags = implode(" OR ", $conditions);

        // Score baseado em:
        // 60% = número de tags em comum
        // 40% = tags presentes no título
        // recência = mais novo primeiro
        $scoreParts = [];
        foreach ($tagIds as $t) {
            $scoreParts[] = "FIND_IN_SET($t, ac.tags) * 0.6"; // peso 60%
            $scoreParts[] = "(a.title LIKE '%" . addslashes($tags[array_search($t, $tagIds)]) . "%') * 0.4"; // peso 40%
        }
        $scoreExpression = "(" . implode(" + ", $scoreParts) . ")";

        $sql = "
            SELECT DISTINCT a.id, a.title, a.subtitle, a.image, a.date,
                   au.name AS author, c.name AS category, c.slug AS category_slug, a.slug,
                   $scoreExpression AS score
            FROM articles a
            INNER JOIN article_content ac ON ac.article_id = a.id
            LEFT JOIN authors au ON a.author_id = au.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE ($whereTags)
            AND a.id NOT IN (" . implode(',', array_fill(0, count($usedIds), '?')) . ")
            ORDER BY score DESC, a.date DESC
            LIMIT 3
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_merge($tagIds, $usedIds));
        $relatedFormatted = formatArticles($stmt->fetchAll(), $usedIds);
    }

    // =====================================================
    // SE AINDA ASSIM NÃO VEIO NADA → PEGAR NOTÍCIAS RECENTES
    // =====================================================
    if (count($relatedFormatted) == 0) {
        $sql = "
            SELECT a.*, au.name AS author, c.name AS category, c.slug AS category_slug
            FROM articles a
            LEFT JOIN authors au ON a.author_id = au.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.id NOT IN (" . implode(",", array_fill(0, count($usedIds), '?')) . ")
            ORDER BY a.date DESC
            LIMIT 3
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($usedIds);
        $relatedFormatted = formatArticles($stmt->fetchAll(), $usedIds);
    }

    // ==========================
    // LEIA TAMBÉM — OUTRAS CATEGORIAS (mais recentes)
    // ==========================
    // ==========================
// LEIA TAMBÉM — PRIORIDADE: TAGS NO TÍTULO PRINCIPAL
// ==========================

if (!empty($tagIds)) {

    $tagConditions = [];
    $scoreParts = [];

    foreach ($tagIds as $index => $tagId) {

        $tagName = $tags[$index] ?? '';
        $tagName = addslashes($tagName);

        // MATCH com título da notícia PRINCIPAL (prioridade maior)
        $scoreParts[] = "(a.title LIKE '%$tagName%') * 0.7";

        // MATCH com título da notícia RELACIONADA (menor prioridade)
        $scoreParts[] = "(a.title LIKE '%$tagName%') * 0.3";

        // busca por tag no campo tags
        $tagConditions[] = "FIND_IN_SET($tagId, ac.tags)";
    }

    $tagWhere = implode(" OR ", $tagConditions);
    $scoreExpr = "(" . implode(" + ", $scoreParts) . ")";

    $sql = "
        SELECT DISTINCT 
            a.id, a.title, a.subtitle, a.image, a.date,
            au.name AS author, c.name AS category, c.slug AS category_slug, a.slug,
            $scoreExpr AS score
        FROM articles a
        INNER JOIN article_content ac ON ac.article_id = a.id
        LEFT JOIN authors au ON a.author_id = au.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE ($tagWhere)
        AND a.category_id != ?
        AND a.id NOT IN (" . implode(",", array_fill(0, count($usedIds), '?')) . ")
        ORDER BY score DESC, a.date DESC
        LIMIT 3
    ";

    $params = array_merge([$article['category_id']], $usedIds);
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $leiaTambem = formatArticles($stmt->fetchAll(), $usedIds);

} else {
    // SEM TAGS → fallback
    $sql = "
        SELECT a.id, a.title, a.subtitle, a.image, a.date,
               au.name AS author, c.name AS category, c.slug AS category_slug, a.slug
        FROM articles a
        LEFT JOIN authors au ON a.author_id = au.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.category_id != ?
        AND a.id NOT IN (" . implode(',', array_fill(0, count($usedIds), '?')) . ")
        ORDER BY a.date DESC
        LIMIT 3
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_merge([$article['category_id']], $usedIds));

    $leiaTambem = formatArticles($stmt->fetchAll(), $usedIds);
}


    // ==========================
    // MAIS DA CATEGORIA — MESMA CATEGORIA (baseado em TAGS)
    // ==========================

    // Se tiver tags → usa relevância
    if (!empty($tagIds)) {

        // monta condições para encontrar artigos com tags iguais
        $tagConditions = [];
        foreach ($tagIds as $t) {
            $tagConditions[] = "FIND_IN_SET($t, ac.tags)";
        }
        $tagWhere = implode(" OR ", $tagConditions);

        // cálculo de score (mesma lógica usada nas relacionadas)
        $scoreParts = [];
        foreach ($tagIds as $t) {
            $scoreParts[] = "FIND_IN_SET($t, ac.tags) * 0.7"; // 70% match de tags
            $scoreParts[] = "(a.title LIKE '%" . addslashes($tags[array_search($t, $tagIds)]) . "%') * 0.3";
        }
        $scoreExpr = "(" . implode(" + ", $scoreParts) . ")";

        $sql = "
            SELECT DISTINCT a.id, a.title, a.subtitle, a.image, a.date,
                au.name AS author, c.name AS category, c.slug AS category_slug, a.slug,
                $scoreExpr AS score
            FROM articles a
            INNER JOIN article_content ac ON ac.article_id = a.id
            LEFT JOIN authors au ON a.author_id = au.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.category_id = ?
            AND a.id NOT IN (" . implode(",", array_fill(0, count($usedIds), '?')) . ")
            ORDER BY score DESC, a.date DESC
            LIMIT 4
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_merge([$article['category_id']], $usedIds));
        $maisDeCategory = formatArticles($stmt->fetchAll(), $usedIds);

    } else {

        // Se NÃO tiver tags → usa as notícias mais recentes da categoria
        $sql = "
            SELECT a.id, a.title, a.subtitle, a.image, a.date,
                au.name AS author, c.name AS category, c.slug AS category_slug, a.slug
            FROM articles a
            LEFT JOIN authors au ON a.author_id = au.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.category_id = ?
            AND a.id NOT IN (" . implode(',', array_fill(0, count($usedIds), '?')) . ")
            ORDER BY a.date DESC
            LIMIT 4
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_merge([$article['category_id']], $usedIds));
        $maisDeCategory = formatArticles($stmt->fetchAll(), $usedIds);
    }

    // ==========================
    // CONTEÚDO DO ARTIGO
    // ==========================
    $stmt = $pdo->prepare("SELECT text FROM article_content WHERE article_id = ? ORDER BY id ASC");
    $stmt->execute([$article['id']]);
    $contentData = $stmt->fetchAll();
    $content = "";
    if ($contentData && isset($contentData[0]['text'])) {
        $decoded = json_decode($contentData[0]['text'], true);
        $content = $decoded ?: $contentData[0]['text'];
    }

    // ==========================
    // JSON FINAL
    // ==========================

    $articleURL = "/" . date('Y/m/d', strtotime($article['date'])) . "/" . $article['category'] . "/" . $article['slug'];

    echo json_encode([
        'id' => (int)$article['id'],
        'type' => $article['type'],
        'niches' => $article['niches'],
        'title' => $article['title'],
        'subtitle' => $article['subtitle'],
        'slug' => $article['slug'],
        'category' =>array('nome' => $article['category'], 'slug' => $article['slug']),
        'date' => $article['date'],
        'author' => $article['author'],
        'image' => $article['image'] ? ("https://boca.com.br" . $article['image']) : null,
        'tags' => $tags,
        'NoticiasRelacionadas' => $relatedFormatted,
        'LeiaTambem' => $leiaTambem,
        'MaisdeCategory' => $maisDeCategory,
        'content' => $content,
        'url' => $articleURL
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
