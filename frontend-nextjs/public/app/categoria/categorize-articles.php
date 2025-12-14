<?php
/**
 * Script de Categorização Automática de Artigos
 * 
 * Analisa o conteúdo dos artigos e atribui categorias automaticamente
 * baseado em palavras-chave.
 * 
 * Uso: php scripts/categorize-articles.php [--dry-run] [--limit=50]
 */

// ============================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// ============================================
define('DB_HOST', 'localhost');
define('DB_USER', 'bit');
define('DB_PASS', 'Atecubanos1#');
define('DB_NAME', 'banco_novo2');

// ============================================
// PALAVRAS-CHAVE POR CATEGORIA (EXPANDIDO)
// ============================================
$CATEGORY_KEYWORDS = [
    'Agronegócio' => [
        // Grãos e culturas
        'soja', 'milho', 'trigo', 'café', 'algodão', 'cana', 'cana-de-açúcar', 'arroz', 'feijão',
        'sorgo', 'girassol', 'amendoim', 'aveia', 'cevada', 'centeio', 'mandioca', 'batata',
        // Pecuária
        'pecuária', 'gado', 'boi', 'vaca', 'suíno', 'porco', 'frango', 'ave', 'avicultura',
        'bovinocultura', 'suinocultura', 'ovino', 'caprino', 'piscicultura', 'aquicultura', 'leite', 'carne',
        // Agricultura geral
        'agricultura', 'agropecuária', 'fazenda', 'plantio', 'colheita', 'safra', 'entressafra',
        'produtor rural', 'agronegócio', 'agrícola', 'rural', 'campo', 'roça', 'lavoura',
        'fertilizante', 'defensivo', 'agrotóxico', 'adubo', 'trator', 'maquinário agrícola',
        'irrigação', 'solo', 'terra', 'hectare', 'produtividade', 'rendimento', 'produção agrícola'
    ],
    'Economia' => [
        'dólar', 'real', 'moeda', 'câmbio', 'economia', 'financeiro', 'banco', 'juros', 'inflação',
        'pib', 'mercado financeiro', 'bolsa', 'ações', 'investimento', 'crise', 'recessão',
        'econômico', 'fiscal', 'monetário', 'crédito', 'empréstimo', 'dívida', 'financiamento',
        'orçamento', 'receita', 'despesa', 'imposto', 'tributo', 'taxa', 'selic', 'copom',
        'banco central', 'bc', 'fazenda', 'ministério da economia', 'balanço', 'faturamento',
        'lucro', 'prejuízo', 'déficit', 'superávit', 'balança comercial'
    ],
    'Mercado' => [
        'preço', 'cotação', 'bolsa', 'commodity', 'commodities', 'exportação', 'importação',
        'comercial', 'mercado', 'venda', 'compra', 'negociação', 'trader', 'trading',
        'b3', 'cbot', 'chicago', 'mercado futuro', 'mercado spot', 'mercado físico',
        'oferta', 'demanda', 'estoque', 'armazenagem', 'armazém', 'silo',
        'prêmio', 'desconto', 'spread', 'margem', 'comercialização', 'escoamento',
        'porto', 'exportador', 'importador', 'trading', 'corretora', 'negócio'
    ],
    'Tecnologia' => [
        'tecnologia', 'digital', 'app', 'aplicativo', 'software', 'sistema', 'plataforma',
        'computador', 'internet', 'online', 'inovação', 'inovador', 'tecnológico',
        'inteligência artificial', 'ia', 'ai', 'machine learning', 'automação', 'robótica',
        'drone', 'sensor', 'iot', 'agricultura de precisão', 'agricultura 4.0', 'tech',
        'startup', 'agtech', 'fintech', 'blockchain', 'big data', 'análise de dados',
        'conectividade', '5g', 'satélite', 'gps', 'georreferenciamento', 'monitor'
    ],
    'Clima' => [
        'clima', 'tempo', 'chuva', 'seca', 'estiagem', 'temperatura', 'meteorologia',
        'previsão do tempo', 'el niño', 'la niña', 'climático', 'temporal', 'tempestade',
        'geada', 'granizo', 'neve', 'inundação', 'enchente', 'alagamento',
        'sol', 'nuvem', 'umidade', 'vento', 'ventania', 'ciclone', 'tornado',
        'fenômeno climático', 'mudança climática', 'aquecimento', 'precipitação',
        'índice pluviométrico', 'mm de chuva', 'frente fria', 'massa de ar'
    ],
    'Política' => [
        'política', 'político', 'governo', 'governamental', 'presidente', 'ministro', 'senador', 'deputado',
        'congresso', 'senado', 'câmara', 'lei', 'projeto de lei', 'pl', 'mp',
        'medida provisória', 'eleição', 'partido', 'votação', 'voto', 'plenário',
        'parlamento', 'legislativo', 'executivo', 'judiciário', 'stf', 'supremo',
        'lula', 'bolsonaro', 'dilma', 'temer', 'planalto', 'brasília',
        'reforma', 'tributária', 'administrativa', 'previdenciária'
    ],
    'Meio Ambiente' => [
        'meio ambiente', 'ambiental', 'sustentabilidade', 'sustentável', 'ecologia', 'ecológico',
        'desmatamento', 'desmatar', 'floresta', 'amazônia', 'cerrado', 'pantanal', 'mata atlântica',
        'biodiversidade', 'preservação', 'conservação', 'proteção ambiental',
        'poluição', 'carbono', 'emissão', 'co2', 'gases de efeito estufa',
        'aquecimento global', 'mudança climática', 'reciclagem', 'lixo', 'resíduo',
        'água', 'rio', 'recurso natural', 'energia renovável', 'solar', 'eólica',
        'ibama', 'icmbio', 'licença ambiental', 'código florestal', 'reserva legal'
    ],
    'Internacional' => [
        'internacional', 'mundial', 'global', 'exterior', 'estrangeiro', 'importado', 'exportado',
        'china', 'chinês', 'eua', 'estados unidos', 'americano', 'europa', 'europeu',
        'ásia', 'asiático', 'argentina', 'argentino', 'paraguai', 'uruguai',
        'mercosul', 'omc', 'fao', 'onu', 'união europeia', 'guerra comercial',
        'exportação', 'importação', 'comércio internacional', 'comércio exterior',
        'acordo comercial', 'tratado', 'tarifa', 'barreira comercial', 'protecionismo'
    ],
    'Saúde' => [
        'saúde', 'sanitário', 'doença', 'vírus', 'bacteria', 'bactéria', 'vacina', 'vacinação',
        'medicamento', 'remédio', 'hospital', 'médico', 'tratamento', 'terapia',
        'pandemia', 'epidemia', 'surto', 'contaminação', 'infecção',
        'covid', 'covid-19', 'coronavírus', 'gripe', 'febre', 'sintoma', 'diagnóstico',
        'prevenção', 'sistema de saúde', 'sus', 'anvisa', 'ministério da saúde',
        'higiene', 'sanitização', 'segurança alimentar', 'rastreabilidade'
    ],
    'Educação' => [
        'educação', 'educacional', 'escola', 'escolar', 'universidade', 'faculdade', 'curso', 'ensino',
        'professor', 'aluno', 'estudante', 'aula', 'formação', 'capacitação', 'qualificação',
        'treinamento', 'aprendizado', 'pedagogia', 'didática', 'mec', 'ministério da educação',
        'acadêmico', 'pesquisa', 'estudo', 'embrapa', 'extensão rural', 'assistência técnica'
    ],
    'Notícias' => [
        'notícia', 'informação', 'comunicado', 'divulgação', 'anúncio'
    ]
];

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function conectarBanco() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        die("❌ Erro ao conectar ao banco: " . $e->getMessage() . "\n");
    }
}

