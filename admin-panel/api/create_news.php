<?php
/**
 * API para Criar Novas Notícias
 * 
 * Este arquivo recebe dados de notícias novas e cria no banco de dados.
 * Inclui tratamento inteligente de imagens (upload Base64 e URLs).
 * 
 * Endpoint: POST /api/create_news.php
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
define('DB_HOST', 'localhost');
define('DB_NAME', 'banco_novo2');
define('DB_USER', 'bit');
define('DB_PASS', 'Atecubanos1#');
define('DB_CHARSET', 'utf8mb4');

// Diretório de upload de imagens
// A API está em api.boca.com.br, mas as imagens devem ir para o domínio principal
define('UPLOAD_DIR', '/var/www/boca.com.br/upload/imagens-resizes/');
define('UPLOAD_URL_PREFIX', 'https://images.boca.com.br/upload/imagens-resizes/');

// Configurações de log
define('LOG_FILE', __DIR__ . '/create_news.log');
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
 * Gerar slug único a partir do título
 */
function generateUniqueSlug($pdo, $title) {
    if (empty($title)) {
        logMessage("ERRO: Título vazio ao gerar slug", 'ERROR');
        throw new Exception("Título não pode estar vazio para gerar slug");
    }
    
    // Gerar slug base
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', 
        iconv('UTF-8', 'ASCII//TRANSLIT', $title))));
    
    // Remover hífens múltiplos e no início/fim
    $slug = preg_replace('/-+/', '-', $slug);
    $slug = trim($slug, '-');
    
    // Se o slug ficou vazio após processamento, usar fallback
    if (empty($slug)) {
        $slug = 'noticia-' . time();
        logMessage("Slug estava vazio, usando fallback: {$slug}", 'WARNING');
    }
    
    // Verificar se slug já existe
    $baseSlug = $slug;
    $counter = 1;
    
    while (true) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM articles WHERE slug = ?");
        $stmt->execute([$slug]);
        $count = $stmt->fetchColumn();
        
        if ($count == 0) {
            break;
        }
        
        $slug = $baseSlug . '-' . $counter;
        $counter++;
    }
    
    logMessage("Slug gerado com sucesso: {$slug}");
    return $slug;
}

/**
 * Processar imagem Base64 ou URL
 */
