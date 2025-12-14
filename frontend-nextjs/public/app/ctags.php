<?php
$pdo = new PDO("mysql:host=localhost;dbname=banco_novo2;charset=utf8mb4", "bit", "Atecubanos1#", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

echo "⏳ Carregando tags existentes...\n";

// Carrega todas as tags com ID
$tagsDB = $pdo->query("SELECT id, name FROM tags")->fetchAll(PDO::FETCH_ASSOC);

// Índice name → id
$tagsMap = [];
foreach ($tagsDB as $t) {
    $tagsMap[ mb_strtolower($t["name"]) ] = $t["id"];
}

// TAG fallback caso nenhuma seja encontrada
$fallbackTagID = 1;

// Stopwords
$stopwords = [
    "a","o","e","de","da","do","das","dos","na","no","em","para","por","um","uma","uns","umas",
    "que","com","as","os","ao","à","às","é","se","sobre","sua","são","tem","mais","menos","entre",
    "como","ser","ter","vai","já","onde","qual","quais","pode","podem","for","após"
];

// Limpar texto
function limpar($texto, $stopwords) {
    $texto = mb_strtolower($texto, 'UTF-8');
    $texto = preg_replace('/[^a-zá-úà-ùãõâêîôûç0-9\s]/iu', '', $texto);
    $palavras = array_filter(explode(" ", $texto));

    $final = [];
    foreach ($palavras as $p) {
        if (strlen($p) >= 4 && !in_array($p, $stopwords)) {
            $final[] = $p;
        }
    }
    return $final;
}

echo "⏳ Processando artigos...\n\n";

// Carrega artigos
$artigos = $pdo->query("
    SELECT a.id, a.title, a.subtitle, c.text
    FROM articles a
    JOIN article_content c ON c.article_id = a.id
")->fetchAll(PDO::FETCH_ASSOC);

foreach ($artigos as $art) {

    $titulo = limpar($art["title"], $stopwords);
    $sub = limpar($art["subtitle"], $stopwords);
    $conteudo = limpar($art["text"], $stopwords);

    // Contagens
    $tituloCount   = array_count_values($titulo);
    $subCount      = array_count_values($sub);
    $conteudoCount = array_count_values($conteudo);

    // Sistema de pesos
    $pesos = [];

    foreach ($tituloCount as $p => $qtd) {
        $pesos[$p] = ($pesos[$p] ?? 0) + (3 * $qtd) + 10; // Título sempre mais forte
    }
    foreach ($subCount as $p => $qtd) {
        $pesos[$p] = ($pesos[$p] ?? 0) + (2 * $qtd);
    }
    foreach ($conteudoCount as $p => $qtd) {
        $pesos[$p] = ($pesos[$p] ?? 0) + (1 * $qtd);
    }

    // Capturar apenas tags existentes
    $matchTags = [];

    foreach ($pesos as $word => $score) {
        if (isset($tagsMap[$word])) {
            $tagID = $tagsMap[$word];
            $matchTags[$tagID] = $score;
        }
    }

    // ————————————————
    // PRIORIDADE: TAGS DO TÍTULO SEMPRE ENTRAM!
    // ————————————————
    $titleTags = [];
    foreach ($titulo as $word) {
        if (isset($tagsMap[$word])) {
            $titleTags[$tagsMap[$word]] = 9999; // peso absoluto
        }
    }

    // Se não achou nada no artigo, tenta pelo título novamente
    if (empty($matchTags) && empty($titleTags)) {
        echo "⚠ Artigo {$art['id']} sem tags. Aplicando fallback.\n";
        $matchTags = [$fallbackTagID => 1];
    }

    // Mescla tags do título com outras
    $finalTags = $titleTags + $matchTags;

    // Ordena pela relevância
    arsort($finalTags);

    // Limite baseado no tamanho do texto — MAS preserva as tags do título
    $tamanho = strlen($art["text"]);
    if ($tamanho < 800)       $limite = 3;
    else if ($tamanho < 2000) $limite = 4;
    else                      $limite = 6;

    // As tags do título não podem ser removidas
    $titleTagIDs = array_keys($titleTags);
    $otherTags = array_diff(array_keys($finalTags), $titleTagIDs);

    // Mantém tags do título + completa com extras
    $tagsFinais = array_merge(
        $titleTagIDs,
        array_slice($otherTags, 0, max(0, $limite - count($titleTagIDs)))
    );

    // Atualiza banco
    $stmt = $pdo->prepare("UPDATE article_content SET tags = ? WHERE article_id = ?");
    $stmt->execute([implode(",", $tagsFinais), $art["id"]]);

    echo "✔ Artigo {$art['id']} → Tags finais: " . implode(", ", $tagsFinais) . "\n";
}

echo "\n✅ FINALIZADO! Tags ajustadas com prioridade às tags do título.\n";
