/**
 * Fire Assistant - Implementação Correta
 * Assistente focado exclusivamente no Fire Server e sua DSL
 * SEM ensino de outras linguagens
 */

class FireAssistant {
    constructor() {
        // Identidade fixa (NÃO muda)
        this.identity = {
            name: "Fire Assistant",
            role: "assistente do Fire Server",
            creator: "Equipe do Fire Server",
            scope: [
                "explicar o Fire Server",
                "ajudar com a DSL",
                "explicar erros do editor"
            ],
            forbidden: [
                "compras",
                "robux",
                "golpes",
                "conteúdos externos perigosos",
                "ensinar linguagens não relacionadas"
            ]
        };

        // Tipos de perguntas
        this.QUESTION_TYPE = {
            GREETING: "greeting",
            IDENTITY: "identity",
            PLATFORM: "platform",
            DSL: "dsl",
            ERROR: "error",
            OFF_TOPIC: "off_topic",
            FORBIDDEN: "forbidden",
            UNKNOWN: "unknown"
        };

        this.chatHistory = [];
        this.init();
    }

    /**
     * Inicializa o assistente
     */
    init() {
        const sendBtn = document.getElementById('sendAiBtn');
        const input = document.getElementById('aiInput');
        const closeBtn = document.getElementById('closeAiModal');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.handleUserMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUserMessage();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('aiModal').classList.remove('active');
            });
        }

        // Mensagem de boas-vindas
        this.addMessage('ai', this.getWelcomeMessage());
    }

    /**
     * Mensagem de boas-vindas
     */
    getWelcomeMessage() {
        return `👋 Olá! Sou o assistente do Fire Server.

Posso te ajudar com:
• 📝 Como usar a DSL
• 🐛 Entender erros do editor
• 🎨 Dar exemplos de páginas

Como posso ajudar?`;
    }

    /**
     * Processa mensagem do usuário
     */
    handleUserMessage() {
        const input = document.getElementById('aiInput');
        const message = input.value.trim();

        if (!message) return;

        // Adicionar mensagem do usuário
        this.addMessage('user', message);
        input.value = '';

        // Detectar tipo e gerar resposta
        const type = this.detectType(message);
        const response = this.generateResponse(type, message);

        // Adicionar resposta da IA
        setTimeout(() => {
            this.addMessage('ai', response);
        }, 500);
    }

    /**
     * CLASSIFICADOR DE INTENÇÕES
     * Detecta o TIPO da pergunta, não palavras soltas
     */
    detectType(msg) {
        const msgLower = msg.toLowerCase().trim();

        // Prioridade 1: Cumprimento (exato)
        if (this.isGreeting(msgLower)) {
            return this.QUESTION_TYPE.GREETING;
        }

        // Prioridade 2: Identidade
        if (this.isIdentity(msgLower)) {
            return this.QUESTION_TYPE.IDENTITY;
        }

        // Prioridade 3: Plataforma
        if (this.isPlatform(msgLower)) {
            return this.QUESTION_TYPE.PLATFORM;
        }

        // Prioridade 4: Proibido (robux, compras)
        if (this.isForbidden(msgLower)) {
            return this.QUESTION_TYPE.FORBIDDEN;
        }

        // Prioridade 5: Off-topic (ensinar outras linguagens)
        if (this.isOffTopic(msgLower)) {
            return this.QUESTION_TYPE.OFF_TOPIC;
        }

        // Prioridade 6: DSL
        if (this.isDSL(msgLower)) {
            return this.QUESTION_TYPE.DSL;
        }

        // Prioridade 7: Erro
        if (this.isError(msgLower)) {
            return this.QUESTION_TYPE.ERROR;
        }

        // Fallback
        return this.QUESTION_TYPE.UNKNOWN;
    }

    /**
     * Detectores de tipo
     */
    isGreeting(msg) {
        const greetings = ["oi", "ola", "olá", "eai", "hey", "bom dia", "boa tarde", "boa noite"];
        return greetings.some(g => msg === g || msg === g + "!");
    }

    isIdentity(msg) {
        const patterns = [
            "quem é você",
            "o que você é",
            "qual seu nome",
            "quem são você",
            "você é o que",
            "me diz quem você é"
        ];
        return patterns.some(p => msg.includes(p));
    }

    isPlatform(msg) {
        const patterns = ["quem criou", "dono", "quem fez", "criador", "quem é o dono"];
        return patterns.some(p => msg.includes(p)) && 
               (msg.includes("fire") || msg.includes("servidor") || msg.includes("plataforma"));
    }

    isDSL(msg) {
        const commands = ["page", "text", "button", "image", "divider", "jump", "title", "load", "end"];
        const helps = ["como usar", "exemplo de", "sintaxe", "como fazer", "como criar"];
        
        return commands.some(c => msg.includes(c)) || helps.some(h => msg.includes(h));
    }

    isError(msg) {
        const errors = ["erro", "bug", "não funciona", "nao funciona", "problema", "ajuda", "deu errado"];
        return errors.some(e => msg.includes(e));
    }

    isForbidden(msg) {
        const forbidden = [
            "robux",
            "comprar",
            "vender",
            "hack",
            "roubar",
            "golpe",
            "free robux",
            "moeda"
        ];
        return forbidden.some(f => msg.includes(f));
    }

    isOffTopic(msg) {
        const topics = [
            "me ensina",
            "tutorial",
            "python",
            "javascript",
            "java ",
            "c++",
            "html",
            "css",
            "aprender",
            "qual linguagem"
        ];
        return topics.some(t => msg.includes(t));
    }

    /**
     * Gera resposta baseada no tipo
     */
    generateResponse(type, message) {
        switch(type) {
            case this.QUESTION_TYPE.GREETING:
                return this.responseGreeting();

            case this.QUESTION_TYPE.IDENTITY:
                return this.responseIdentity();

            case this.QUESTION_TYPE.PLATFORM:
                return this.responsePlatform();

            case this.QUESTION_TYPE.DSL:
                return this.responseDSL(message);

            case this.QUESTION_TYPE.ERROR:
                return this.responseError();

            case this.QUESTION_TYPE.FORBIDDEN:
                return this.responseForbidden();

            case this.QUESTION_TYPE.OFF_TOPIC:
                return this.responseOffTopic();

            case this.QUESTION_TYPE.UNKNOWN:
            default:
                return this.responseUnknown();
        }
    }

    /**
     * 🟢 RESPOSTAS FIXAS E APROPRIADAS
     */

    responseGreeting() {
        return `Oi! 👋

Posso te ajudar a usar o Fire Server ou explicar como a DSL funciona.`;
    }

    responseIdentity() {
        return `Sou o assistente do Fire Server.

Estou aqui para ajudar você a usar a plataforma e entender a DSL.`;
    }

    responsePlatform() {
        return `O Fire Server é um projeto mantido pela própria equipe do Fire Server.`;
    }

    responseDSL(message) {
        // Detectar comando específico
        const msgLower = message.toLowerCase();
        
        const dslHelp = {
            'page': {
                title: '📄 Comando: page',
                syntax: 'page nomeDaPagina',
                example: `page inicial
title "Minha Primeira Página"
text msg ("Olá!")
end`,
                description: 'Toda página começa com `page` e termina com `end`. O nome deve ser único!'
            },
            'text': {
                title: '📝 Comando: text',
                syntax: 'text id ("texto", loads)',
                example: `text titulo ("Bem-vindo!")
text descricao ("Este é meu site", color("#FF6B35"))`,
                description: 'Adiciona texto ao site. Você pode estilizar com `color()`, `size()`, `font()`'
            },
            'button': {
                title: '🔘 Comando: button',
                syntax: 'button id ("texto" link "url")',
                example: `button email ("Email" link "mailto:seu@email.com")
button github ("GitHub" link "https://github.com")
button proxima ("Próxima" page outraPagina)`,
                description: 'Cria botões clicáveis. Use `link` para URLs ou `page` para navegar entre páginas'
            },
            'image': {
                title: '🖼️ Comando: image',
                syntax: 'image id ("url")',
                example: `image logo ("https://exemplo.com/logo.png")`,
                description: '⚠️ Máximo de 10 imagens por site! Use URLs públicas (https://)'
            },
            'divider': {
                title: '➖ Comando: divider',
                syntax: 'divider',
                example: `text parte1 ("Primeira parte")
divider
text parte2 ("Segunda parte")`,
                description: 'Cria uma linha horizontal separadora'
            },
            'jump': {
                title: '⬇️ Comando: jump',
                syntax: 'jump',
                example: `text titulo ("Título")
jump
text subtitulo ("Subtítulo")`,
                description: 'Pula uma linha, adicionando espaço vertical'
            },
            'title': {
                title: '🏷️ Comando: title',
                syntax: 'title "Título da Página"',
                example: `page inicial
title "Meu Site Incrível"`,
                description: 'Define o título que aparece na aba do navegador'
            }
        };

        // Encontrar comando mencionado
        const command = Object.keys(dslHelp).find(cmd => msgLower.includes(cmd));

        if (command && dslHelp[command]) {
            const help = dslHelp[command];
            return `${help.title}

**Sintaxe:**
\`${help.syntax}\`

**Exemplo:**
\`\`\`dsl
${help.example}
\`\`\`

**Descrição:**
${help.description}

Quer ver mais exemplos ou aprender outro comando? 🚀`;
        }

        // Resposta genérica sobre DSL
        return `**Comandos disponíveis da DSL:**

• \`page\` - Cria uma página
• \`text\` - Adiciona texto
• \`button\` - Cria botão
• \`image\` - Adiciona imagem
• \`divider\` - Linha separadora
• \`jump\` - Pula linha
• \`title\` - Título da página

Me pergunte sobre um comando específico! 🚀

**Exemplo básico:**
\`\`\`dsl
page inicial
title "Meu Site"
text bemvindo ("Olá! Bem-vindo 👋")
end
\`\`\``;
    }

    responseError() {
        return `**Erros comuns e soluções:**

1. **"Falta end"** 
   → Toda página precisa terminar com \`end\`

2. **"Aspas não fechadas"** 
   → Sempre use aspas duplas: \`"texto"\`

3. **"Comando não reconhecido"** 
   → Verifique a sintaxe no guia

4. **"Muitas imagens"** 
   → Máximo de 10 imagens por site

5. **"Nome duplicado"** 
   → IDs de elementos devem ser únicos

Me diga qual erro você está tendo para eu ajudar melhor! 🐛`;
    }

    responseForbidden() {
        return `Não posso ajudar com compras, moedas virtuais ou assuntos desse tipo.

Se quiser, posso ajudar com o Fire Server ou explicar como criar seu site 🙂`;
    }

    responseOffTopic() {
        return `Não ensino outras linguagens de programação aqui.

Posso te ajudar com:
• Como usar a DSL do Fire Server
• Entender erros do editor
• Exemplos de páginas

É só me dizer o que você quer fazer no Fire Server! 🔥`;
    }

    responseUnknown() {
        return `Não entendi muito bem 🤔

Posso te ajudar com:
• Como usar a DSL
• Entender erros do editor
• Exemplos de páginas

É só me dizer o que você quer fazer no Fire Server.`;
    }

    /**
     * Adiciona mensagem ao chat
     */
    addMessage(sender, text) {
        const chatMessages = document.getElementById('aiMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;

        // Processar markdown básico
        const processedText = this.processMarkdown(text);
        messageDiv.innerHTML = processedText;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Salvar no histórico
        this.chatHistory.push({ sender, text, timestamp: Date.now() });
    }

    /**
     * Processa markdown básico
     */
    processMarkdown(text) {
        // Blocos de código
        text = text.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
            return `<div class="code-block">
                <div class="code-lang">${lang || 'code'}</div>
                <pre><code>${this.escapeHtml(code.trim())}</code></pre>
            </div>`;
        });

        // Código inline
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Negrito
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Quebras de linha
        text = text.replace(/\n/g, '<br>');

        return text;
    }

    /**
     * Escapa HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Limpa histórico
     */
    clearHistory() {
        this.chatHistory = [];
        const chatMessages = document.getElementById('aiMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            this.addMessage('ai', this.getWelcomeMessage());
        }
    }
}

// Inicializar quando o DOM estiver pronto
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.fireAssistant = new FireAssistant();
    });
}

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FireAssistant;
}
