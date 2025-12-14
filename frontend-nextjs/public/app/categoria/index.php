<?php
// ========================================================
// 1. CONEXÃO COM O BANCO (AJUSTE SE SEU HOST/SENHA MUDAR)
// ========================================================
$pdo = new PDO("mysql:host=localhost;dbname=banco_novo2;charset=utf8mb4", "bit", "Atecubanos1#", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

// ======================================
// SE ENVIAR O FORMULÁRIO
// ======================================
$mensagem = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $url = trim($_POST["url"]);
    $categoria_id = intval($_POST["categoria_id"]);

    // -----------------------------
    // 1. Extrair data e slug da URL
    // -----------------------------
    // Formato esperado:
    // /2024/05/13/algodão/preco-do-cacau-despenca...
    // ANO / MÊS / DIA / CATEGORIA / SLUG

    $partes = explode("/", trim($url, "/"));

    // Verifica se contém pelo menos 5 partes
    if (count($partes) < 5) {
        $mensagem = "URL inválida. Formato esperado: /2024/05/13/categoria/slug-da-noticia";
    } else {

        $ano  = $partes[0];
        $mes  = $partes[1];
        $dia  = $partes[2];
        //$categoria_slug = $partes[3]; // caso quiser usar
        $slug = $partes[4];

        // Data completa
        $data = "$ano-$mes-$dia 00:00:00";

        // -----------------------------
        // 2. Atualizar a notícia no banco
        // -----------------------------
        $sql = "UPDATE articles SET category_id = :categoria, date = :data WHERE slug = :slug";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':categoria' => $categoria_id,
            ':data' => $data,
            ':slug' => $slug
        ]);

        if ($stmt->rowCount() > 0) {
            $mensagem = "✅ Notícia atualizada com sucesso!";
        } else {
            $mensagem = "⚠️ Nenhuma notícia encontrada com esse slug.";
        }
    }
}

// ======================================
// BUSCAR TODAS CATEGORIAS PARA O <select>
// ======================================
$categorias = $pdo->query("SELECT id, name FROM categories ORDER BY name ASC")->fetchAll(PDO::FETCH_ASSOC);

// ======================================
// BUSCAR ÚLTIMAS 20 NOTÍCIAS SEM CATEGORIA
// ======================================
$semCategoria = $pdo->query("
    SELECT id, title, slug, date 
    FROM articles 
    WHERE category_id IS NULL 
    ORDER BY date DESC 
    LIMIT 20
")->fetchAll(PDO::FETCH_ASSOC);

// ======================================
// ESTATÍSTICAS RÁPIDAS
// ======================================
$stats = $pdo->query("
    SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN category_id IS NULL THEN 1 ELSE 0 END) as sem_categoria,
        SUM(CASE WHEN category_id IS NOT NULL THEN 1 ELSE 0 END) as com_categoria
    FROM articles
")->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>🤖 Painel de Categorização - Admin</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
    color: #fff;
    font-family: 'Segoe UI', Arial, sans-serif;
    padding: 20px;
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

h1 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 2.5em;
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: rgba(255,255,255,0.05);
    padding: 20px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    text-align: center;
}

.stat-card h3 {
    font-size: 2em;
    color: #3b82f6;
    margin-bottom: 5px;
}

.stat-card p {
    color: #aaa;
    font-size: 0.9em;
}

.form-section {
    background: rgba(255,255,255,0.05);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.1);
    margin-bottom: 30px;
}

.form-section h2 {
    margin-bottom: 20px;
    color: #3b82f6;
}

input, select {
    width: 100%;
    padding: 15px;
    margin-top: 8px;
    margin-bottom: 20px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    color: #fff;
    font-size: 1em;
}

input:focus, select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

button {
    padding: 15px 30px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    color: #fff;
    cursor: pointer;
    width: 100%;
    border-radius: 8px;
    font-size: 1.1em;
    font-weight: bold;
    transition: transform 0.2s;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
}

