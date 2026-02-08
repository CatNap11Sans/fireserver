/**
 * Fire Assistant - Versão Inteligente
 * Com detecção de contexto, memória e anti-loop
 */

class AIAssistant {
    constructor() {
        this.identity = {
            name: "Fire Assistant",
            creator: "Sawi Fox Studios",
            role: "assistente do Fire Server"
        };

        this.QUESTION_TYPE = {
            GREETING: "greeting",
            IDENTITY: "identity",
            PLATFORM: "platform",
            DSL_COMMAND: "dsl_command",
            DSL_CONCEPT: "dsl_concept",
            ERROR: "error",
            FORBIDDEN: "forbidden",
            OFF_TOPIC: "off_topic",
            FRUSTRATION: "frustration",
            UNKNOWN: "unknown"
        };

        // Memória de contexto
        this.context = {
            lastQuestion: null,
            lastResponse: null,
            unknownCount: 0,
            lastTopics: []
        };

        this.chatHistory = [];
        this.init();
    }

    init() {
        const sendBtn = document.getElementById('sendAiBtn');
        const input = document.getElementById('aiInput');
        const closeBtn = document.getElementById('closeAiModal');
        const aiHelpBtn = document.getElementById('aiHelpBtn');
        const modal = document.getElementById('aiModal');

        if (aiHelpBtn) {
            aiHelpBtn.addEventListener('click', () => {
                if (modal) modal.classList.add('active');
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (modal) modal.classList.remove('active');
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }

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

        this.addMessage('ai', this.getWelcomeMessage());
    }

    getWelcomeMessage() {
        return `Oi! 👋 Sou o assistente do Fire Server.

Pode me perguntar sobre comandos, loads, erros ou qualquer dúvida sobre a DSL.`;
    }

    handleUserMessage() {
        const input = document.getElementById('aiInput');
        const message = input.value.trim();

        if (!message) return;

        this.addMessage('user', message);
        input.value = '';

        // Salvar contexto
        this.context.lastQuestion = message;

        // Detectar tipo com prioridade de palavras-chave
        const type = this.detectTypeIntelligent(message);
        const response = this.generateIntelligentResponse(type, message);

        // Salvar resposta no contexto
        this.context.lastResponse = type;
        
        setTimeout(() => {
            this.addMessage('ai', response);
        }, 500);
    }

    /**
     * DETECTOR INTELIGENTE - Prioriza palavras-chave específicas
     */
    detectTypeIntelligent(msg) {
        const msgLower = msg.toLowerCase().trim();

        // 🔥 PRIORIDADE 1: Frustração (detectar primeiro!)
        if (this.isFrustrated(msgLower)) {
            return this.QUESTION_TYPE.FRUSTRATION;
        }

        // 🔥 PRIORIDADE 2: Palavras-chave específicas (loads, etc)
        if (msgLower.includes('load') || msgLower.includes('loads')) {
            return this.QUESTION_TYPE.DSL_CONCEPT;
        }

        // Cumprimento
        if (this.isGreeting(msgLower)) {
            return this.QUESTION_TYPE.GREETING;
        }

        // Identidade
        if (this.isIdentity(msgLower)) {
            return this.QUESTION_TYPE.IDENTITY;
        }

        // Comandos DSL específicos
        if (this.isDSLCommand(msgLower)) {
            return this.QUESTION_TYPE.DSL_COMMAND;
        }

        // Erro
        if (this.isError(msgLower)) {
            return this.QUESTION_TYPE.ERROR;
        }

        // Proibido
        if (this.isForbidden(msgLower)) {
            return this.QUESTION_TYPE.FORBIDDEN;
        }

        // Off-topic
        if (this.isOffTopic(msgLower)) {
            return this.QUESTION_TYPE.OFF_TOPIC;
        }

        return this.QUESTION_TYPE.UNKNOWN;
    }

    /**
     * DETECTOR DE FRUSTRAÇÃO
     */
    isFrustrated(msg) {
        const frustratedWords = [
            'cara', 'mano', 'porra', 'aaaaa', 'kkkkk',
            'para', 'pare de', 'chato', 'confuso',
            'não entendo', 'burro', 'pqp'
        ];

        // CAPS LOCK
        if (msg === msg.toUpperCase() && msg.length > 3) {
            return true;
        }

        return frustratedWords.some(w => msg.includes(w));
    }

    isGreeting(msg) {
        const greetings = ["oi", "ola", "olá", "eai", "hey", "bom dia", "boa tarde", "boa noite"];
        return greetings.some(g => msg === g || msg === g + "!");
    }

    isIdentity(msg) {
        return msg.includes("quem é você") || 
               msg.includes("o que você é") || 
               msg.includes("quem criou") ||
               msg.includes("qual seu nome");
    }

    isDSLCommand(msg) {
        const commands = ["page", "text", "button", "image", "divider", "jump", "title", "end"];
        return commands.some(c => msg.includes(c));
    }

    isError(msg) {
        return msg.includes("erro") || 
               msg.includes("bug") || 
               msg.includes("não funciona") ||
               msg.includes("problema");
    }

    isForbidden(msg) {
        return msg.includes("robux") || 
               msg.includes("comprar") || 
               msg.includes("vender") ||
               msg.includes("hack");
    }

    isOffTopic(msg) {
        return msg.includes("me ensina") || 
               msg.includes("python") || 
               msg.includes("javascript") ||
               msg.includes("java ");
    }

    /**
     * GERADOR DE RESPOSTAS INTELIGENTES
     */
    generateIntelligentResponse(type, message) {
        switch(type) {
            case this.QUESTION_TYPE.FRUSTRATION:
                return this.responseFrustration(message);

            case this.QUESTION_TYPE.DSL_CONCEPT:
                return this.responseDSLConcept(message);

            case this.QUESTION_TYPE.GREETING:
                return this.responseGreeting();

            case this.QUESTION_TYPE.IDENTITY:
                return this.responseIdentity();

            case this.QUESTION_TYPE.DSL_COMMAND:
                return this.responseDSLCommand(message);

            case this.QUESTION_TYPE.ERROR:
                return this.responseError();

            case this.QUESTION_TYPE.FORBIDDEN:
                return this.responseForbidden();

            case this.QUESTION_TYPE.OFF_TOPIC:
                return this.responseOffTopic();

            case this.QUESTION_TYPE.UNKNOWN:
                return this.responseUnknownProgressive();

            default:
                return this.responseUnknownProgressive();
        }
    }

    /**
     * RESPOSTA PARA FRUSTRAÇÃO
     */
    responseFrustration(message) {
        this.context.unknownCount = 0; // Reset contador

        return `Calma! 😅 Vamos resolver isso juntos.

Você quer entender:
• **O que é load** e como funciona?
• **Como usar comandos** (page, text, button)?
• **Por que está dando erro** no seu código?

Me diz uma dessas opções e eu te ajudo direto! 🚀`;
    }

    /**
     * RESPOSTA DIRETA PARA LOADS (prioridade!)
     */
    responseDSLConcept(message) {
        const msgLower = message.toLowerCase();

        if (msgLower.includes('load')) {
            return `**Load** é como você cria estilos reutilizáveis na DSL! 🎨

**Como funciona:**

\`\`\`dsl
# 1. Definir o load
load destaque :color("#FF0000"); size("24")

# 2. Usar o load
page inicio
text titulo ("Olá!", destaque)
end
\`\`\`

**Funções disponíveis:**
• \`color("#HEX")\` - Cor do texto
• \`size("24")\` - Tamanho
• \`font("Arial")\` - Fonte
• \`backcolor("#HEX")\` - Cor de fundo

É tipo um "preset" que você cria uma vez e usa várias vezes! 💪

Quer ver mais exemplos?`;
        }

        return this.responseUnknownProgressive();
    }

    /**
     * RESPOSTA PARA COMANDOS DSL
     */
    responseDSLCommand(message) {
        const msgLower = message.toLowerCase();

        // Detectar qual comando
        const commands = {
            'page': {
                title: '📄 Comando: page',
                example: `page inicio
title "Minha Página"
text msg ("Olá!")
end`,
                tip: 'Toda página começa com `page` e termina com `end`'
            },
            'text': {
                title: '📝 Comando: text',
                example: `text titulo ("Bem-vindo!", color("#FF6B35"))
text desc ("Meu site")`,
                tip: 'Adiciona texto. Pode usar loads para estilizar!'
            },
            'button': {
                title: '🔘 Comando: button',
                example: `button contato ("Fale Comigo" link "mailto:email@exemplo.com")
button proxima ("Próxima" page outraPagina)`,
                tip: 'Cria botões. Use `link` para URLs ou `page` para navegar'
            },
            'image': {
                title: '🖼️ Comando: image',
                example: `image logo ("https://exemplo.com/logo.png")`,
                tip: '⚠️ Máximo de 10 imagens por site!'
            },
            'divider': {
                title: '➖ Comando: divider',
                example: `text parte1 ("Primeira parte")
divider
text parte2 ("Segunda parte")`,
                tip: 'Cria uma linha horizontal'
            },
            'jump': {
                title: '⬇️ Comando: jump',
                example: `text titulo ("Título")
jump
text subtitulo ("Subtítulo")`,
                tip: 'Pula uma linha (espaçamento)'
            }
        };

        for (const [cmd, data] of Object.entries(commands)) {
            if (msgLower.includes(cmd)) {
                return `${data.title}

**Exemplo:**
\`\`\`dsl
${data.example}
\`\`\`

**Dica:** ${data.tip}

Quer ver outro comando?`;
            }
        }

        // Se mencionou comando mas não específico
        return `**Comandos disponíveis:**

• \`page\` - Criar páginas
• \`text\` - Adicionar texto
• \`button\` - Criar botão
• \`image\` - Adicionar imagem
• \`divider\` - Linha separadora
• \`jump\` - Pular linha

Qual você quer saber mais?`;
    }

    /**
     * FALLBACK PROGRESSIVO (anti-loop!)
     */
    responseUnknownProgressive() {
        this.context.unknownCount++;

        if (this.context.unknownCount === 1) {
            return `Não entendi direito. Você quer ajuda com:
• **DSL** (comandos como page, text, button)
• **Loads** (estilos reutilizáveis)
• **Erros** (quando algo não funciona)

Qual desses?`;
        }

        if (this.context.unknownCount === 2) {
            return `Ok, vamos tentar diferente! 🤔

Me diga **uma palavra**:
• \`page\`
• \`load\`
• \`text\`
• \`erro\`

Ou descreva seu problema de outro jeito!`;
        }

        // 3ª vez em diante
        return `Vamos devagar 🙂

**Copie e cole uma dessas frases:**

"Quero entender loads"
"Como usar page"
"Estou com erro"
"Me dá um exemplo"

Assim fica mais fácil te ajudar!`;
    }

    responseGreeting() {
        this.context.unknownCount = 0;
        return `Oi! 👋

Pode me perguntar sobre comandos, loads, ou qualquer coisa da DSL.`;
    }

    responseIdentity() {
        this.context.unknownCount = 0;
        return `Sou o assistente do Fire Server, criado pela **Sawi Fox Studios** para ajudar no uso da plataforma e da DSL.

Estou aqui pra te ajudar a criar sites incríveis! 🔥`;
    }

    responseError() {
        this.context.unknownCount = 0;
        return `**Erros comuns:**

1. **Falta \`end\`** → Toda página precisa terminar com \`end\`
2. **Aspas erradas** → Use sempre aspas duplas: \`"texto"\`
3. **Nome duplicado** → Cada elemento precisa de um ID único
4. **Muitas imagens** → Máximo de 10 por site
5. **Load não encontrado** → Verifique se você definiu o load antes

Me mostra o erro que você está tendo? Posso ajudar melhor! 🐛`;
    }

    responseForbidden() {
        this.context.unknownCount = 0;
        return `Não posso ajudar com isso.

Mas posso te ajudar a criar um site incrível no Fire Server! 🔥

Quer ver exemplos?`;
    }

    responseOffTopic() {
        this.context.unknownCount = 0;
        return `Não ensino outras linguagens aqui.

Meu foco é a DSL do Fire Server - uma linguagem própria e muito mais simples!

Quer ver como funciona?`;
    }

    /**
     * Adiciona mensagem ao chat
     */
    addMessage(sender, text) {
        const chatMessages = document.getElementById('aiMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        messageDiv.innerHTML = this.processMarkdown(text);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        this.chatHistory.push({ sender, text, timestamp: Date.now() });
    }

    processMarkdown(text) {
        text = text.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
            return `<div class="code-block">
                <div class="code-lang">${lang || 'code'}</div>
                <pre><code>${this.escapeHtml(code.trim())}</code></pre>
            </div>`;
        });

        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\n/g, '<br>');

        return text;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearHistory() {
        this.chatHistory = [];
        this.context = {
            lastQuestion: null,
            lastResponse: null,
            unknownCount: 0,
            lastTopics: []
        };
        
        const chatMessages = document.getElementById('aiMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            this.addMessage('ai', this.getWelcomeMessage());
        }
    }
}

// Inicializar
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aiAssistant = new AIAssistant();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAssistant;
}
