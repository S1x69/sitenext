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

    // Tag que você deseja remover
    $tagToRemove = 'noticias';

    // 1️⃣ Obter o ID da tag "noticias"
    $stmt = $pdo->prepare("SELECT id FROM tags WHERE name = ?");
    $stmt->execute([$tagToRemove]);
    $tag = $stmt->fetch();

    if (!$tag) {
        echo json_encode(['success' => false, 'message' => 'Tag não encontrada']);
        exit;
    }

    $tagIdToRemove = $tag['id'];

    // 2️⃣ Buscar todos os article_content que contenham esse ID
    $stmt = $pdo->prepare("SELECT article_id, tags FROM article_content WHERE FIND_IN_SET(?, tags)");
    $stmt->execute([$tagIdToRemove]);
    $articles = $stmt->fetchAll();

    $updatedCount = 0;

    foreach ($articles as $article) {
        $tagsArray = array_map('trim', explode(',', $article['tags']));

        // Remover o ID da tag "noticias"
        $tagsArray = array_filter($tagsArray, function($t) use ($tagIdToRemove) {
            return $t != $tagIdToRemove;
        });

        // Atualizar as tags
        $newTags = implode(',', $tagsArray);

        $updateStmt = $pdo->prepare("UPDATE article_content SET tags = ? WHERE article_id = ?");
        $updateStmt->execute([$newTags, $article['article_id']]);
        $updatedCount++;
    }

    echo json_encode([
        'success' => true,
        'tagRemoved' => $tagToRemove,
        'articlesUpdated' => $updatedCount
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
