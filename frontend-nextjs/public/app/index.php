<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

$limit = intval($_GET['limit'] ?? 100);
$offset = intval($_GET['offset'] ?? 0);
$categorySlug = $_GET['category'] ?? '';

try {
    $pdo = new PDO("mysql:host=localhost;dbname=banco_novo2;charset=utf8mb4", "bit", "Atecubanos1#", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // Busca artigos
    $sql = "SELECT a.*, au.name AS author, c.name AS category, c.slug AS category_slug
            FROM articles a
            LEFT JOIN authors au ON a.author_id = au.id
            LEFT JOIN categories c ON a.category_id = c.id";
    $params = [];
    if ($categorySlug) {
        $sql .= " WHERE c.slug = ?";
        $params[] = $categorySlug;
    }
    $sql .= " ORDER BY a.id DESC LIMIT $limit OFFSET $offset";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $articles = $stmt->fetchAll();

    $result = [];
    foreach ($articles as $a) {
        // Conteúdo e tags
        $stmtContent = $pdo->prepare("SELECT text, tags FROM article_content WHERE article_id = ? ORDER BY id ASC");
        $stmtContent->execute([$a['id']]);
        $contents = $stmtContent->fetchAll();

        $body = [];
        $tags = [];
        foreach ($contents as $c) {
            $body = json_decode($c['text'], true) ?: [['type'=>'paragraph','text'=>$c['text']]];
            if ($c['tags']) {
                $tagIds = array_map('trim', explode(',', $c['tags']));
                if ($tagIds) {
                    $placeholders = implode(',', array_fill(0,count($tagIds),'?'));
                    $stmtTags = $pdo->prepare("SELECT name FROM tags WHERE id IN ($placeholders)");
                    $stmtTags->execute($tagIds);
                    $tags = array_merge($tags, $stmtTags->fetchAll(PDO::FETCH_COLUMN));
                }
            }
        }
        $tags = array_unique($tags);

        $urlDate = date("Y/m/d", strtotime($a['date']));
        $image = $a['image'] ? "https://boca.com.br{$a['image']}" : null;

        $result[] = [
            "related_articles"=>[],
            "featured"=>$a['featured'],
            "date"=>$a['date'],
            "tag"=>$tags,
            "id"=>$a['id'],
            "category"=>$a['category'],
            "content"=>$body,
            "image"=>$image,
            "LastModified"=>$a['date'],
            "title"=>$a['title'],
            "subtitle"=>$a['subtitle'],
            "author"=>$a['author'],
            "url"=>"/$urlDate/{$a['category_slug']}/{$a['slug']}",
            "slug"=>$a['slug']
        ];
    }

    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch(PDOException $e) {
    echo json_encode(["error"=>$e->getMessage()]);
}
