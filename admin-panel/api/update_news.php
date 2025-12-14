<?php
/**
 * API para Atualizar Notícias
 * 
 * Este arquivo recebe dados de notícias editadas e atualiza no banco de dados.
 * Inclui tratamento inteligente de imagens (upload, substituição e exclusão).
 * 
 * Endpoint: POST /api/update_news.php
 * Content-Type: application/json
 */

// Configurações
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Permitir apenas POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Método não permitido. Use POST.'
    ]);
    exit;
}

// Configuração do Banco de Dados
define('DB_HOST', '181.215.134.15');
define('DB_NAME', 'banco_novo2');
define('DB_USER', 'bit');
define('DB_PASS', 'Atecubanos1#');
define('DB_CHARSET', 'utf8mb4');

// Diretório de upload de imagens
define('UPLOAD_DIR', __DIR__ . '/../../upload/imagens-resizes/');
define('UPLOAD_URL_PREFIX', '/upload/imagens-resizes/');

// Configurações de log
define('LOG_FILE', __DIR__ . '/update_news.log');
define('ENABLE_LOGGING', true);

/**
 * Função para registrar logs
 */
function logMessage($message, $level = 'INFO') {
    if (!ENABLE_LOGGING) return;
    
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[{$timestamp}] [{$level}] {$message}\n";
    file_put_contents(LOG_FILE, $logEntry, FILE_APPEND);
}

/**
 * Função para retornar resposta JSON
 */
function sendResponse($success, $data = [], $httpCode = 200) {
    http_response_code($httpCode);
    echo json_encode(array_merge(['success' => $success], $data), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * Conectar ao banco de dados
 */
function getDatabaseConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (PDOException $e) {
        logMessage("Erro de conexão com o banco: " . $e->getMessage(), 'ERROR');
        sendResponse(false, ['error' => 'Erro ao conectar ao banco de dados'], 500);
    }
}

/**
 * Processar imagem Base64 ou URL
 */
function processImage($imageData, $oldImagePath = null) {
    // Se a imagem não mudou, retornar a mesma
    if ($imageData === $oldImagePath) {
        logMessage("Imagem não foi alterada: {$oldImagePath}");
        return $oldImagePath;
    }
    
    // Se for URL externa (http/https)
    if (preg_match('/^https?:\/\//i', $imageData)) {
        // Se for URL do Boca News, extrair apenas o caminho local
        if (preg_match('/^https?:\/\/boca\.com\.br(\/upload\/imagens-resizes\/.+)$/i', $imageData, $matches)) {
            $localPath = $matches[1];
            logMessage("URL do Boca News convertida para caminho local: {$localPath}");
            return $localPath;
        }
        // Outras URLs externas, manter como está
        logMessage("Imagem é URL externa: {$imageData}");
        return $imageData;
    }
    
    // Se for Base64
    if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $matches)) {
        $imageType = $matches[1]; // jpeg, png, gif, etc
        $imageBase64 = substr($imageData, strpos($imageData, ',') + 1);
        $imageDecoded = base64_decode($imageBase64);
        
        if ($imageDecoded === false) {
            logMessage("Erro ao decodificar imagem Base64", 'ERROR');
            return null;
        }
        
        // Gerar nome único para o arquivo
        $filename = md5(uniqid(rand(), true)) . '.' . $imageType;
        $filepath = UPLOAD_DIR . $filename;
        
        // Criar diretório se não existir
        if (!is_dir(UPLOAD_DIR)) {
            mkdir(UPLOAD_DIR, 0755, true);
        }
        
        // Salvar imagem
        if (file_put_contents($filepath, $imageDecoded)) {
            logMessage("Nova imagem salva: {$filename}");
            
            // Deletar imagem antiga se existir e for local
            if ($oldImagePath && !preg_match('/^https?:\/\//i', $oldImagePath)) {
                $oldFilePath = __DIR__ . '/../../' . ltrim($oldImagePath, '/');
                if (file_exists($oldFilePath)) {
                    unlink($oldFilePath);
                    logMessage("Imagem antiga deletada: {$oldImagePath}");
                }
            }
            
            return UPLOAD_URL_PREFIX . $filename;
        } else {
            logMessage("Erro ao salvar imagem no servidor", 'ERROR');
            return null;
        }
    }
    
    // Se for caminho local no formato /upload/imagens-resizes/...
    if (strpos($imageData, '/upload/imagens-resizes/') === 0) {
        logMessage("Imagem já existe no servidor (caminho local): {$imageData}");
        return $imageData;
    }
    
    // Se for caminho local existente (verificar fisicamente)
    if (file_exists(__DIR__ . '/../../' . ltrim($imageData, '/'))) {
        logMessage("Imagem já existe no servidor: {$imageData}");
        return $imageData;
    }
    
    logMessage("Formato de imagem não reconhecido", 'WARNING');
    return $imageData; // Retornar como está
}