function createSlug($text) {
    $text = mb_strtolower($text, 'UTF-8');
    $text = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    return trim($text, '-');
}

function analyzeContent($title, $subtitle, $content, $categoryKeywords) {
    $fullText = mb_strtolower("$title $subtitle $content", 'UTF-8');
    $categoryScores = [];
    
    foreach ($categoryKeywords as $category => $keywords) {
        if ($category === 'Notícias') continue; // Pular categoria padrão na análise
        
        $score = 0;
        
        foreach ($keywords as $keyword) {
            $pattern = '/\b' . preg_quote($keyword, '/') . '\b/ui';
            $matches = preg_match_all($pattern, $fullText);
            
            if ($matches > 0) {
                // Peso maior para palavras no título (5x)
                if (stripos($title, $keyword) !== false) {
                    $score += $matches * 5;
                } 
                // Peso médio para palavras no subtítulo (3x)
                elseif ($subtitle && stripos($subtitle, $keyword) !== false) {
                    $score += $matches * 3;
                } 
                // Peso normal para palavras no conteúdo (1x)
                else {
                    $score += $matches;
                }
            }
        }
        
        $categoryScores[$category] = $score;
    }
    
    // Encontrar categoria com maior score
    arsort($categoryScores);
    $bestCategory = 'Notícias'; // Categoria padrão
    $maxScore = 0;
    
    foreach ($categoryScores as $category => $score) {
        if ($score > 0) { // Só considera se houver match
            $bestCategory = $category;
            $maxScore = $score;
            break;
        }
    }
    
    return [
        'category' => $bestCategory,
        'score' => $maxScore,
        'allScores' => $categoryScores
    ];
}