function processImage($imageData) {
    if (empty($imageData)) {
        return null;
    }
    
    // Se for URL externa (http/https)
    if (preg_match('/^https?:\/\//i', $imageData)) {
        // Se for URL do Boca News, extrair apenas o caminho local
        if (preg_match('/^https?:\/\/boca\.com\.br(\/upload\/imagens-resizes\/.+)$/i', $imageData, $matches)) {
            $localPath = $matches[1];
            logMessage("URL do Boca News convertida para caminho local: {$localPath}");
            return $localPath;
        }
        
        // Fazer download de URLs externas e salvar localmente
        try {
            logMessage("Fazendo download da imagem externa: {$imageData}");
            
            // Baixar imagem
            $imageContent = @file_get_contents($imageData);
            if ($imageContent === false) {
                logMessage("Erro ao baixar imagem, mantendo URL original", 'WARNING');
                return $imageData;
            }
            
            // Detectar tipo de imagem
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->buffer($imageContent);
            
            $extensionMap = [
                'image/jpeg' => 'jpg',
                'image/jpg' => 'jpg',
                'image/png' => 'png',
                'image/gif' => 'gif',
                'image/webp' => 'webp'
            ];
            
            $extension = $extensionMap[$mimeType] ?? 'jpg';
            
            // Gerar nome único
            $filename = md5(uniqid(rand(), true)) . '_858x483.' . $extension;
            $filepath = UPLOAD_DIR . $filename;
            
            logMessage("Tentando salvar em: {$filepath}");
            
            // Criar diretório se não existir
            if (!is_dir(UPLOAD_DIR)) {
                if (!mkdir(UPLOAD_DIR, 0755, true)) {
                    logMessage("Erro ao criar diretório: " . UPLOAD_DIR, 'ERROR');
                    return $imageData;
                }
                logMessage("Diretório criado: " . UPLOAD_DIR);
            }
            
            // Verificar permissões
            if (!is_writable(UPLOAD_DIR)) {
                logMessage("Diretório sem permissão de escrita: " . UPLOAD_DIR, 'WARNING');
                return $imageData;
            }
            
            // Salvar imagem
            $bytesWritten = file_put_contents($filepath, $imageContent);
            if ($bytesWritten !== false) {
                logMessage("Imagem URL baixada e salva: {$filename} ({$bytesWritten} bytes)");
                logMessage("Caminho completo: {$filepath}");
                logMessage("UPLOAD_DIR constante: " . UPLOAD_DIR);
                logMessage("__DIR__ atual: " . __DIR__);
                
                // Verificar se arquivo foi realmente criado
                if (file_exists($filepath)) {
                    $realPath = realpath($filepath);
                    logMessage("Arquivo confirmado no disco");
                    logMessage("Caminho real (realpath): {$realPath}");
                    logMessage("Tamanho do arquivo: " . filesize($filepath) . " bytes");
                    logMessage("Permissões do arquivo: " . substr(sprintf('%o', fileperms($filepath)), -4));
                    
                    // Retornar URL completa
                    $fullUrl = UPLOAD_URL_PREFIX . $filename;
                    logMessage("URL completa da imagem: {$fullUrl}");
                    
                    return $fullUrl;
                } else {
                    logMessage("Arquivo não encontrado após gravação!", 'ERROR');
                    logMessage("Listando arquivos no diretório UPLOAD_DIR:");
                    $files = scandir(UPLOAD_DIR);
                    logMessage("Arquivos encontrados: " . implode(', ', array_slice($files, 0, 10)), 'ERROR');
                    return $imageData;
                }
            } else {
                $error = error_get_last();
                logMessage("Erro ao salvar: " . ($error['message'] ?? 'desconhecido'), 'WARNING');
                return $imageData;
            }
        } catch (Exception $e) {
            logMessage("Exceção ao processar URL externa: " . $e->getMessage(), 'WARNING');
            return $imageData;
        }
    }
    
    // Se for Base64
    if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $matches)) {
        $imageType = $matches[1]; // jpeg, png, gif, etc
        
        // Mapear tipo para extensão correta
        $extensionMap = [
            'jpeg' => 'jpg',
            'jpg' => 'jpg',
            'png' => 'png',
            'gif' => 'gif',
            'webp' => 'webp'
        ];
        $extension = $extensionMap[$imageType] ?? 'jpg';
        
        $imageBase64 = substr($imageData, strpos($imageData, ',') + 1);
        $imageDecoded = base64_decode($imageBase64);
        
        if ($imageDecoded === false) {
            logMessage("Erro ao decodificar imagem Base64", 'ERROR');
            throw new Exception("Erro ao decodificar imagem Base64");
        }
        
        // Gerar nome único no formato padrão: hash_858x483.ext
        $filename = md5(uniqid(rand(), true)) . '_858x483.' . $extension;
        $filepath = UPLOAD_DIR . $filename;
        
        // Criar diretório se não existir
        if (!is_dir(UPLOAD_DIR)) {
            if (!mkdir(UPLOAD_DIR, 0755, true)) {
                logMessage("Erro ao criar diretório: " . UPLOAD_DIR, 'ERROR');
                throw new Exception("Erro ao criar diretório de upload");
            }
            logMessage("Diretório criado: " . UPLOAD_DIR);
        }
        
        // Salvar imagem
        $bytesWritten = file_put_contents($filepath, $imageDecoded);
        if ($bytesWritten !== false) {
            logMessage("Imagem Base64 salva: {$filename} ({$bytesWritten} bytes)");
            logMessage("Caminho completo: {$filepath}");
            
            if (file_exists($filepath)) {
                $realPath = realpath($filepath);
                logMessage("Caminho real (realpath): {$realPath}");
                logMessage("Tamanho: " . filesize($filepath) . " bytes");
                
                // Retornar URL completa
                $fullUrl = UPLOAD_URL_PREFIX . $filename;
                logMessage("URL completa da imagem: {$fullUrl}");
            }
            
            return $fullUrl ?? (UPLOAD_URL_PREFIX . $filename);
        } else {
            logMessage("Erro ao salvar imagem no servidor: " . error_get_last()['message'], 'ERROR');
            throw new Exception("Erro ao salvar imagem");
        }
    }
    
    // Se for caminho local no formato /upload/imagens-resizes/...
    if (strpos($imageData, '/upload/imagens-resizes/') === 0) {
        logMessage("Imagem já existe no servidor (caminho local): {$imageData}");
        return $imageData;
    }
    
    // Se for caminho local no formato /upload/imagens-resizes-webp/...
    if (strpos($imageData, '/upload/imagens-resizes-webp/') === 0) {
        logMessage("Imagem WebP já existe no servidor: {$imageData}");
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
        logMessage("Categoria existente encontrada: {$categoryName} (ID: {$category['id']})");
        return $category['id'];
    }
    
    // Criar nova categoria com slug
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', 
        iconv('UTF-8', 'ASCII//TRANSLIT', $categoryName))));
    $slug = preg_replace('/-+/', '-', $slug);
    $slug = trim($slug, '-');
    
    // Se slug vazio, usar fallback
    if (empty($slug)) {
        $slug = 'categoria-' . time();
    }
    
    $stmt = $pdo->prepare("INSERT INTO categories (name, slug) VALUES (:name, :slug)");
    $stmt->execute([
        'name' => $categoryName,
        'slug' => $slug
    ]);
    
    $categoryId = $pdo->lastInsertId();
    logMessage("Nova categoria criada: {$categoryName} (ID: {$categoryId}, Slug: {$slug})");
    
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
        logMessage("Autor existente encontrado: {$authorName} (ID: {$author['id']})");
        return $author['id'];
    }
    
    // Criar novo autor com slug
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', 
        iconv('UTF-8', 'ASCII//TRANSLIT', $authorName))));
    $slug = preg_replace('/-+/', '-', $slug);
    $slug = trim($slug, '-');
    
    // Se slug vazio, usar fallback
    if (empty($slug)) {
        $slug = 'autor-' . time();
    }
    
    $stmt = $pdo->prepare("INSERT INTO authors (name, slug) VALUES (:name, :slug)");
    $stmt->execute([
        'name' => $authorName,
        'slug' => $slug
    ]);
    
    $authorId = $pdo->lastInsertId();
    logMessage("Novo autor criado: {$authorName} (ID: {$authorId}, Slug: {$slug})");
    
    return $authorId;
}

