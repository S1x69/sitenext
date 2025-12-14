'use client';

import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Type, 
  Image as ImageIcon, 
  Quote, 
  List, 
  Info, 
  Sparkles,
  Code,
  Eye,
  Save,
  Download,
  ChevronDown,
  Search
} from 'lucide-react';
import StructuredContent from '@/components/StructuredContent';
import ThemeToggle from '@/components/ThemeToggle';
import Toast, { useToast } from '@/components/Toast';

export default function NewsEditor() {
  const { toasts, showToast, removeToast } = useToast();
  
  const [blocks, setBlocks] = useState([]);
  
  const [showCode, setShowCode] = useState(false);
  const [newsTitle, setNewsTitle] = useState('Título da Notícia');
  const [newsSubtitle, setNewsSubtitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [newsCategorySlug, setNewsCategorySlug] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsTags, setNewsTags] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [contentType, setContentType] = useState('noticia'); // 'noticia' ou 'artigo'
  const [contentNiche, setContentNiche] = useState('agro'); // 'agro' ou outros
  
  // Data da notícia (gerada automaticamente como hoje)
  const today = new Date();
  const [newsYear, setNewsYear] = useState(today.getFullYear().toString());
  const [newsMonth, setNewsMonth] = useState((today.getMonth() + 1).toString().padStart(2, '0'));
  const [newsDay, setNewsDay] = useState(today.getDate().toString().padStart(2, '0'));

  // Estado para altura do preview no mobile
  const [previewHeight, setPreviewHeight] = useState(50); // porcentagem
  const [isDragging, setIsDragging] = useState(false);

  // Modal de Prompt IA
  const [showAIPromptModal, setShowAIPromptModal] = useState(false);
  const [aiPromptType, setAIPromptType] = useState('estruturar'); // Tipo de prompt IA: 'estruturar' ou 'reformular'

  // Estados para busca de notícias
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(false);
  
  // Estados para salvar notícia
  const [isSaving, setIsSaving] = useState(false);
  const [newsId, setNewsId] = useState(null); // ID da notícia carregada

  // Estados para controlar seções recolhíveis
  const [sectionsOpen, setSectionsOpen] = useState({
    metadata: false,
    contentType: true,
    blocks: false
  });

  const toggleSection = (section) => {
    setSectionsOpen(prev => ({
      metadata: section === 'metadata' ? !prev.metadata : false,
      contentType: section === 'contentType' ? !prev.contentType : false,
      blocks: section === 'blocks' ? !prev.blocks : false
    }));
  };

  // Adicionar novo bloco
  const addBlock = (type) => {
    const newBlock = {
      type,
      ...(type === 'paragraph' && { text: '' }),
      ...(type === 'subtitle' && { text: 'Novo Subtítulo' }),
      ...(type === 'quote' && { text: 'Citação — Autor' }),
      ...(type === 'info_box' && { title: 'Você sabia?', text: '' }),
      ...(type === 'highlight' && { text: '' }),
      ...(type === 'image' && { url: '', alt_text: '', caption: '' }),
      ...(type === 'video' && { url: '', caption: '' }),
      ...(type === 'list' && { items: ['Item 1', 'Item 2'] })
    };
    
    setBlocks([...blocks, newBlock]);
  };

  // Atualizar bloco
  const updateBlock = (index, field, value) => {
    const newBlocks = [...blocks];
    if (field === 'items') {
      newBlocks[index][field] = value.split('\n').filter(item => item.trim());
    } else {
      newBlocks[index][field] = value;
    }
    setBlocks(newBlocks);
  };

  // Gerar slug a partir do título
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífen
      .replace(/-+/g, '-') // Remove hífens duplicados
      .replace(/^-|-$/g, ''); // Remove hífens do início e fim
  };

  // Atualizar título e gerar slug automaticamente
  const handleTitleChange = (newTitle) => {
    setNewsTitle(newTitle);
    setNewsCategorySlug(generateSlug(newTitle));
  };

  // Atualizar categoria e gerar slug da categoria
  const handleCategoryChange = (newCategory) => {
    setNewsCategory(newCategory);
    setCategorySlug(generateSlug(newCategory));
  };

  // Gerar URL preview baseada no tipo de conteúdo
  const getUrlPreview = () => {
    const categoryPart = categorySlug || 'categoria-aqui';
    const slugPart = newsCategorySlug || 'slug-aqui';
    
    if (contentType === 'noticia') {
      return `/${newsYear}/${newsMonth}/${newsDay}/${categoryPart}/${slugPart}`;
    } else if (contentType === 'artigo') {
      return `/artigo/${categoryPart}/${slugPart}`;
    } else if (contentType === 'opiniao') {
      return `/opiniao/${categoryPart}/${slugPart}`;
    } else if (contentType === 'analise') {
      return `/analise/${categoryPart}/${slugPart}`;
    }
  };

  // Calcular tempo de leitura estimado
  const calculateReadingTime = () => {
    let wordCount = 0;
    
    // Contar palavras do título e subtítulo
    wordCount += newsTitle.split(' ').filter(word => word.trim()).length;
    wordCount += newsSubtitle.split(' ').filter(word => word.trim()).length;
    
    // Contar palavras de cada bloco
    blocks.forEach(block => {
      if (block.type === 'paragraph' || block.type === 'subtitle' || block.type === 'quote') {
        wordCount += block.text.split(' ').filter(word => word.trim()).length;
      } else if (block.type === 'info_box' || block.type === 'highlight') {
        wordCount += (block.title || '').split(' ').filter(word => word.trim()).length;
        wordCount += (block.text || '').split(' ').filter(word => word.trim()).length;
      } else if (block.type === 'list' && block.items) {
        block.items.forEach(item => {
          wordCount += item.split(' ').filter(word => word.trim()).length;
        });
      }
    });
    
    // Calcula tempo baseado em 200 palavras por minuto
    const minutes = Math.ceil(wordCount / 200);
    return minutes;
  };

  // Manipular drag do preview no mobile
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const windowHeight = window.innerHeight;
    const newHeight = ((windowHeight - clientY) / windowHeight) * 100;
    
    // Limita entre 20% e 80%
    if (newHeight >= 20 && newHeight <= 80) {
      setPreviewHeight(newHeight);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Prompt para estruturar (JSON)
  const generateAIPrompt = () => {
    // Verificar se há apenas parágrafos carregados e extrair o texto
    let autoLoadedText = '';
    const hasOnlyParagraphs = blocks.length > 0 && blocks.every(block => block.type === 'paragraph');
    
    if (hasOnlyParagraphs && newsId) {
      // Se está editando uma notícia (tem newsId) e só tem parágrafos, extrair o texto
      autoLoadedText = blocks
        .map(block => block.text)
        .filter(text => text && text.trim())
        .join('\n\n');
    }
    
    // Exemplo fixo para o prompt (não muda com importação)
    const exampleNews = {
      type: "noticia",
      niche: "agro",
      title: "Seu Título Aqui",
      subtitle: "Seu subtítulo ou linha fina",
      date: {
        year: "2025",
        month: "12",
        day: "03"
      },
      category: {
        nome: "seu-category-aqui",
        categorySlug: "seu-categorySlug-aqui",
        slug: "seu-titulo-aqui"
      },
      image: "https://exemplo.com/imagem.jpg",
      content: [
        { type: "paragraph", text: "Primeiro parágrafo da notícia..." },
        { type: "subtitle", text: "Subtítulo da Seção" },
        { type: "paragraph", text: "Mais conteúdo..." },
        { type: "quote", text: "Citação importante — Nome da Pessoa" },
        { type: "highlight", text: "Destaque importante" },
        { type: "info_box", title: "Contexto", text: "Informação adicional" },
        { type: "image", url: "https://...", alt_text: "Descrição", caption: "Legenda" },
        { type: "video", url: "https://youtube.com/...", caption: "Legenda do vídeo" },
        { type: "list", items: ["Item 1", "Item 2", "Item 3"] }
      ],
      tags: ["agricultura-sustentavel", "tecnologia-rural", "mercado-agricola"]
    };

    const prompt = `Você é um assistente especializado em converter textos de notícias para o formato JSON estruturado. Seu objetivo é criar conteúdo VARIADO e DINÂMICO, adaptando a estrutura ao tipo e tamanho da notícia.

**FORMATO JSON ESPERADO:**
${JSON.stringify(exampleNews, null, 2)}

**🎯 REGRA DE OURO: CADA NOTÍCIA DEVE SER ÚNICA!**

Analise o texto fornecido e decida qual estrutura faz mais sentido. NÃO use fórmulas prontas. Pense: "O que tornaria ESTA notícia específica mais clara, interessante e fácil de ler?"

**📦 TIPOS DE BLOCOS DISPONÍVEIS:**

1. **paragraph** - Texto corrido normal
   - Use quando: precisa explicar, narrar, contextualizar
   - Varie o tamanho: 2-3 linhas (impacto rápido) ou 6-8 linhas (detalhamento)

2. **subtitle** - Divide seções temáticas
   - Use quando: muda de assunto/perspectiva OU notícia tem +5 parágrafos
   - NÃO use em: notícias curtas (menos de 4 parágrafos)
   - Seja específico: "Impacto no Mercado" em vez de "Consequências"

3. **quote** - Citação direta de alguém
   - Use quando: há declaração relevante ("disse", "afirmou", "destacou")
   - Formato: "Texto da citação — Nome Completo, Cargo/Empresa"
   - NÃO invente: só use se houver declaração real no texto

4. **info_box** - Contextualização extra
   - Use quando: precisa explicar termo técnico, dar histórico, dados complementares
   - Título curto e direto: "O que é ESG?", "Entenda o Cenário", "Números do Setor"
   - NÃO use para informação essencial (ela fica "de lado")

5. **highlight** - Destaque visual importante
   - Use quando: número impressionante, fato crucial, conclusão-chave
   - Máximo 2-3 por notícia (perde o efeito se exagerar)
   - Exemplo: "Produção cresceu 127% em 2025" ou "Maior safra da história"

6. **list** - Enumerar itens relacionados
   - Use quando: ranking, passos sequenciais, múltiplos itens similares
   - Mínimo 3 itens, máximo 8 itens
   - Cada item: 1-2 linhas no máximo

7. **image** - Blocos de imagem (OPCIONAL)
   - Só adicione se o texto mencionar imagem específica
   - Se não mencionar: deixe o campo "image" no topo vazio

8. **video** - Vídeo embutido (OPCIONAL)
   - Só adicione se o texto mencionar vídeo/reportagem em vídeo
   - Se não mencionar: não adicione este bloco

**🎨 EXEMPLOS DE ESTRUTURAS PARA CADA TIPO:**

**A) NOTÍCIA FLASH (Breaking News) - 2-4 parágrafos**
- Estrutura: [paragraph, paragraph, highlight, paragraph]
- Características: Direto ao ponto, um destaque com dado/fato principal
- Quando: Acontecimento recente, urgente, factual

**B) NOTÍCIA CURTA COM DECLARAÇÃO - 3-5 parágrafos**
- Estrutura: [paragraph, paragraph, quote, paragraph, highlight]
- Características: Foco na fala de alguém importante
- Quando: Entrevista curta, posicionamento oficial, anúncio

**C) REPORTAGEM PADRÃO - 5-7 parágrafos**
- Estrutura: [paragraph, paragraph, subtitle, paragraph, quote, paragraph, highlight]
- Características: Divide em 2 seções temáticas, declaração + destaque
- Quando: Cobertura completa de evento, análise de situação

**D) REPORTAGEM COM CONTEXTO - 6-8 parágrafos**
- Estrutura: [paragraph, paragraph, info_box, paragraph, subtitle, paragraph, quote, paragraph, list]
- Características: Explica termo/conceito, lista múltiplos pontos
- Quando: Tema técnico, precisa educar leitor, múltiplos dados

**E) GRANDE REPORTAGEM - 8-12 parágrafos**
- Estrutura: [paragraph, highlight, paragraph, subtitle, paragraph, quote, paragraph, info_box, subtitle, paragraph, list, paragraph]
- Características: Múltiplas seções, vários elementos variados
- Quando: Investigação, análise profunda, tema complexo

**F) NOTÍCIA SIMPLES NARRATIVA - 4-5 parágrafos**
- Estrutura: [paragraph, paragraph, paragraph, paragraph, highlight]
- Características: Fluxo contínuo, só destaque no final
- Quando: História linear, perfil, crônica

**G) NOTÍCIA BASEADA EM DADOS - 5-6 parágrafos**
- Estrutura: [paragraph, highlight, paragraph, list, paragraph, highlight]
- Características: Ênfase em números e listas
- Quando: Pesquisas, rankings, estatísticas

**⚠️ REGRAS DE VARIAÇÃO OBRIGATÓRIAS:**

1. **Analise o texto ANTES de escolher a estrutura**
   - Quantos parágrafos o texto tem? (curto/médio/longo)
   - Tem citações diretas? → use quote
   - Tem listas/ranking/passos? → use list
   - Tem conceito técnico para explicar? → use info_box
   - Tem número/fato impressionante? → use highlight
   - Precisa dividir em seções? → use subtitle

2. **NÃO repita estruturas automaticamente**
   - Se a última notícia foi [paragraph, subtitle, paragraph, quote], tente outra
   - Varie a ordem: às vezes highlight no início, às vezes no meio, às vezes no final
   - Varie a quantidade: uma notícia 2 quotes, outra nenhum, outra 1 quote

3. **Use elementos APENAS quando fazem sentido**
   - Não force quote se não há citação
   - Não force list se são só 2 itens (use paragraph)
   - Não force info_box se não há contexto extra
   - Não force subtitle em notícia de 3 parágrafos

4. **Varie o ritmo da leitura**
   - Notícia rápida: Menos blocos, mais direto
   - Notícia profunda: Mais blocos, mais elementos
   - Alterne: parágrafo longo → parágrafo curto → destaque → parágrafo médio

**📂 CATEGORIAS DISPONÍVEIS:**

Analise o texto e escolha UMA das categorias abaixo baseando-se nas palavras-chave presentes:

• **Agronegócio**: soja, milho, trigo, café, algodão, cana, arroz, feijão, pecuária, gado, boi, vaca, suíno, porco, frango, ave, agricultura, fazenda, plantio, colheita, safra, produtor rural

• **Economia**: dólar, real, economia, financeiro, banco, juros, inflação, pib, mercado financeiro, bolsa, investimento, crise

• **Mercado**: preço, cotação, commodity, exportação, importação, mercado, venda, compra, b3, cbot, chicago

• **Tecnologia**: tecnologia, digital, app, software, inteligência artificial, ia, drone, sensor, agricultura de precisão, startup

• **Clima**: clima, tempo, chuva, seca, temperatura, meteorologia, el niño, la niña, geada, granizo

• **Política**: política, governo, presidente, ministro, congresso, lei

• **Meio Ambiente**: meio ambiente, sustentabilidade, desmatamento, floresta, carbono, aquecimento global, preservação

• **Internacional**: internacional, mundial, china, eua, europa, exportação

• **Saúde**: saúde, doença, vacina, hospital, covid, pandemia

• **Educação**: educação, escola, universidade, curso, formação

• **Notícias**: (categoria padrão se nenhuma outra se encaixar bem)

⚠️ **REGRA**: Conte quantas palavras-chave de cada categoria aparecem no texto. Escolha a categoria com MAIS ocorrências. Em caso de empate, escolha a mais específica.

**🏷️ TAGS SEO - TÉCNICAS PROFISSIONAIS:**

CRÍTICO: Tags são cruciais para SEO! Siga estas regras rigorosamente:

**QUANTIDADE:** Exatamente 4-6 tags (ótimo para SEO)

**FORMATO:** 
- Todas em lowercase (minúsculas)
- Conectar palavras com hífen: "agricultura-sustentavel"
- Sem acentos: "soja-organica" (não "soja-orgânica")
- Específicas e relevantes

**ESTRATÉGIA (use todas as 3 camadas):**

1. **Tag Principal (1 tag)** - Tema central
   - Exemplo: "producao-de-soja", "mercado-agricola", "tecnologia-rural"

2. **Tags Específicas (2-3 tags)** - Detalhes do conteúdo
   - Exemplo: "fertilizantes-biologicos", "irrigacao-inteligente", "credito-rural"

3. **Tag de Contexto (1-2 tags)** - Conecta com outros temas
   - Exemplo: "sustentabilidade", "inovacao-agro", "exportacao"

**EXEMPLOS DE BOAS TAGS POR TEMA:**

Agronegócio:
- "mercado-agricola", "producao-de-graos", "commodities-agricolas"
- "tecnologia-no-campo", "agricultura-de-precisao", "drones-agricolas"
- "pecuaria-sustentavel", "criacao-de-gado", "integracao-lavoura-pecuaria"

Economia Rural:
- "financiamento-rural", "credito-agricola", "seguro-rural"
- "precos-agricolas", "cotacao-de-graos", "exportacao-agro"

Sustentabilidade:
- "agricultura-sustentavel", "agricultura-regenerativa", "carbono-neutro"
- "manejo-de-solo", "conservacao-de-recursos", "reflorestamento"

Tecnologia:
- "agtech", "agricultura-digital", "inteligencia-artificial-agro"
- "sensoriamento-remoto", "analise-de-dados-agricolas"

**EVITE TAGS RUINS:**
❌ Muito genéricas: "agricultura", "brasil", "economia", "tecnologia"
❌ Muito longas: "como-aumentar-a-producao-de-soja-no-brasil"
❌ Duplicadas: "soja" e "producao-de-soja" (escolha a mais específica)
❌ Irrelevantes: tags que não aparecem no texto

**✅ BOAS PRÁTICAS FINAIS:**

1. **Imagem principal** (campo "image" no topo):
   - Deixe vazio se o texto não mencionar imagem
   - Se mencionar: use a URL fornecida

2. **Slugs** (URLs amigáveis):
   - Baseado no título, máximo 6-8 palavras
   - Exemplo: "Soja bate recorde de produção em 2025" → "soja-bate-recorde-producao-2025"

3. **Subtítulo** (linha fina):
   - Complementa o título, não repete
   - 10-15 palavras, adiciona informação relevante

4. **Data**:
   - "noticia": sempre inclui date (ano/mês/dia atual)
   - "artigo"/"opiniao": NÃO inclui date

**📝 TEXTO PARA CONVERTER:**

${autoLoadedText || '[COLE SEU TEXTO AQUI]'}

**⚡ RESPONDA APENAS COM O JSON VÁLIDO. SEM EXPLICAÇÕES, SEM COMENTÁRIOS, APENAS O JSON.**

**LEMBRE-SE: VARIE! Nenhuma notícia deve ter estrutura idêntica a outra. Adapte ao conteúdo específico!`;

    return prompt;
  };

  // Prompt para REFORMULAR (reescrever com outro autor e devolver em JSON)
  const generateAIRewritePrompt = () => {
    // Exemplo fixo igual ao estruturar
    const exampleNews = {
      type: "noticia",
      niche: "agro",
      title: "Seu Título Aqui",
      subtitle: "Seu subtítulo ou linha fina",
      date: {
        year: "2025",
        month: "12",
        day: "03"
      },
      category: {
        nome: "seu-category-aqui",
        categorySlug: "seu-categorySlug-aqui",
        slug: "seu-titulo-aqui"
      },
      image: "https://exemplo.com/imagem.jpg",
      content: [
        { type: "paragraph", text: "Primeiro parágrafo da notícia..." },
        { type: "subtitle", text: "Subtítulo da Seção" },
        { type: "paragraph", text: "Mais conteúdo..." },
        { type: "quote", text: "Citação importante — Nome da Pessoa" },
        { type: "highlight", text: "Destaque importante" },
        { type: "info_box", title: "Contexto", text: "Informação adicional" },
        { type: "image", url: "https://...", alt_text: "Descrição", caption: "Legenda" },
        { type: "video", url: "https://youtube.com/...", caption: "Legenda do vídeo" },
        { type: "list", items: ["Item 1", "Item 2", "Item 3"] }
      ],
      tags: ["agricultura-sustentavel", "tecnologia-rural", "mercado-agricola"]
    };

    return `Você é um redator profissional e especialista em IA. Reescreva o texto abaixo para que pareça criado por outro autor, mudando frases, ordem, estilo e vocabulário, mas mantendo o sentido e as informações. O objetivo é evitar qualquer detecção de conteúdo duplicado. NÃO copie frases, use criatividade e variação.\n\nDepois, devolva a notícia já estruturada no formato JSON abaixo:\n\n${JSON.stringify(exampleNews, null, 2)}\n\n**📦 TIPOS DE BLOCOS DISPONÍVEIS:**\n\n1. **paragraph** - Texto corrido normal\n2. **subtitle** - Divide seções temáticas\n3. **quote** - Citação direta de alguém\n4. **info_box** - Contextualização extra\n5. **highlight** - Destaque visual importante\n6. **list** - Enumerar itens relacionados\n7. **image** - Blocos de imagem (OPCIONAL)\n8. **video** - Vídeo embutido (OPCIONAL)\n\n**EXEMPLOS DE ESTRUTURAS:**\nA) NOTÍCIA FLASH: [paragraph, paragraph, highlight, paragraph]\nB) NOTÍCIA CURTA COM DECLARAÇÃO: [paragraph, paragraph, quote, paragraph, highlight]\nC) REPORTAGEM PADRÃO: [paragraph, paragraph, subtitle, paragraph, quote, paragraph, highlight]\nD) REPORTAGEM COM CONTEXTO: [paragraph, paragraph, info_box, paragraph, subtitle, paragraph, quote, paragraph, list]\nE) GRANDE REPORTAGEM: [paragraph, highlight, paragraph, subtitle, paragraph, quote, paragraph, info_box, subtitle, paragraph, list, paragraph]\nF) NOTÍCIA SIMPLES NARRATIVA: [paragraph, paragraph, paragraph, paragraph, highlight]\nG) NOTÍCIA BASEADA EM DADOS: [paragraph, highlight, paragraph, list, paragraph, highlight]\n\n**REGRAS DE VARIAÇÃO:**\n- Analise o texto ANTES de escolher a estrutura\n- NÃO repita estruturas automaticamente\n- Use elementos APENAS quando fazem sentido\n- Varie o ritmo da leitura\n\n**CATEGORIAS DISPONÍVEIS:**\nAgronegócio, Economia, Mercado, Tecnologia, Clima, Política, Meio Ambiente, Internacional, Saúde, Educação, Notícias\n\n**TAGS SEO:**\n- Exatamente 4-6 tags, minúsculas, separadas por hífen, sem acento\n- Use tag principal, específicas e de contexto\n\n**BOAS PRÁTICAS:**\n- Imagem principal só se o texto mencionar\n- Slugs baseados no título\n- Subtítulo complementa o título\n- Data sempre para notícia\n\n[COLE SEU TEXTO AQUI]\n\n⚡ RESPONDA APENAS COM O JSON VÁLIDO. SEM EXPLICAÇÕES, SEM COMENTÁRIOS, APENAS O JSON.\n\nLEMBRE-SE: VARIE! Nenhuma notícia deve ter estrutura idêntica a outra. Adapte ao conteúdo específico!`;
  };

  const copyAIPrompt = () => {
    const prompt = aiPromptType === 'estruturar' ? generateAIPrompt() : generateAIRewritePrompt();
    navigator.clipboard.writeText(prompt);
    showToast('Prompt copiado! Cole no ChatGPT, Claude ou outra IA junto com seu texto.', 'success');
  };

  // Buscar notícias na API
  const searchNews = async () => {
    if (!searchQuery.trim()) {
      showToast('Digite algo para buscar', 'error');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`https://api.boca.com.br/api/app/chave/?chave=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache'
      });
      if (!response.ok) throw new Error('Erro ao buscar');
      
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
      
      if (data.length === 0) {
        showToast('Nenhuma notícia encontrada', 'info');
      }
    } catch (error) {
      showToast('Erro ao buscar notícias', 'error');
      console.error('Erro na busca:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Carregar notícia completa da API de detalhes
  const loadNewsToEditor = async (article) => {
    setLoadingArticle(true);
    try {
      console.log('Carregando artigo:', article);
      
      // Extrair data da notícia - formato esperado: "2025-11-19 15:30:37" ou "2025-11-19"
      const dateStr = article.date || '';
      let year = today.getFullYear().toString();
      let month = (today.getMonth() + 1).toString().padStart(2, '0');
      let day = today.getDate().toString().padStart(2, '0');
      
      // Tentar extrair data no formato YYYY-MM-DD ou YYYY-MM-DD HH:MM:SS
      if (dateStr) {
        const dateParts = dateStr.split(' ')[0].split('-'); // Remove hora e pega YYYY-MM-DD
        if (dateParts.length === 3) {
          year = dateParts[0];
          month = dateParts[1].padStart(2, '0');
          day = dateParts[2].padStart(2, '0');
        }
      }
      
      // Buscar slug
      let slug = article.slug || '';
      if (!slug && article.url) {
        slug = article.url.split('/').pop().replace('.html', '');
      }
      
      console.log('Buscando detalhes:', { date: `${year}-${month}-${day}`, slug });
      
      // Formatar data para a API: YYYY-MM-DD
      const dataParam = `${year}-${month}-${day}`;
      const apiUrl = `https://api.boca.com.br/api/app/detail/?data=${dataParam}&news_detail=${slug}`;
      console.log('URL da API:', apiUrl);
      
      // Buscar detalhes completos da notícia
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes: ' + response.status);
      }
      
      const fullArticle = await response.json();
      console.log('Artigo completo recebido:', fullArticle);
      
      // Guardar ID da notícia para poder salvar depois
      setNewsId(fullArticle.id || article.id || null);
      
      // Carregar dados no editor
      setContentType(fullArticle.type || 'noticia');
      setContentNiche(fullArticle.niches || fullArticle.niche || 'agro');
      setNewsTitle(fullArticle.title || article.title || '');
      setNewsSubtitle(fullArticle.subtitle || article.subtitle || '');
      
      setNewsYear(year);
      setNewsMonth(month);
      setNewsDay(day);
      
      // Tratar categoria que pode vir como objeto ou string
      let categoryName = '';
      let categorySlugValue = '';
      
      if (typeof fullArticle.category === 'object' && fullArticle.category !== null) {
        categoryName = fullArticle.category.nome || '';
        categorySlugValue = fullArticle.category.slug || '';
      } else if (typeof fullArticle.category === 'string') {
        categoryName = fullArticle.category;
      } else if (typeof article.category === 'string') {
        categoryName = article.category;
      }
      
      setNewsCategory(categoryName);
      setCategorySlug(generateSlug(categoryName));
      setNewsCategorySlug(categorySlugValue || slug || generateSlug(fullArticle.title));
      setNewsImage(fullArticle.image || article.image || '');
      setNewsTags(fullArticle.tags || []);
      
      // Carregar conteúdo estruturado
      if (fullArticle.content && Array.isArray(fullArticle.content)) {
        console.log('Carregando blocos:', fullArticle.content.length);
        setBlocks(fullArticle.content);
      } else {
        console.log('Nenhum conteúdo encontrado');
        setBlocks([]);
      }
      
      setShowSearchModal(false);
      setSearchQuery('');
      setSearchResults([]);
      showToast('Notícia carregada com sucesso!', 'success');
      
    } catch (error) {
      console.error('Erro ao carregar notícia:', error);
      showToast('Erro ao carregar detalhes da notícia: ' + error.message, 'error');
    } finally {
      setLoadingArticle(false);
    }
  };

  // Salvar/Atualizar notícia na API
  const saveNews = async () => {
    if (!newsTitle.trim()) {
      showToast('O título não pode estar vazio', 'error');
      return;
    }

    if (blocks.length === 0) {
      showToast('Adicione pelo menos um bloco de conteúdo', 'error');
      return;
    }

    if (!newsCategory.trim()) {
      showToast('Selecione uma categoria', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Montar objeto completo da notícia
      const newsData = {
        id: newsId, // null se for nova, com ID se for update
        type: contentType,
        niches: contentNiche,
        title: newsTitle,
        subtitle: newsSubtitle,
        slug: newsCategorySlug,
        category: {
          nome: newsCategory,
          slug: categorySlug
        },
        date: `${newsYear}-${newsMonth}-${newsDay}`,
        image: newsImage,
        tags: newsTags,
        content: blocks,
        author: 'Acro Rodrigues', // Pode adicionar campo para autor
        status: 'published' // ou 'draft'
      };

      console.log(newsId ? 'Atualizando notícia:' : 'Criando nova notícia:', newsData);

      // Endpoint diferente para criar ou atualizar
      const endpoint = newsId 
        ? 'https://api.boca.com.br/api/news/update/'
        : 'https://api.boca.com.br/api/news/create/';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('Resposta da API:', result);

      // Se for nova notícia, atualizar o ID
      if (!newsId && result.id) {
        setNewsId(result.id);
      }

      showToast(newsId ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      showToast('Erro ao salvar: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Criar nova notícia (limpar formulário)
  const createNewArticle = () => {
    setNewsId(null);
    setNewsTitle('Nova Notícia');
    setNewsSubtitle('');
    setNewsCategory('');
    setCategorySlug('');
    setNewsCategorySlug('');
    setNewsImage('');
    setNewsTags([]);
    setBlocks([]);
    setContentType('noticia');
    setContentNiche('agro');
    
    const today = new Date();
    setNewsYear(today.getFullYear().toString());
    setNewsMonth((today.getMonth() + 1).toString().padStart(2, '0'));
    setNewsDay(today.getDate().toString().padStart(2, '0'));
    
    showToast('Novo artigo iniciado', 'success');
  };

  // Upload de imagem do PC e converter para Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verifica se é imagem
      if (!file.type.startsWith('image/')) {
        showToast('Por favor, selecione apenas arquivos de imagem.', 'error');
        return;
      }
      
      // Verifica tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Imagem muito grande. Máximo 5MB.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewsImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Adicionar tag
  const addTag = () => {
    if (newTagInput.trim() && !newsTags.includes(newTagInput.trim())) {
      setNewsTags([...newsTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  // Remover tag
  const removeTag = (index) => {
    setNewsTags(newsTags.filter((_, i) => i !== index));
  };

  // Remover bloco
  const removeBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  // Mover bloco
  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < blocks.length) {
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  // Copiar JSON para clipboard
  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(blocks, null, 2));
    showToast('JSON copiado para a área de transferência!', 'success');
  };

  // Download JSON
  const downloadJSON = () => {
    const fullNews = {
      type: contentType, // 'noticia' ou 'artigo'
      niche: contentNiche, // 'agro' ou 'geral'
      title: newsTitle,
      subtitle: newsSubtitle,
      date: contentType === 'noticia' ? {
        year: newsYear,
        month: newsMonth,
        day: newsDay
      } : undefined,
      category: {
        nome: newsCategory,
        categorySlug: categorySlug,
        slug: newsCategorySlug
      },
      image: newsImage,
      content: blocks,
      tags: newsTags
    };
    
    const dataStr = JSON.stringify(fullNews, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${contentType}-${contentNiche}-${newsCategorySlug || 'conteudo'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Importar JSON
  const importJSON = () => {
    try {
      const parsed = JSON.parse(importText);
      
      // Verifica se é um objeto com estrutura completa da notícia
      if (parsed.content && Array.isArray(parsed.content)) {
        // Se está editando uma notícia carregada (newsId existe), não alterar título e slug
        const isEditingExisting = !!newsId;
        
        if (isEditingExisting) {
          // Modo edição: preserva título e slugs, importa apenas conteúdo e metadados
          console.log('Modo edição: preservando título e slugs');
          setContentType(parsed.type || contentType);
          setContentNiche(parsed.niche || contentNiche);
          // NÃO altera: newsTitle, newsCategorySlug
          setNewsSubtitle(parsed.subtitle || '');
          if (parsed.date) {
            setNewsYear(parsed.date.year || newsYear);
            setNewsMonth(parsed.date.month || newsMonth);
            setNewsDay(parsed.date.day || newsDay);
          }
          setNewsCategory(parsed.category?.nome || newsCategory);
          setCategorySlug(categorySlug); // Mantém o atual
          // NÃO altera: newsCategorySlug
          // Só altera imagem se vier preenchida no JSON
          if (parsed.image) {
            setNewsImage(parsed.image);
          }
          setNewsTags(parsed.tags || []);
          setBlocks(parsed.content);
          showToast('JSON importado! Título e slug preservados.', 'success');
        } else {
          // Modo criação: importa tudo normalmente
          console.log('Modo criação: importando todos os dados');
          setContentType(parsed.type || 'noticia');
          setContentNiche(parsed.niche || 'agro');
          setNewsTitle(parsed.title || 'Título da Notícia');
          setNewsSubtitle(parsed.subtitle || '');
          if (parsed.date) {
            setNewsYear(parsed.date.year || today.getFullYear().toString());
            setNewsMonth(parsed.date.month || (today.getMonth() + 1).toString().padStart(2, '0'));
            setNewsDay(parsed.date.day || today.getDate().toString().padStart(2, '0'));
          }
          setNewsCategory(parsed.category?.nome || '');
          setCategorySlug(parsed.category?.categorySlug || generateSlug(parsed.category?.nome || ''));
          setNewsCategorySlug(parsed.category?.slug || '');
          // Só altera imagem se vier preenchida no JSON
          if (parsed.image) {
            setNewsImage(parsed.image);
          }
          setNewsTags(parsed.tags || []);
          setBlocks(parsed.content);
          showToast('JSON importado com sucesso!', 'success');
        }
        
        setShowImportModal(false);
        setImportText('');
      } 
      // Se for apenas array de blocos
      else if (Array.isArray(parsed)) {
        setBlocks(parsed);
        setShowImportModal(false);
        setImportText('');
        showToast('Blocos de conteúdo importados!', 'success');
      } 
      else {
        showToast('O JSON deve ser um array de blocos ou um objeto com a propriedade "content".', 'error');
      }
    } catch (error) {
      showToast('Erro ao importar: JSON inválido. Verifique o formato.', 'error');
    }
  };

  // Limpar editor
  const clearEditor = () => {
    if (confirm('Deseja limpar todo o conteúdo? Esta ação não pode ser desfeita.')) {
      setBlocks([{
        type: 'paragraph',
        text: ''
      }]);
      setContentType('noticia');
      setContentNiche('agro');
      setNewsTitle('Título da Notícia');
      setNewsSubtitle('');
      setNewsCategory('');
      setCategorySlug('');
      setNewsCategorySlug('');
      setNewsImage('');
      setNewsTags([]);
      const newToday = new Date();
      setNewsYear(newToday.getFullYear().toString());
      setNewsMonth((newToday.getMonth() + 1).toString().padStart(2, '0'));
      setNewsDay(newToday.getDate().toString().padStart(2, '0'));
    }
  };

  // Renderizar editor do bloco
  const renderBlockEditor = (block, index) => {
    return (
      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 mb-4">
        {/* Cabeçalho do bloco */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
              {block.type.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">Bloco {index + 1}</span>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => moveBlock(index, 'up')}
              disabled={index === 0}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"
              title="Mover para cima"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => moveBlock(index, 'down')}
              disabled={index === blocks.length - 1}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"
              title="Mover para baixo"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => removeBlock(index)}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 rounded"
              title="Remover"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Campos do bloco */}
        {block.type === 'paragraph' && (
          <textarea
            value={block.text}
            onChange={(e) => updateBlock(index, 'text', e.target.value)}
            className="w-full p-3 border rounded-lg min-h-[100px] bg-gray-50 dark:bg-gray-900"
            placeholder="Digite o parágrafo..."
          />
        )}

        {block.type === 'subtitle' && (
          <input
            type="text"
            value={block.text}
            onChange={(e) => updateBlock(index, 'text', e.target.value)}
            className="w-full p-3 border rounded-lg font-bold text-lg bg-gray-50 dark:bg-gray-900"
            placeholder="Digite o subtítulo..."
          />
        )}

        {block.type === 'quote' && (
          <textarea
            value={block.text}
            onChange={(e) => updateBlock(index, 'text', e.target.value)}
            className="w-full p-3 border rounded-lg min-h-[100px] bg-gray-50 dark:bg-gray-900 italic"
            placeholder="Digite a citação — Nome do Autor"
          />
        )}

        {block.type === 'info_box' && (
          <div className="space-y-3">
            <input
              type="text"
              value={block.title}
              onChange={(e) => updateBlock(index, 'title', e.target.value)}
              className="w-full p-3 border rounded-lg font-semibold bg-gray-50 dark:bg-gray-900"
              placeholder="Título do box"
            />
            <textarea
              value={block.text}
              onChange={(e) => updateBlock(index, 'text', e.target.value)}
              className="w-full p-3 border rounded-lg min-h-[80px] bg-gray-50 dark:bg-gray-900"
              placeholder="Texto do box..."
            />
          </div>
        )}

        {block.type === 'highlight' && (
          <textarea
            value={block.text}
            onChange={(e) => updateBlock(index, 'text', e.target.value)}
            className="w-full p-3 border rounded-lg min-h-[80px] bg-amber-50 dark:bg-amber-900/20"
            placeholder="Texto destacado..."
          />
        )}

        {block.type === 'image' && (
          <div className="space-y-3">
            {/* Tabs: URL ou Upload */}
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => {
                  const newBlocks = [...blocks];
                  newBlocks[index].uploadMode = false;
                  setBlocks(newBlocks);
                }}
                className={`px-4 py-2 rounded text-sm ${
                  !block.uploadMode ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                URL
              </button>
              <button
                onClick={() => {
                  const newBlocks = [...blocks];
                  newBlocks[index].uploadMode = true;
                  setBlocks(newBlocks);
                }}
                className={`px-4 py-2 rounded text-sm ${
                  block.uploadMode ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                Upload
              </button>
            </div>

            {/* URL Input */}
            {!block.uploadMode && (
              <input
                type="text"
                value={block.url}
                onChange={(e) => updateBlock(index, 'url', e.target.value)}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900"
                placeholder="URL da imagem (https://...)"
              />
            )}

            {/* Upload Input */}
            {block.uploadMode && (
              <div>
                <label className="block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          updateBlock(index, 'url', event.target.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clique para fazer upload ou arraste a imagem
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WEBP até 5MB
                    </p>
                  </div>
                </label>
                {block.url && block.url.startsWith('data:') && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs">
                    ✓ Imagem carregada (Base64)
                  </div>
                )}
              </div>
            )}

            {/* Preview da imagem */}
            {block.url && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={
                    block.url.startsWith('data:') 
                      ? block.url 
                      : block.url.startsWith('/') 
                        ? `https://api.boca.com.br${block.url}` 
                        : block.url.startsWith('http') 
                          ? block.url 
                          : `https://api.boca.com.br/${block.url}`
                  }
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-red-500">
                  ⚠️ Erro ao carregar imagem
                </div>
              </div>
            )}

            <input
              type="text"
              value={block.alt_text}
              onChange={(e) => updateBlock(index, 'alt_text', e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900"
              placeholder="Texto alternativo (descrição da imagem)"
            />
            <input
              type="text"
              value={block.caption}
              onChange={(e) => updateBlock(index, 'caption', e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900"
              placeholder="Legenda da imagem (opcional)"
            />
          </div>
        )}

        {block.type === 'video' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                URL do Vídeo
              </label>
              <input
                type="text"
                value={block.url}
                onChange={(e) => updateBlock(index, 'url', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Suporta YouTube, Vimeo e outros serviços de vídeo
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Legenda (opcional)
              </label>
              <input
                type="text"
                value={block.caption || ''}
                onChange={(e) => updateBlock(index, 'caption', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Descrição ou contexto do vídeo..."
              />
            </div>

            {block.url && (
              <div className="mt-4 p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-red-900 dark:text-red-300 mb-1">Preview do Vídeo:</p>
                    <p className="text-xs text-red-800 dark:text-red-400 break-all leading-relaxed">{block.url}</p>
                    {(() => {
                      let platform = 'Vídeo';
                      if (block.url.includes('youtube.com') || block.url.includes('youtu.be')) platform = 'YouTube';
                      else if (block.url.includes('vimeo.com')) platform = 'Vimeo';
                      return (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded">
                          {platform}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {block.type === 'list' && (
          <textarea
            value={block.items.join('\n')}
            onChange={(e) => updateBlock(index, 'items', e.target.value)}
            className="w-full p-3 border rounded-lg min-h-[120px] bg-gray-50 dark:bg-gray-900"
            placeholder="Digite um item por linha..."
          />
        )}
      </div>
    );
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      
      {/* Botão de Tema Flutuante */}
      <div className="fixed bottom-6 right-6 z-40">
        <ThemeToggle />
      </div>
      
      {/* Modal de Prompt IA */}
      {showAIPromptModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          onClick={() => setShowAIPromptModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-pink-600">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Prompt para Inteligência Artificial
              </h2>
              <p className="text-sm text-purple-100 mt-1">
                Copie o prompt abaixo e cole no ChatGPT, Claude ou outra IA junto com seu texto para converter automaticamente
              </p>
              <div className="mt-4">
                <label className="text-white font-semibold mr-2">Tipo de Prompt:</label>
                <select
                  value={aiPromptType}
                  onChange={e => setAIPromptType(e.target.value)}
                  className="rounded px-2 py-1 text-sm bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="estruturar">Estruturar (JSON Notícia)</option>
                  <option value="reformular">Reformular (Texto Único, Outro Autor)</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap border border-gray-300 dark:border-gray-700">
                {aiPromptType === 'estruturar' ? generateAIPrompt() : generateAIRewritePrompt()}
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Como usar:
                </h3>
                <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-2 list-decimal list-inside">
                  <li>Clique em "Copiar Prompt" abaixo</li>
                  <li>Abra ChatGPT, Claude ou outra IA de sua preferência</li>
                  <li>Cole o prompt copiado</li>
                  <li>Logo após o prompt, cole o texto da sua notícia/artigo</li>
                  <li>{aiPromptType === 'estruturar' ? 'A IA vai gerar o JSON estruturado automaticamente' : 'A IA vai reescrever o texto com outro estilo/autor'}</li>
                  <li>{aiPromptType === 'estruturar' ? 'Copie o JSON gerado e use o botão "Importar JSON" no editor' : 'Copie o texto reescrito e use como desejar'}</li>
                </ol>
              </div>
            </div>

            <div className="p-6 border-t flex justify-between gap-3">
              <button
                onClick={() => setShowAIPromptModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300"
              >
                Fechar
              </button>
              <button
                onClick={copyAIPrompt}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 font-semibold"
              >
                <Save className="w-5 h-5" />
                Copiar Prompt Completo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Importação */}
      {showImportModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          onClick={() => setShowImportModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Importar Conteúdo JSON</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Cole o JSON completo da notícia (com title, category, content, etc.) ou apenas o array de blocos
            </p>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
              {newsId && (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-yellow-900 dark:text-yellow-200 mb-1">
                        Modo Edição Ativo
                      </h3>
                      <p className="text-xs text-yellow-800 dark:text-yellow-300">
                        Você está editando uma notícia existente. O <strong>título</strong> e <strong>slug</strong> serão <strong>preservados</strong> e não serão alterados pela importação. 
                        Apenas conteúdo, imagem, tags e outros metadados serão atualizados.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full h-64 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900"
                placeholder='{
  "title": "Título da Notícia",
  "subtitle": "Subtítulo opcional",
  "category": {
    "nome": "Categoria",
    "slug": "categoria-slug"
  },
  "image": "https://...",
  "content": [
    {
      "type": "paragraph",
      "text": "Texto..."
    }
  ],
  "tags": ["tag1", "tag2"]
}'
              />
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportText('');
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={importJSON}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Importar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Buscar Notícias */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Buscar Notícias
                  </h2>
                  <p className="text-blue-100">
                    Busque notícias da Boca News e carregue no editor para edição
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSearchModal(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Campo de Busca */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchNews()}
                  placeholder="Digite sua busca (ex: tomate, soja, clima...)"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-white"
                  disabled={isSearching}
                />
                <button
                  onClick={searchNews}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Buscar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Resultados da Busca */}
            <div className="flex-1 overflow-y-auto p-6">
              {searchResults.length === 0 && !isSearching && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-semibold mb-2">Nenhuma busca realizada</p>
                  <p className="text-sm">Digite um termo e clique em Buscar</p>
                </div>
              )}

              {isSearching && (
                <div className="text-center py-12">
                  <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">Buscando notícias...</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {searchResults.length} notícia(s) encontrada(s)
                  </p>
                  <div className="grid gap-4">
                    {searchResults.map((article, idx) => (
                      <div 
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
                      >
                        <div className="flex gap-4">
                          {article.image && (
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2">
                                {article.title}
                              </h3>
                              <button
                                onClick={() => loadNewsToEditor(article)}
                                disabled={loadingArticle}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {loadingArticle ? (
                                  <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Carregando...
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                <span>Editar</span>
                                  </>
                                )}
                              </button>
                            </div>
                            {article.subtitle && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                                {article.subtitle}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 text-xs">
                              {article.category && (
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                                  {article.category}
                                </span>
                              )}
                              {article.date && (
                                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                                  {article.date}
                                </span>
                              )}
                              {article.author && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                                  {article.author}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t flex justify-end">
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <div 
        
        className="flex flex-col lg:flex-row h-screen"
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Painel Esquerdo - Editor */}
        <div 
          className="w-full lg:w-[60%] overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-300 dark:border-gray-700 lg:h-screen"
          style={{ height: window.innerWidth < 1024 ? `${100 - previewHeight}vh` : 'auto' }}
        >
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Editor de Conteúdo</h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Crie e edite notícias e artigos no formato estruturado
                  </p>
                </div>
              </div>

              {/* Barra de Ações */}
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Ações Principais */}
                <div className="flex gap-2 flex-1 flex-wrap">
                  <button
                    onClick={createNewArticle}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                <span>Nova Notícia</span>
                  </button>

                  <button
                    onClick={() => setShowSearchModal(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Buscar</span>
                  </button>

                  <button
                    onClick={saveNews}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{newsId ? 'Atualizar' : 'Salvar Nova'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Ações Secundárias */}
                <div className="flex gap-2 sm:justify-end">
                  <button
                    onClick={() => setShowAIPromptModal(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2 text-sm font-medium transition-all"
                    title="Gerar prompt para IA"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="sm:hidden lg:inline">Prompt IA</span>
                    <span className="hidden sm:inline lg:hidden">IA</span>
                  </button>
                  
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    title="Importar JSON"
                  >
                    <Code className="w-4 h-4" />
                    <span className="sm:hidden lg:inline">Importar</span>
                  </button>
                  
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    title="Limpar editor"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Limpar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Seletor de Tipo e Nicho */}
          <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-300 dark:border-green-700 overflow-hidden">
            <button
              onClick={() => toggleSection('contentType')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-green-100/50 dark:hover:bg-green-800/30 transition-colors"
            >
              <h2 className="text-base font-bold text-green-900 dark:text-green-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                Tipo de Conteúdo e Nicho
              </h2>
              <ChevronDown className={`w-5 h-5 transition-transform ${sectionsOpen.contentType ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${sectionsOpen.contentType ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-6 pb-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de Conteúdo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                  📄 Tipo de Conteúdo
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => setContentType('noticia')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      contentType === 'noticia'
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-2xl">📰</span>
                      <span className="text-sm">Notícia</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setContentType('artigo')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      contentType === 'artigo'
                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-2xl">📝</span>
                      <span className="text-sm">Artigo</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setContentType('opiniao')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      contentType === 'opiniao'
                        ? 'bg-amber-600 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-2xl">💭</span>
                      <span className="text-sm">Opinião</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setContentType('analise')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      contentType === 'analise'
                        ? 'bg-teal-600 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-2xl">📊</span>
                      <span className="text-sm">Análise</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Nicho */}
              <div>
                <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                  🌾 Nicho / Setor
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setContentNiche('agro')}
                    className={`flex-1 px-6 py-4 rounded-lg font-bold text-lg transition-all ${
                      contentNiche === 'agro'
                        ? 'bg-green-600 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">🌾</span>
                      <span>Agro</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setContentNiche('geral')}
                    className={`flex-1 px-6 py-4 rounded-lg font-bold text-lg transition-all ${
                      contentNiche === 'geral'
                        ? 'bg-orange-600 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">🌐</span>
                      <span>Geral</span>
                    </div>
                  </button>
                </div>
              </div>
            
                  {/* Badge de Seleção Atual */}
                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Conteúdo: <span className="font-bold text-lg">
                        {contentType === 'noticia' ? '📰 Notícia' : 
                         contentType === 'artigo' ? '📝 Artigo' :
                         contentType === 'opiniao' ? '💭 Opinião' : '📊 Análise'}
                      </span> • 
                      <span className="font-bold text-lg ml-2">
                        {contentNiche === 'agro' ? '🌾 Agronegócio' : '🌐 Geral'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metadados da Notícia */}
          <div className="mb-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
            <button
              onClick={() => toggleSection('metadata')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-100/50 dark:hover:bg-blue-800/30 transition-colors"
            >
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                Informações da Notícia
              </h2>
              <ChevronDown className={`w-5 h-5 transition-transform ${sectionsOpen.metadata ? 'rotate-180' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${sectionsOpen.metadata ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-6 pb-6 pt-2 space-y-4">

            {/* Título */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                📰 Título Principal *
                {newsId && (
                  <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm0-2v2h10V7a3 3 0 00-6 0z" clipRule="evenodd" />
                    </svg>
                    Bloqueado
                  </span>
                )}
              </label>
              <input
                type="text"
                value={newsTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                readOnly={!!newsId}
                disabled={!!newsId}
                className={`w-full px-4 py-3 border-2 rounded-lg text-xl font-bold focus:ring-2 focus:ring-blue-500 transition-all ${
                  newsId 
                    ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed' 
                    : 'border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800'
                }`}
                placeholder="Digite o título da notícia"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                {newsId ? (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Título bloqueado - vinculado ao slug da notícia original
                  </>
                ) : (
                  'O slug será gerado automaticamente'
                )}
              </p>
            </div>

            {/* Subtítulo */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                📝 Subtítulo / Linha Fina
              </label>
              <textarea
                value={newsSubtitle}
                onChange={(e) => setNewsSubtitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 resize-none"
                rows="2"
                placeholder="Subtítulo ou descrição breve da notícia"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                📂 Categoria *
              </label>
              <input
                type="text"
                value={newsCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border-2 border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Agronegócio, Tecnologia, Economia"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Slug da categoria: {categorySlug || 'categoria-aqui'}
              </p>
            </div>

            {/* Slug (gerado automaticamente) */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🔗 Slug da URL (gerado automaticamente)
                {newsId && (
                  <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 006 0z" clipRule="evenodd" />
                    </svg>
                    Bloqueado
                  </span>
                )}
              </label>
              <input
                type="text"
                value={newsCategorySlug}
                onChange={(e) => setNewsCategorySlug(e.target.value)}
                readOnly={!!newsId}
                disabled={!!newsId}
                className={`w-full px-4 py-2 border-2 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 transition-all ${
                  newsId 
                    ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800'
                }`}
                placeholder="titulo-da-noticia"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                {newsId ? (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Slug bloqueado - URL: {getUrlPreview()}
                  </>
                ) : (
                  `URL Preview: ${getUrlPreview()}`
                )}
              </p>
            </div>

            {/* Imagem Principal */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                🖼️ Imagem Principal (Capa)
              </label>
              
              {/* Tabs: URL ou Upload */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => document.getElementById('main-image-url-tab').classList.remove('hidden')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  🔗 URL
                </button>
                <button
                  onClick={() => document.getElementById('main-image-upload').click()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  📤 Upload do PC
                </button>
                <input
                  id="main-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* URL Input */}
              <div id="main-image-url-tab">
                <input
                  type="text"
                  value={newsImage}
                  onChange={(e) => setNewsImage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="https://exemplo.com/imagem.jpg ou clique em Upload"
                />
              </div>

              {/* Preview da Imagem */}
              {newsImage && (
                <div className="mt-3 relative group">
                  <img 
                    src={newsImage} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg border-2 border-green-400 shadow-lg"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="16" fill="%23999"%3EErro ao carregar imagem%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <button
                    onClick={() => setNewsImage('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remover imagem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-xs">
                    {newsImage.startsWith('data:') ? '📤 Imagem enviada do PC' : '🔗 URL externa'}
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Cole uma URL ou faça upload de uma imagem do seu PC (máx. 5MB)
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                🏷️ Tags / Palavras-chave
              </label>
              
              {/* Input para adicionar tag */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border-2 border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite uma tag e pressione Enter"
                />
                <button
                  onClick={addTag}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap font-semibold"
                >
                  + Adicionar
                </button>
              </div>

              {/* Lista de tags */}
              {newsTags.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {newsTags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium flex items-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(idx)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        title="Remover tag"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                  Nenhuma tag adicionada. Adicione tags para melhorar o SEO!
                </div>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Total: {newsTags.length} tag{newsTags.length !== 1 ? 's' : ''} • Use tags relevantes para SEO e busca interna
              </p>
            </div>
              </div>
            </div>
          </div>

          {/* Blocos de Conteúdo */}
          <div className="mb-4 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection('blocks')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="text-base font-semibold flex items-center gap-2">
                📝 Blocos de Conteúdo ({blocks.length})
              </h3>
              <ChevronDown className={`w-5 h-5 transition-transform ${sectionsOpen.blocks ? 'rotate-180' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${sectionsOpen.blocks ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-4">
                <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Adicionar Bloco:</h4>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => addBlock('paragraph')}
                className="flex flex-col items-center gap-1 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <Type className="w-5 h-5" />
                <span className="text-xs">Parágrafo</span>
              </button>
              
              <button
                onClick={() => addBlock('subtitle')}
                className="flex flex-col items-center gap-1 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <Type className="w-5 h-5 font-bold" />
                <span className="text-xs">Subtítulo</span>
              </button>
              
              <button
                onClick={() => addBlock('quote')}
                className="flex flex-col items-center gap-1 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <Quote className="w-5 h-5" />
                <span className="text-xs">Citação</span>
              </button>
              
              <button
                onClick={() => addBlock('info_box')}
                className="flex flex-col items-center gap-1 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <Info className="w-5 h-5" />
                <span className="text-xs">Info Box</span>
              </button>
              
              <button
                onClick={() => addBlock('highlight')}
                className="flex flex-col items-center gap-1 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-xs">Destaque</span>
              </button>
              
              <button
                onClick={() => addBlock('image')}
                className="flex flex-col items-center gap-1 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                <span className="text-xs">Imagem</span>
              </button>
              
              <button
                onClick={() => addBlock('list')}
                className="flex flex-col items-center gap-1 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <List className="w-5 h-5" />
                <span className="text-xs">Lista</span>
              </button>
              
              <button
                onClick={() => addBlock('video')}
                className="flex flex-col items-center gap-1 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664l-3-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs">Vídeo</span>
              </button>
            </div>

                {/* Lista de blocos */}
                <div className="space-y-4 mt-4">
                  {blocks.map((block, index) => renderBlockEditor(block, index))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Painel Direito - Preview/Code */}
      <div 
        className="w-full lg:w-[40%] overflow-y-auto bg-gray-50 dark:bg-gray-900 relative lg:h-screen"
        style={{ height: window.innerWidth < 1024 ? `${previewHeight}vh` : 'auto' }}
      >
        {/* Drag Handle - Somente Mobile */}
        <div 
          className="lg:hidden absolute top-0 left-0 right-0 h-8 flex items-center justify-center cursor-ns-resize z-20 bg-gray-200/80 dark:bg-gray-700/80 active:bg-blue-100 dark:active:bg-blue-900/40 transition-colors touch-none"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="flex flex-col gap-1.5 pointer-events-none">
            <div className="w-12 h-1 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
            <div className="w-12 h-1 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
          </div>
        </div>

        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b p-4 flex justify-between items-center gap-2 mt-8 lg:mt-0">
          <div className="flex gap-2">
            <button
              onClick={() => setShowCode(false)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                !showCode ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setShowCode(true)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                showCode ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <Code className="w-4 h-4" />
              Código
            </button>
          </div>

          {showCode && (
            <div className="flex gap-2">
              <button
                onClick={copyJSON}
                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 text-sm"
              >
                <Save className="w-4 h-4" />
                Copiar
              </button>
            </div>
          )}
        </div>

        <div className="p-6 flex justify-center">
          {!showCode ? (
            /* Preview da notícia */
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg max-w-4xl w-full">
              {/* Categoria e Tempo de Leitura no topo */}
              <div className="flex items-center gap-3 mb-4">
                {newsCategory && (
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    {newsCategory}
                  </span>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {calculateReadingTime()} min de leitura
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-2">{newsTitle}</h1>
              {newsSubtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{newsSubtitle}</p>
              )}

              {newsImage && (
                <img 
                  src={newsImage} 
                  alt={newsTitle}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              
              <StructuredContent content={blocks} title={newsTitle} />
              {newsTags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {newsTags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Código JSON */
            <div className="bg-gray-900 text-green-400 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm font-mono">
                {JSON.stringify({
                  type: contentType,
                  niche: contentNiche,
                  title: newsTitle,
                  subtitle: newsSubtitle,
                  ...(contentType === 'noticia' && {
                    date: {
                      year: newsYear,
                      month: newsMonth,
                      day: newsDay
                    }
                  }),
                  category: {
                    nome: newsCategory,
                    categorySlug: categorySlug,
                    slug: newsCategorySlug
                  },
                  image: newsImage,
                  content: blocks,
                  tags: newsTags
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
