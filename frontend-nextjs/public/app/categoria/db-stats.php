<?php
/**
 * Script de Estatísticas e Verificação do Banco de Dados
 * 
 * Mostra informações sobre artigos, categorias, autores e qualidade dos dados
 * 
 * Uso: php scripts/db-stats.php [--recent] [--limit=20]
 */

// ============================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// ============================================
define('DB_HOST', 'localhost');
define('DB_PORT', '80');
define('DB_USER', 'bit');
define('DB_PASS', 'Atecubanos1#');
define('DB_NAME', 'banco_novo2');

// ============================================
// FUNÇÕES
// ============================================

function conectarBanco() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4",
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

function getStats($pdo) {
    echo "📊 ESTATÍSTICAS DO BANCO DE DADOS\n\n";
    echo str_repeat('═', 80) . "\n";
    
    // Total de artigos
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM articles");
    $totalArticles = $stmt->fetch()['total'];
    echo "\n📰 ARTIGOS:\n";
    echo "   Total: $totalArticles\n";
    
    // Artigos por categoria
    $stmt = $pdo->query("
        SELECT c.name, COUNT(a.id) as total
        FROM categories c
        LEFT JOIN articles a ON c.id = a.category_id
        GROUP BY c.id, c.name
        ORDER BY total DESC
    ");
    $byCategory = $stmt->fetchAll();
    
    echo "\n📁 DISTRIBUIÇÃO POR CATEGORIA:\n";
    foreach ($byCategory as $cat) {
        $percentage = $totalArticles > 0 ? ($cat['total'] / $totalArticles) * 100 : 0;
        $bar = str_repeat('█', (int)($cat['total'] / 10) ?: 1);
        printf("   %-20s %5d (%5.1f%%) %s\n", $cat['name'], $cat['total'], $percentage, $bar);
    }
    
    // Artigos sem categoria
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM articles WHERE category_id IS NULL");
    $noCategory = $stmt->fetch()['total'];
    echo "\n⚠️  Artigos sem categoria: $noCategory\n";
    
    // Artigos em destaque
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM articles WHERE featured = 1");
    $featured = $stmt->fetch()['total'];
    echo "⭐ Artigos em destaque: $featured\n";
    
    // Artigos sem conteúdo
    $stmt = $pdo->query("
        SELECT COUNT(*) as total 
        FROM articles a 
        LEFT JOIN article_content ac ON a.id = ac.article_id 
        WHERE ac.text IS NULL OR ac.text = ''
    ");
    $noContent = $stmt->fetch()['total'];
    echo "❌ Artigos sem conteúdo: $noContent\n";
    
    // Total de categorias
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM categories");
    $totalCategories = $stmt->fetch()['total'];
    echo "\n🏷️  CATEGORIAS:\n";
    echo "   Total: $totalCategories\n";
    
    // Total de autores
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM authors");
    $totalAuthors = $stmt->fetch()['total'];
    echo "\n✍️  AUTORES:\n";
    echo "   Total: $totalAuthors\n";
    
    // Top 10 autores
    $stmt = $pdo->query("
        SELECT au.name, COUNT(a.id) as total
        FROM authors au
        LEFT JOIN articles a ON au.id = a.author_id
        GROUP BY au.id, au.name
        ORDER BY total DESC
        LIMIT 10
    ");
    $topAuthors = $stmt->fetchAll();
    
    echo "\n   Top 10 Autores Mais Produtivos:\n";
    foreach ($topAuthors as $i => $author) {
        printf("   %2d. %-30s %d artigos\n", $i + 1, $author['name'], $author['total']);
    }
    
    // Artigos sem autor
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM articles WHERE author_id IS NULL");
    $noAuthor = $stmt->fetch()['total'];
    echo "\n   ⚠️  Artigos sem autor: $noAuthor\n";
    
    // Total de tags
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM tags");
    $totalTags = $stmt->fetch()['total'];
    echo "\n🏷️  TAGS:\n";
    echo "   Total: $totalTags\n";
    
    // Datas
    $stmt = $pdo->query("
        SELECT 
            MIN(date) as oldest,
            MAX(date) as newest,
            COUNT(CASE WHEN date >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as last_week,
            COUNT(CASE WHEN date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as last_month
        FROM articles
        WHERE date IS NOT NULL
    ");
    $dateStats = $stmt->fetch();
    
    if ($dateStats['oldest']) {
        echo "\n📅 DATAS:\n";
        echo "   Artigo mais antigo: " . date('d/m/Y', strtotime($dateStats['oldest'])) . "\n";
        echo "   Artigo mais recente: " . date('d/m/Y', strtotime($dateStats['newest'])) . "\n";
        echo "   Últimos 7 dias: {$dateStats['last_week']} artigos\n";
        echo "   Últimos 30 dias: {$dateStats['last_month']} artigos\n";
    }
    
    // Score médio
    $stmt = $pdo->query("
        SELECT 
            AVG(score) as avg_score,
            MIN(score) as min_score,
            MAX(score) as max_score
        FROM articles
        WHERE score IS NOT NULL
    ");
    $scoreStats = $stmt->fetch();
    
    echo "\n📈 SCORE (Qualidade):\n";
    printf("   Médio: %.2f\n", $scoreStats['avg_score'] ?: 0);
    echo "   Mínimo: " . ($scoreStats['min_score'] ?: 0) . "\n";
    echo "   Máximo: " . ($scoreStats['max_score'] ?: 0) . "\n";
    
    // Tipos de artigo
    $stmt = $pdo->query("
        SELECT type, COUNT(*) as total
        FROM articles
        WHERE type IS NOT NULL
        GROUP BY type
        ORDER BY total DESC
    ");
    $types = $stmt->fetchAll();
    
    if (count($types) > 0) {
        echo "\n📝 TIPOS DE ARTIGO:\n";
        foreach ($types as $type) {
            echo "   {$type['type']}: {$type['total']}\n";
        }
    }
    
    // Nichos
    $stmt = $pdo->query("
        SELECT niches, COUNT(*) as total
        FROM articles
        WHERE niches IS NOT NULL
        GROUP BY niches
        ORDER BY total DESC
    ");
    $niches = $stmt->fetchAll();
    
    if (count($niches) > 0) {
        echo "\n🎯 NICHOS:\n";
        foreach ($niches as $niche) {
            echo "   {$niche['niches']}: {$niche['total']}\n";
        }
    }
    
    echo "\n" . str_repeat('═', 80) . "\n";
}

function checkDataQuality($pdo) {
    echo "\n\n🔍 VERIFICAÇÃO DE QUALIDADE DOS DADOS\n\n";
    echo str_repeat('═', 80) . "\n";
    
    $issues = [];
    
    // Títulos duplicados
    $stmt = $pdo->query("
        SELECT title, COUNT(*) as count
        FROM articles
        GROUP BY title
        HAVING count > 1
        LIMIT 5
    ");
    $dupTitles = $stmt->fetchAll();
    
    if (count($dupTitles) > 0) {
        echo "\n⚠️  Títulos Duplicados: " . count($dupTitles) . "\n";
        foreach ($dupTitles as $dup) {
            echo "   \"" . mb_substr($dup['title'], 0, 60) . "...\" ({$dup['count']}x)\n";
        }
        $issues[] = 'Títulos duplicados';
    }
    
    // Slugs duplicados
    $stmt = $pdo->query("
        SELECT slug, COUNT(*) as count
        FROM articles
        GROUP BY slug
        HAVING count > 1
        LIMIT 5
    ");
    $dupSlugs = $stmt->fetchAll();
    
    if (count($dupSlugs) > 0) {
        echo "\n⚠️  Slugs Duplicados: " . count($dupSlugs) . "\n";
        foreach ($dupSlugs as $dup) {
            echo "   \"{$dup['slug']}\" ({$dup['count']}x)\n";
        }
        $issues[] = 'Slugs duplicados';
    }
    
    // Artigos sem data
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM articles WHERE date IS NULL");
    $noDate = $stmt->fetch()['total'];
    
    if ($noDate > 0) {
        echo "\n⚠️  Artigos sem data: $noDate\n";
        $issues[] = 'Artigos sem data';
    }
    
    // Artigos com título muito curto
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM articles WHERE LENGTH(title) < 20");
    $shortTitle = $stmt->fetch()['total'];
    
    if ($shortTitle > 0) {
        echo "\n⚠️  Artigos com título muito curto (< 20 chars): $shortTitle\n";
        $issues[] = 'Títulos muito curtos';
    }
    
    // Artigos sem imagem
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM articles WHERE image IS NULL OR image = ''");
    $noImage = $stmt->fetch()['total'];
    
    if ($noImage > 0) {
        echo "\n⚠️  Artigos sem imagem: $noImage\n";
        $issues[] = 'Artigos sem imagem';
    }
    
    // Resumo
    echo "\n" . str_repeat('═', 80) . "\n";
    
    if (count($issues) === 0) {
        echo "\n✅ Nenhum problema de qualidade encontrado!\n";
    } else {
        echo "\n⚠️  " . count($issues) . " tipo(s) de problema encontrado(s):\n";
        foreach ($issues as $i => $issue) {
            echo "   " . ($i + 1) . ". $issue\n";
        }
        echo "\n💡 Execute scripts de limpeza para corrigir estes problemas.\n";
    }
}

function showRecentArticles($pdo, $limit = 10) {
    echo "\n\n📰 ÚLTIMOS $limit ARTIGOS\n\n";
    echo str_repeat('═', 80) . "\n";
    
    $stmt = $pdo->prepare("
        SELECT 
            a.id,
            a.title,
            c.name as category,
            au.name as author,
            a.date,
            a.featured
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN authors au ON a.author_id = au.id
        ORDER BY a.date DESC
        LIMIT ?
    ");
    $stmt->execute([$limit]);
    $articles = $stmt->fetchAll();
    
    foreach ($articles as $i => $article) {
        $date = $article['date'] ? date('d/m/Y', strtotime($article['date'])) : 'Sem data';
        $featured = $article['featured'] ? '⭐' : '  ';
        
        echo "\n" . str_pad($i + 1, 2, '0', STR_PAD_LEFT) . ". $featured " . 
             mb_substr($article['title'], 0, 70) . "...\n";
        echo "    ID: {$article['id']} | " . 
             ($article['category'] ?: 'Sem categoria') . " | " .
             ($article['author'] ?: 'Sem autor') . " | $date\n";
    }
    
    echo "\n" . str_repeat('═', 80) . "\n";
}

// ============================================
// EXECUÇÃO PRINCIPAL
// ============================================

try {
    echo "🔌 Conectando ao banco de dados...\n\n";
    $pdo = conectarBanco();
    echo "✅ Conectado!\n\n";
    
    getStats($pdo);
    checkDataQuality($pdo);
    
    // Processar argumentos
    $showRecent = in_array('--recent', $argv);
    $limit = 10;
    
    foreach ($argv as $i => $arg) {
        if (strpos($arg, '--limit=') === 0) {
            $limit = (int)substr($arg, 8);
        } elseif ($arg === '--limit' && isset($argv[$i + 1])) {
            $limit = (int)$argv[$i + 1];
        }
    }
    
    if ($showRecent) {
        showRecentArticles($pdo, $limit);
    }
    
    echo "\n✅ Análise concluída!\n";
    echo "\n🔌 Conexão fechada\n\n";
    
} catch (Exception $e) {
    echo "\n❌ Erro: " . $e->getMessage() . "\n";
    exit(1);
}
