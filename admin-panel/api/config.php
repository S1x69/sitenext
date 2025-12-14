<?php
/**
 * Arquivo de Configuração para update_news.php
 * 
 * Copie este arquivo e ajuste conforme seu ambiente
 */

return [
    // Configurações do Banco de Dados
    'database' => [
        'host' => '181.215.134.15',
        'name' => 'banco_novo2',
        'user' => 'bit',
        'password' => 'Atecubanos1#',
        'charset' => 'utf8mb4'
    ],
    
    // Configurações de Upload
    'upload' => [
        // Diretório onde as imagens serão salvas
        'dir' => __DIR__ . '/../../upload/imagens-resizes/',
        
        // Prefixo da URL para as imagens
        'url_prefix' => '/upload/imagens-resizes/',
        
        // Tamanhos permitidos (em bytes)
        'max_size' => 5 * 1024 * 1024, // 5MB
        
        // Formatos permitidos
        'allowed_formats' => ['jpg', 'jpeg', 'png', 'gif', 'webp']
    ],
    
    // Configurações de Log
    'logging' => [
        'enabled' => true,
        'file' => __DIR__ . '/logs/update_news.log',
        'max_size' => 10 * 1024 * 1024 // 10MB
    ],
    
    // Configurações de Segurança
    'security' => [
        // Liste os IPs ou domínios permitidos (deixe vazio para permitir todos)
        'allowed_origins' => [
            'http://localhost:3000',
            'http://localhost:3001',
        ],
        
        // Token de autenticação (opcional)
        'api_token' => null, // Ex: 'seu_token_secreto_aqui'
        
        // Validar referer
        'check_referer' => false
    ]
];
