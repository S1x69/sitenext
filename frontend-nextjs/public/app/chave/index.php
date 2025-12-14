<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

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
} catch (PDOException $e) {
    echo json_encode(["error" => "Erro ao conectar ao banco"]);
    exit;
}

$keyword = $_GET['chave'] ?? '';
if (!$keyword) {
    echo json_encode([]);
    exit;
}

// palavra para REGEXP, escapando caracteres especiais
$keywordRegexp = "\\b" . preg_quote($keyword, '/') . "\\b";

$sql = "
    SELECT 
        a.id, a.title, a.subtitle, a.slug, a.image, a.date,
        au.name AS author,
        c.name AS category,
        c.slug AS category_slug,
        ac.tags,
        ac.text
    FROM articles a
    LEFT JOIN authors au ON a.author_id = au.id
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN article_content ac ON ac.article_id = a.id
    WHERE 
           a.title REGEXP ?        -- palavra exata no título
        OR ac.tags LIKE ?          -- palavra em tags
        OR a.subtitle LIKE ?       -- palavra no subtítulo
        OR ac.text LIKE ?          -- palavra no conteúdo
    ORDER BY
        CASE
            WHEN a.title REGEXP ? THEN 4
            WHEN ac.tags LIKE ? THEN 3
            WHEN a.subtitle LIKE ? THEN 2
            WHEN ac.text LIKE ? THEN 1
            ELSE 0
        END DESC,
        a.date DESC
    LIMIT 1000
";

$likeSearch = "%$keyword%";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    $keywordRegexp, // título exato
    $likeSearch,    // tags
    $likeSearch,    // subtítulo
    $likeSearch,    // conteúdo
    $keywordRegexp, // ORDER BY título exato
    $likeSearch,    // ORDER BY tags
    $likeSearch,    // ORDER BY subtítulo
    $likeSearch     // ORDER BY conteúdo
]);

$rows = $stmt->fetchAll();
$result = [];

// Função para pegar nomes das tags
function getTagNames(PDO $pdo, $tags) {
    if (!$tags) return [];
    $tagArray = array_map('trim', explode(',', $tags));
    if (empty($tagArray)) return [];
    $isNumeric = ctype_digit(implode('', $tagArray));
    if ($isNumeric) {
        $placeholders = implode(',', array_fill(0, count($tagArray), '?'));
        $stmt = $pdo->prepare("SELECT name FROM tags WHERE id IN ($placeholders)");
        $stmt->execute($tagArray);
        return $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];
    } else {
        return $tagArray;
    }
}

foreach ($rows as $r) {
    $urlDate = date("Y/m/d", strtotime($r['date']));
    $url = "/$urlDate/{$r['category_slug']}/{$r['slug']}";
    $image = $r['image'] ? "https://boca.com.br{$r['image']}" : null;
    $tags = getTagNames($pdo, $r['tags']);

    $result[] = [
        "id"        => (int)$r["id"],
        "title"     => $r["title"],
        "subtitle"  => $r["subtitle"],
        "slug"      => $r["slug"],
        "category"  => $r["category"],
        "image"     => $image,
        "author"    => $r["author"],
        "date"      => $r["date"],
        "tag"       => $tags,
        "url"       => $url,
    ];
}

echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