function ensureCategories($pdo, $categories) {
    echo "📋 Verificando categorias no banco de dados...\n";
    
    $categories[] = 'Notícias'; // Adicionar categoria padrão
    
    foreach ($categories as $categoryName) {
        $slug = createSlug($categoryName);
        
        $stmt = $pdo->prepare("SELECT id FROM categories WHERE slug = ?");
        $stmt->execute([$slug]);
        
        if (!$stmt->fetch()) {
            $stmt = $pdo->prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
            $stmt->execute([$categoryName, $slug]);
            echo "  ✅ Categoria criada: $categoryName\n";
        }
    }
    
    echo "✅ Categorias verificadas!\n\n";
}

function getCategoryId($pdo, $categoryName) {
    $slug = createSlug($categoryName);
    
    $stmt = $pdo->prepare("SELECT id FROM categories WHERE slug = ?");
    $stmt->execute([$slug]);
    $result = $stmt->fetch();
    
    if ($result) {
        return $result['id'];
    }
    
    // Se não encontrar, retorna categoria "Notícias"
    $stmt = $pdo->prepare("SELECT id FROM categories WHERE slug = 'noticias'");
    $stmt->execute();
    $result = $stmt->fetch();
    
    return $result ? $result['id'] : null;
}

function categorizeArticles($pdo, $categoryKeywords, $options = []) {
    $dryRun = $options['dryRun'] ?? false;
    $limit = $options['limit'] ?? null;
    $forceAll = $options['forceAll'] ?? false;
    
    echo "🔍 Buscando artigos para categorizar...\n\n";
    
    // Buscar artigos sem categoria ou forçar todos
    if ($forceAll) {
        $query = "
            SELECT a.id, a.title, a.subtitle, ac.text, c.name as current_category
            FROM articles a
            LEFT JOIN article_content ac ON a.id = ac.article_id
            LEFT JOIN categories c ON a.category_id = c.id
            ORDER BY a.id DESC
        ";
    } else {
        $query = "
            SELECT a.id, a.title, a.subtitle, ac.text, c.name as current_category
            FROM articles a
            LEFT JOIN article_content ac ON a.id = ac.article_id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.category_id IS NULL
            ORDER BY a.id DESC
        ";
    }
    
    if ($limit) {
        $query .= " LIMIT $limit";
    }
    
    $stmt = $pdo->query($query);
    $articles = $stmt->fetchAll();
    
    echo "📝 Encontrados " . count($articles) . " artigos para analisar\n\n";
    echo str_repeat('═', 80) . "\n";
    
    $categorized = 0;
    $unchanged = 0;
    $errors = 0;
    
    foreach ($articles as $article) {
        try {
            $analysis = analyzeContent(
                $article['title'],
                $article['subtitle'],
                $article['text'],
                $categoryKeywords
            );
            
            echo "\n📰 Artigo #{$article['id']}: " . mb_substr($article['title'], 0, 60) . "...\n";
            echo "   Categoria Atual: " . ($article['current_category'] ?: 'Nenhuma') . "\n";
            echo "   Categoria Sugerida: {$analysis['category']} (Score: {$analysis['score']})\n";
            
            // Mostrar top 3 categorias
            arsort($analysis['allScores']);
            $topScores = array_slice($analysis['allScores'], 0, 3, true);
            
            echo "   Top 3 Categorias:\n";
            foreach ($topScores as $cat => $score) {
                echo "      $cat: $score\n";
            }
            
            if ($analysis['score'] === 0) {
                echo "   ⚠️  Nenhuma palavra-chave encontrada, mantendo categoria padrão\n";
                $unchanged++;
                continue;
            }
            
            $categoryId = getCategoryId($pdo, $analysis['category']);
            
            if (!$categoryId) {
                echo "   ❌ Erro: Categoria não encontrada no banco\n";
                $errors++;
                continue;
            }
            
            if (!$dryRun) {
                $stmt = $pdo->prepare("UPDATE articles SET category_id = ? WHERE id = ?");
                $stmt->execute([$categoryId, $article['id']]);
                echo "   ✅ Categoria atualizada para: {$analysis['category']}\n";
                $categorized++;
            } else {
                echo "   🔍 [DRY RUN] Seria atualizado para: {$analysis['category']}\n";
                $categorized++;
            }
            
        } catch (Exception $e) {
            echo "   ❌ Erro ao processar artigo: " . $e->getMessage() . "\n";
            $errors++;
        }
    }
    
    echo "\n" . str_repeat('═', 80) . "\n";
    echo "\n📊 RESUMO DA CATEGORIZAÇÃO:\n";
    echo "   ✅ Artigos categorizados: $categorized\n";
    echo "   ⚠️  Artigos sem mudança: $unchanged\n";
    echo "   ❌ Erros: $errors\n";
    echo "   📝 Total analisado: " . count($articles) . "\n";
    
    if ($dryRun) {
        echo "\n   ℹ️  Modo DRY RUN - Nenhuma alteração foi feita no banco de dados\n";
    }
}