/**
 * Obter ou criar categoria
 */
function getCategoryId($pdo, $categoryName) {
    if (empty($categoryName)) {
        return null;
    }
    
    // Buscar categoria existente
    $stmt = $pdo->prepare("SELECT id FROM categories WHERE name = :name LIMIT 1");
    $stmt->execute(['name' => $categoryName]);
    $category = $stmt->fetch();
    
    if ($category) {
        return $category['id'];
    }
    
    // Criar nova categoria
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', 
        iconv('UTF-8', 'ASCII//TRANSLIT', $categoryName))));
    
    $stmt = $pdo->prepare("INSERT INTO categories (name, slug) VALUES (:name, :slug)");
    $stmt->execute([
        'name' => $categoryName,
        'slug' => $slug
    ]);
    
    $categoryId = $pdo->lastInsertId();
    logMessage("Nova categoria criada: {$categoryName} (ID: {$categoryId})");
    
    return $categoryId;
}

/**
 * Obter ou criar autor
 */
function getAuthorId($pdo, $authorName = 'Redação') {
    if (empty($authorName)) {
        $authorName = 'Redação';
    }
    
    // Buscar autor existente
    $stmt = $pdo->prepare("SELECT id FROM authors WHERE name = :name LIMIT 1");
    $stmt->execute(['name' => $authorName]);
    $author = $stmt->fetch();
    
    if ($author) {
        return $author['id'];
    }
    
    // Criar novo autor
    $stmt = $pdo->prepare("INSERT INTO authors (name) VALUES (:name)");
    $stmt->execute(['name' => $authorName]);
    
    $authorId = $pdo->lastInsertId();
    logMessage("Novo autor criado: {$authorName} (ID: {$authorId})");
    
    return $authorId;
}

/**
 * Processar tags - criar novas tags se não existirem e retornar IDs
 */
function processTagsToIds($pdo, $tags) {
    if (empty($tags) || !is_array($tags)) {
        return [];
    }
    
    $tagIds = [];
    
    foreach ($tags as $tagName) {
        $tagName = trim($tagName);
        if (empty($tagName)) {
            continue;
        }
        
        // Buscar tag existente
        $stmt = $pdo->prepare("SELECT id FROM tags WHERE name = :name LIMIT 1");
        $stmt->execute(['name' => $tagName]);
        $tag = $stmt->fetch();
        
        if ($tag) {
            $tagIds[] = $tag['id'];
            logMessage("Tag existente encontrada: {$tagName} (ID: {$tag['id']})");
        } else {
            // Criar nova tag
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', 
                iconv('UTF-8', 'ASCII//TRANSLIT', $tagName))));
            
            $stmt = $pdo->prepare("INSERT INTO tags (name, slug) VALUES (:name, :slug)");
            $stmt->execute([
                'name' => $tagName,
                'slug' => $slug
            ]);
            
            $newTagId = $pdo->lastInsertId();
            $tagIds[] = $newTagId;
            logMessage("Nova tag criada: {$tagName} (ID: {$newTagId})");
        }
    }
    
    return $tagIds;
}

// ============================================================================
// INÍCIO DO PROCESSAMENTO
// ============================================================================