.msg {
    padding: 15px;
    margin-bottom: 20px;
    background: rgba(59, 130, 246, 0.1);
    border-left: 4px solid #3b82f6;
    border-radius: 5px;
    font-size: 1.1em;
}

.list-section {
    background: rgba(255,255,255,0.05);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.1);
}

.list-section h2 {
    margin-bottom: 20px;
    color: #ef4444;
}

.article-item {
    background: rgba(0,0,0,0.3);
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    border-left: 3px solid #ef4444;
}

.article-item strong {
    color: #3b82f6;
    display: block;
    margin-bottom: 5px;
}

.article-item small {
    color: #888;
}

.label {
    display: block;
    margin-bottom: 5px;
    color: #aaa;
    font-weight: 500;
}

.help-text {
    color: #666;
    font-size: 0.9em;
    margin-top: -15px;
    margin-bottom: 15px;
}

.quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    margin-top: 30px;
}

.quick-btn {
    padding: 15px;
    background: rgba(16, 185, 129, 0.2);
    border: 1px solid rgba(16, 185, 129, 0.4);
    color: #10b981;
    text-decoration: none;
    text-align: center;
    border-radius: 8px;
    font-weight: bold;
    transition: all 0.2s;
}

.quick-btn:hover {
    background: rgba(16, 185, 129, 0.3);
    transform: translateY(-2px);
}
</style>
</head>
<body>

<div class="container">

<h1>🤖 Painel de Categorização</h1>

<!-- Estatísticas -->
<div class="stats">
    <div class="stat-card">
        <h3><?= number_format($stats['total']) ?></h3>
        <p>Total de Artigos</p>
    </div>
    <div class="stat-card">
        <h3><?= number_format($stats['com_categoria']) ?></h3>
        <p>✅ Com Categoria</p>
    </div>
    <div class="stat-card">
        <h3><?= number_format($stats['sem_categoria']) ?></h3>
        <p>⚠️ Sem Categoria</p>
    </div>
</div>

<!-- Mensagem de Sucesso/Erro -->
<?php if ($mensagem): ?>
<div class="msg"><?= $mensagem ?></div>
<?php endif; ?>

<!-- Formulário Principal -->
<div class="form-section">
    <h2>📝 Alterar Categoria Manualmente</h2>
    
    <form method="POST">
        <label class="label">URL da notícia:</label>
        <input type="text" name="url" placeholder="/2024/05/13/algodão/slug-da-noticia" required>
        <div class="help-text">Cole a URL completa ou apenas o caminho (/ano/mês/dia/categoria/slug)</div>

        <label class="label">Selecionar categoria:</label>
        <select name="categoria_id" required>
            <option value="">Selecione uma categoria...</option>
            <?php foreach ($categorias as $cat): ?>
                <option value="<?= $cat['id'] ?>"><?= $cat['name'] ?></option>
            <?php endforeach; ?>
        </select>

        <button type="submit">🚀 Atualizar Categoria</button>
    </form>
</div>

<!-- Últimas Notícias Sem Categoria -->
<?php if (count($semCategoria) > 0): ?>
<div class="list-section">
    <h2>⚠️ Últimas 20 Notícias SEM Categoria</h2>
    
    <?php foreach ($semCategoria as $artigo): ?>
    <div class="article-item">
        <strong>#<?= $artigo['id'] ?> - <?= htmlspecialchars($artigo['title']) ?></strong>
        <div>Slug: <code><?= $artigo['slug'] ?></code></div>
        <small>Data: <?= $artigo['date'] ?></small>
    </div>
    <?php endforeach; ?>
</div>
<?php endif; ?>

<!-- Ações Rápidas -->
<div class="quick-actions">
    <a href="?action=auto" class="quick-btn" onclick="return confirm('Executar categorização automática?')">
        🤖 Categorizar Automaticamente
    </a>
    <a href="?" class="quick-btn">
        🔄 Atualizar Estatísticas
    </a>
</div>

</div>

</body>
</html>