// ============================================
// EXECUÇÃO PRINCIPAL
// ============================================

echo "🚀 Iniciando Script de Categorização Automática\n\n";
echo str_repeat('═', 80) . "\n";

// Processar argumentos da linha de comando
$options = [
    'dryRun' => in_array('--dry-run', $argv),
    'forceAll' => in_array('--force-all', $argv) || in_array('--all', $argv),
    'limit' => null
];

foreach ($argv as $i => $arg) {
    if (strpos($arg, '--limit=') === 0) {
        $options['limit'] = (int)substr($arg, 8);
    } elseif ($arg === '--limit' && isset($argv[$i + 1])) {
        $options['limit'] = (int)$argv[$i + 1];
    }
}

// Mostrar modo de operação
if ($options['forceAll']) {
    echo "⚠️  Modo FORCE ALL: Recategorizando TODOS os artigos\n\n";
} else {
    echo "📝 Modo padrão: Categorizando apenas artigos SEM categoria\n\n";
}

try {
    echo "🔌 Conectando ao banco de dados...\n";
    $pdo = conectarBanco();
    echo "✅ Conectado com sucesso!\n\n";
    
    ensureCategories($pdo, array_keys($CATEGORY_KEYWORDS));
    
    if ($options['dryRun']) {
        echo "ℹ️  Modo DRY RUN ativado - Apenas simulação\n\n";
    }
    
    if ($options['limit']) {
        echo "ℹ️  Limitado a {$options['limit']} artigos\n\n";
    }
    
    categorizeArticles($pdo, $CATEGORY_KEYWORDS, $options);
    
    echo "\n✅ Script concluído com sucesso!\n";
    
} catch (Exception $e) {
    echo "\n❌ Erro fatal: " . $e->getMessage() . "\n";
    exit(1);
}
