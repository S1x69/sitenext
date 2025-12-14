<?php
$pdo = new PDO("mysql:host=localhost;dbname=banco_novo2;charset=utf8mb4", "bit", "Atecubanos1#", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

$tagsEstados = [
    "Mato Grosso" => "mato-grosso",
    "Mato Grosso do Sul" => "mato-grosso-do-sul",
    "Paraná" => "parana",
    "Rio Grande do Sul" => "rio-grande-do-sul",
    "Santa Catarina" => "santa-catarina",
    "São Paulo" => "sao-paulo",
    "Minas Gerais" => "minas-gerais",
    "Goiás" => "goias",
    "Bahia" => "bahia",
    "Tocantins" => "tocantins",
    "Maranhão" => "maranhao",
    "Pará" => "para",
    "Rondônia" => "rondonia",
    "Piauí" => "piaui",
    "Acre" => "acre",
    "Roraima" => "roraima",
    "Amapá" => "amapa",
    "Brasil" => "brasil"
];

echo "⏳ Inserindo tags de estados...\n\n";

$check = $pdo->prepare("SELECT id FROM tags WHERE slug = ?");
$insert = $pdo->prepare("INSERT INTO tags (name, slug) VALUES (?, ?)");

foreach ($tagsEstados as $name => $slug) {
    
    // Verifica se já existe
    $check->execute([$slug]);
    
    if ($check->rowCount() === 0) {
        // Insere
        $insert->execute([$name, $slug]);
        echo "✔ Inserida: $name ($slug)\n";
    } else {
        echo "⏭ Já existe: $name\n";
    }
}

echo "\n✅ Processo concluído!\n";
b                                                                                                                                                                                    