try {
    // Ler dados JSON do corpo da requisição
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido: ' . json_last_error_msg());
    }
    
    logMessage("=== Início da atualização de notícia ===");
    logMessage("Dados recebidos: " . json_encode($data, JSON_UNESCAPED_UNICODE));
    
    // Validações básicas
    if (empty($data['id'])) {
        throw new Exception('ID da notícia é obrigatório');
    }
    
    if (empty($data['title'])) {
        throw new Exception('Título é obrigatório');
    }
    
    if (empty($data['content']) || !is_array($data['content'])) {
        throw new Exception('Conteúdo deve ser um array com pelo menos um bloco');
    }
    
    $newsId = intval($data['id']);
    
    // Conectar ao banco
    $pdo = getDatabaseConnection();
    
    // Verificar se a notícia existe
    $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = :id");
    $stmt->execute(['id' => $newsId]);
    $existingNews = $stmt->fetch();
    
    if (!$existingNews) {
        throw new Exception("Notícia com ID {$newsId} não encontrada");
    }
    
    logMessage("Notícia encontrada: {$existingNews['title']}");
    
    // Processar categoria
    $categoryId = null;
    if (!empty($data['category']['nome'])) {
        $categoryId = getCategoryId($pdo, $data['category']['nome']);
    } else {
        $categoryId = $existingNews['category_id'];
    }
    
    // Processar autor (manter o existente se não fornecido)
    $authorId = $existingNews['author_id'] ?? getAuthorId($pdo, 'Redação');
    
    // Processar imagem - extrair apenas o nome do arquivo
    $newImagePath = $existingNews['image'];
    if (!empty($data['image'])) {
        $processedImage = processImage($data['image'], $existingNews['image']);
        if ($processedImage !== null) {
            // Extrair apenas o nome do arquivo (remover /upload/imagens-resizes/)
            if (preg_match('/\/upload\/imagens-resizes\/(.+)$/', $processedImage, $matches)) {
                $newImagePath = $matches[1]; // Apenas o nome do arquivo
                logMessage("Caminho da imagem simplificado: {$newImagePath}");
            } else {
                $newImagePath = $processedImage;
            }
        }
    }
    
    // Preparar data
    $newsDate = $existingNews['date'];
    if (!empty($data['date'])) {
        $newsDate = $data['date'];
    }
    
    // Converter conteúdo para JSON
    $contentJson = json_encode($data['content'], JSON_UNESCAPED_UNICODE);
    
    // Processar tags: criar novas se necessário e obter IDs
    $tagsString = null;
    if (!empty($data['tags']) && is_array($data['tags'])) {
        // Se forem nomes de tags (strings), processar e criar se necessário
        $firstTag = reset($data['tags']);
        if (is_string($firstTag)) {
            $tagIds = processTagsToIds($pdo, $data['tags']);
            if (!empty($tagIds)) {
                $tagsString = implode(',', $tagIds);
            }
        } else {
            // Se já forem IDs (números), apenas concatenar
            $tagsString = implode(',', array_map('intval', $data['tags']));
        }
    }
    
    // Iniciar transação
    $pdo->beginTransaction();
    
    try {
        // Atualizar artigo
        $updateSql = "UPDATE articles SET 
            niches = :niches,
            type = :type,
            subtitle = :subtitle,
            image = :image,
            category_id = :category_id,
            author_id = :author_id,
            last_modified = NOW()
            WHERE id = :id";
        
        $stmt = $pdo->prepare($updateSql);
        $stmt->execute([
            'niches' => $data['niches'] ?? $existingNews['niches'],
            'type' => $data['type'] ?? $existingNews['type'],
            'subtitle' => $data['subtitle'] ?? '',
            'image' => $newImagePath,
            'category_id' => $categoryId,
            'author_id' => $authorId,
            'id' => $newsId
        ]);
        
        logMessage("Artigo atualizado na tabela articles");
        
        // Atualizar conteúdo na tabela article_content
        $stmt = $pdo->prepare("SELECT id FROM article_content WHERE article_id = :article_id");
        $stmt->execute(['article_id' => $newsId]);
        $contentExists = $stmt->fetch();
        
        if ($contentExists) {
            // Atualizar conteúdo existente
            $stmt = $pdo->prepare("UPDATE article_content SET text = :text WHERE article_id = :article_id");
            $stmt->execute([
                'text' => $contentJson,
                'article_id' => $newsId
            ]);
            logMessage("Conteúdo atualizado na tabela article_content");
        } else {
            // Inserir novo conteúdo
            $stmt = $pdo->prepare("INSERT INTO article_content (article_id, text) VALUES (:article_id, :text)");
            $stmt->execute([
                'article_id' => $newsId,
                'text' => $contentJson
            ]);
            logMessage("Novo conteúdo inserido na tabela article_content");
        }
        
        // Atualizar tags na tabela article_content (coluna tags)
        if ($tagsString !== null) {
            if ($contentExists) {
                $stmt = $pdo->prepare("UPDATE article_content SET tags = :tags WHERE article_id = :article_id");
                $stmt->execute([
                    'tags' => $tagsString,
                    'article_id' => $newsId
                ]);
                logMessage("Tags atualizadas na tabela article_content: {$tagsString}");
            } else {
                // Inserir tags se o conteúdo não existia
                $stmt = $pdo->prepare("INSERT INTO article_content (article_id, text, tags) VALUES (:article_id, :text, :tags)");
                $stmt->execute([
                    'article_id' => $newsId,
                    'text' => $contentJson,
                    'tags' => $tagsString
                ]);
                logMessage("Novo conteúdo e tags inseridos na tabela article_content: {$tagsString}");
            }
        }
        
        // Commit da transação
        $pdo->commit();
        
        logMessage("=== Notícia atualizada com sucesso ===");
        
        // Resposta de sucesso
        sendResponse(true, [
            'message' => 'Notícia atualizada com sucesso',
            'data' => [
                'id' => $newsId,
                'title' => $data['title'],
                'image' => $newImagePath,
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ], 200);
        
    } catch (Exception $e) {
        // Rollback em caso de erro
        $pdo->rollBack();
        throw $e;
    }
    
} catch (Exception $e) {
    logMessage("ERRO: " . $e->getMessage(), 'ERROR');
    logMessage("Stack trace: " . $e->getTraceAsString(), 'ERROR');
    
    sendResponse(false, [
        'error' => $e->getMessage(),
        'details' => ENABLE_LOGGING ? 'Verifique o log para mais detalhes' : null
    ], 500);
}