/**
 * Processar tags - criar novas tags se não existirem e retornar string com IDs separados por vírgula
 */
function processTagsToIds($pdo, $tags) {
    if (empty($tags) || !is_array($tags)) {
        return null;
    }
    
    $tagIds = [];
    
    foreach ($tags as $tagName) {
        $tagName = trim($tagName);
        if (empty($tagName)) {
            continue;
        }
        
        // Gerar slug da tag
        $tagSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', 
            iconv('UTF-8', 'ASCII//TRANSLIT', $tagName))));
        $tagSlug = preg_replace('/-+/', '-', $tagSlug);
        $tagSlug = trim($tagSlug, '-');
        
        // Buscar tag existente pelo slug
        $stmt = $pdo->prepare("SELECT id FROM tags WHERE slug = :slug LIMIT 1");
        $stmt->execute(['slug' => $tagSlug]);
        $tag = $stmt->fetch();
        
        if ($tag) {
            $tagIds[] = $tag['id'];
            logMessage("Tag existente encontrada: {$tagName} (ID: {$tag['id']})");
        } else {
            // Criar nova tag
            $tagNameFormatted = ucwords(str_replace("-", " ", $tagSlug));

            try {
                $stmt = $pdo->prepare("INSERT INTO tags (name, slug) VALUES (:name, :slug)");
                $stmt->execute([
                    'name' => $tagNameFormatted,
                    'slug' => $tagSlug
                ]);
                
                $newTagId = $pdo->lastInsertId();
                $tagIds[] = $newTagId;
                logMessage("Nova tag criada: {$tagNameFormatted} (ID: {$newTagId}, Slug: {$tagSlug})");
            } catch (Exception $e) {
                logMessage("Erro ao criar tag {$tagName}: " . $e->getMessage(), 'WARNING');
                // Continua sem adicionar a tag se falhar
            }
        }
    }
    
    return !empty($tagIds) ? implode(',', $tagIds) : null;
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
    
    logMessage("=== Início da criação de notícia ===");
    logMessage("Dados recebidos: " . json_encode($data, JSON_UNESCAPED_UNICODE));
    
    // Validações básicas
    if (empty($data['title'])) {
        throw new Exception('Título é obrigatório');
    }
    
    if (empty($data['category']['nome'])) {
        throw new Exception('Categoria é obrigatória');
    }
    
    if (empty($data['content']) || !is_array($data['content'])) {
        throw new Exception('Conteúdo deve ser um array com pelo menos um bloco');
    }
    
    // Conectar ao banco
    $pdo = getDatabaseConnection();
    
    // Preparar título
    $title = trim($data['title']);
    if (empty($title)) {
        throw new Exception('Título não pode estar vazio');
    }
    logMessage("Título da notícia: {$title}");
    
    // Gerar slug único - CRÍTICO: deve ser sempre gerado
    $slug = generateUniqueSlug($pdo, $title);
    if (empty($slug)) {
        throw new Exception('Erro crítico: slug não foi gerado');
    }
    logMessage("Slug gerado com sucesso: {$slug}");
    
    // Processar categoria
    $categoryId = getCategoryId($pdo, $data['category']['nome']);
    logMessage("ID da categoria: {$categoryId}");
    
    // Processar autor
    $authorName = $data['author'] ?? 'Redação';
    $authorId = getAuthorId($pdo, $authorName);
    
    // Processar imagem
    $imagePath = null;
    if (!empty($data['image'])) {
        $processedImage = processImage($data['image']);
        if ($processedImage !== null) {
            // Manter URL completa retornada pela função processImage
            $imagePath = $processedImage;
            logMessage("URL da imagem processada: {$imagePath}");
        }
    }
    
    // Preparar data
    $newsDate = $data['date'] ?? date('Y-m-d');
    
    // Converter conteúdo para JSON
    $contentJson = json_encode($data['content'], JSON_UNESCAPED_UNICODE);
    
    // Converter tags para string com IDs separados por vírgula
    $tagsString = null;
    if (!empty($data['tags']) && is_array($data['tags'])) {
        $tagsString = processTagsToIds($pdo, $data['tags']);
        logMessage("Tags processadas: " . ($tagsString ?? 'nenhuma'));
    }
    
    // Preparar outros campos
    $subtitle = $data['subtitle'] ?? '';
    $contentType = $data['type'] ?? 'noticia';
    $niche = $data['niches'] ?? 'agro';
    
    // Validar que o slug foi gerado
    if (empty($slug)) {
        throw new Exception("Erro ao gerar slug para a notícia");
    }
    
    // Log de todos os dados que serão inseridos
    logMessage("Dados preparados - Título: {$title}, Slug: {$slug}, Categoria ID: {$categoryId}, Autor ID: {$authorId}");
    logMessage("Imagem: " . ($imagePath ?? 'nenhuma') . ", Data: {$newsDate}, Tipo: {$contentType}, Nicho: {$niche}");
    
    // Iniciar transação
    $pdo->beginTransaction();
    
    try {
        // Obter o próximo ID disponível (articles não tem AUTO_INCREMENT)
        $stmt = $pdo->query("SELECT MAX(id) as max_id FROM articles");
        $result = $stmt->fetch();
        $nextId = ($result['max_id'] ?? 0) + 1;
        logMessage("Próximo ID disponível para articles: {$nextId}");
        
        // Inserir artigo na tabela articles (incluindo id manualmente)
        $insertArticleSql = "INSERT INTO articles (
            id, title, slug, niches, type, subtitle, image, 
            category_id, author_id, date, last_modified
        ) VALUES (
            :id, :title, :slug, :niches, :type, :subtitle, :image,
            :category_id, :author_id, :date, NOW()
        )";
        
        $stmt = $pdo->prepare($insertArticleSql);
        
        // Log dos parâmetros do INSERT
        $params = [
            'id' => $nextId,
            'title' => $title,
            'slug' => $slug,
            'niches' => $niche,
            'type' => $contentType,
            'subtitle' => $subtitle,
            'image' => $imagePath,
            'category_id' => $categoryId,
            'author_id' => $authorId,
            'date' => $newsDate
        ];
        logMessage("Parâmetros do INSERT: " . json_encode($params, JSON_UNESCAPED_UNICODE));
        
        $stmt->execute($params);
        
        $newsId = $nextId; // Usar o ID que geramos manualmente
        logMessage("Artigo criado na tabela articles com ID: {$newsId}");
        
        // Inserir conteúdo na tabela article_content (id é AUTO_INCREMENT, não incluir)
        $insertContentSql = "INSERT INTO article_content (article_id, text, tags) VALUES (:article_id, :text, :tags)";
        $stmt = $pdo->prepare($insertContentSql);
        
        $contentParams = [
            'article_id' => $newsId,
            'text' => $contentJson,
            'tags' => $tagsString
        ];
        logMessage("Inserindo conteúdo para article_id: {$newsId}, tags: " . ($tagsString ?? 'NULL'));
        
        $stmt->execute($contentParams);
        
        $contentId = $pdo->lastInsertId();
        logMessage("Conteúdo inserido na tabela article_content com ID: {$contentId}");
        
        // Commit da transação
        $pdo->commit();
        
        logMessage("=== Notícia criada com sucesso ===");
        
        // Resposta de sucesso
        sendResponse(true, [
            'message' => 'Notícia criada com sucesso',
            'id' => $newsId,
            'slug' => $slug,
            'data' => [
                'id' => $newsId,
                'title' => $title,
                'slug' => $slug,
                'category' => [
                    'nome' => $data['category']['nome'],
                    'slug' => $data['category']['slug'] ?? ''
                ],
                'image' => $imagePath,
                'date' => $newsDate,
                'author' => $authorName,
                'created_at' => date('Y-m-d H:i:s')
            ]
        ], 201);
        
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
