/**
 * Fire Assistant - Versão DEFINITIVA
 * ASSUME e RESPONDE - não pergunta
 * Com estado conversacional e memória
 */

class AIAssistant {
    constructor() {
        this.identity = {
            name: "Fire Assistant",
            creator: "Sawi Fox Studios"
        };

        // ESTADO CONVERSACIONAL (a chave de tudo!)
        this.conversationState = {
            lastQuestion: null,
            expectedAnswers: null,
            topic: null,
            waitingForAnswer: false
        };

        // Banco de intenções
        this.intents = {
            background_color: {
                keywords: ["background", "backgroud", "fundo", "cor do fundo", "backcolor", "bg", "back color"],
                responses: [
                    "Boa pergunta! Pra mudar a cor do fundo você usa `backcolor` na page.",
                    "Dá sim 😄 A cor do fundo é controlada com `backcolor` dentro da page.",
                    "Isso é tranquilo! Usa `backcolor` pra definir a cor do fundo do site."
                ],
                example: `page inicio
backcolor("#0f111a")
text titulo ("Meu site")
end`,
                tip: "Dica: use cores hexadecimais tipo #0f111a ou #ffffff"
            },
            load_concept: {
                keywords: ["load", "loads", "estilo", "preset", "reutilizar"],
                responses: [
                    "Ahh, loads! São tipo presets de estilo que você cria uma vez e usa várias vezes.",
                    "Load é basicamente um atalho pra não ficar repetindo as mesmas cores e tamanhos.",
                    "Boa! Load é como você cria estilos reutilizáveis - super útil."
                ],
                example: `# Criar o load
load destaque :color("#FF0000"); size("24")

# Usar o load
page inicio
text titulo ("Olá!", destaque)
end`,
                tip: "Dica: crie loads pros estilos que você mais usa"
            },
            page_command: {
                keywords: ["page", "pagina", "página", "criar pagina"],
                responses: [
                    "Beleza! Toda página começa com `page nome` e termina com `end`.",
                    "Página é fácil - começa com `page` e fecha com `end`.",
                    "Tranquilo! Use `page` pra criar e não esqueça do `end` no final."
                ],
                example: `page inicio
title "Meu Site"
text msg ("Olá mundo!")
end`,
                tip: "Dica: o nome da página não pode ter espaços"
            },
            text_command: {
                keywords: ["text", "texto", "escrever", "adicionar texto"],
                responses: [
                    "Pra adicionar texto é só usar `text` com o conteúdo entre aspas.",
                    "Texto é simples - `text id (\"seu texto aqui\")`",
                    "Tranquilo! Use `text` e coloque o conteúdo entre aspas duplas."
                ],
                example: `text titulo ("Bem-vindo!", color("#FF6B35"))
text descricao ("Meu site incrível")`,
                tip: "Dica: você pode aplicar loads ou funções direto no text"
            },
            button_command: {
                keywords: ["button", "botao", "botão", "link", "clique"],
                responses: [
                    "Botão é assim: `button id (\"texto\" link \"url\")`",
                    "Pra fazer botão use `button` com o texto e o link.",
                    "Beleza! Botão funciona com `button` + texto + link ou page."
                ],
                example: `button contato ("Fale Comigo" link "mailto:email@exemplo.com")
button proxima ("Próxima" page outraPagina)`,
                tip: "Dica: use `link` pra URLs ou `page` pra navegar entre páginas"
            },
            error_help: {
                keywords: ["erro", "bug", "não funciona", "nao funciona", "problema", "deu errado"],
                responses: [
                    "Erros mais comuns são: falta de `end`, aspas erradas ou nome duplicado.",
                    "Provavelmente é falta de `end` na página ou aspas simples em vez de duplas.",
                    "Os erros principais são: página sem `end`, ID repetido ou aspas erradas."
                ],
                example: `# ❌ Errado
page inicio
text msg ('oi')

# ✅ Certo
page inicio
text msg ("oi")
end`,
                tip: "Dica: sempre use aspas duplas \" e feche a página com end"
            }
        };

        // Mapeamento de respostas humanas
        this.humanResponses = {
            confirmation: ["sim", "ok", "claro", "pode", "isso", "aham", "uhum", "yes", "quero", "beleza"],
            negation: ["não", "nao", "nop", "negativo", "nem", "nunca"],
            choices: {
                "primeiro": 1, "primeira": 1, "1": 1,
                "segundo": 2, "segunda": 2, "2": 2,
                "terceiro": 3, "terceira": 3, "3": 3,
                "último": 4, "ultima": 4, "ultimo": 4, "4": 4
            },
            uncertainty: ["talvez", "acho", "não sei", "n sei", "nao sei"]
        };

        this.chatHistory = [];
        this.repeatCount = 0;
        this.lastResponse = null;
        
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

        this.addMessage('ai', 'Oi! 👋 Pode me perguntar sobre comandos, loads ou qualquer coisa da DSL.');
    }

    handleUserMessage() {
        const input = document.getElementById('aiInput');
        const message = input.value.trim();

        if (!message) return;

        this.addMessage('user', message);
        input.value = '';

        const response = this.processMessage(message);
        
        setTimeout(() => {
            this.addMessage('ai', response);
        }, 500);
    }

    /**
     * PROCESSAMENTO PRINCIPAL
     * 1. Verifica se está esperando resposta
     * 2. Detecta intenção por palavra-chave
     * 3. Responde diretamente
     */
    processMessage(message) {
        const msgLower = message.toLowerCase().trim();

        // 1️⃣ PRIORIDADE: Está esperando resposta?
        if (this.conversationState.waitingForAnswer) {
            return this.handleExpectedAnswer(msgLower);
        }

        // 2️⃣ Detectar desrespeito (mas não resetar)
        if (this.isDisrespectful(msgLower)) {
            return this.handleDisrespect();
        }

        // 3️⃣ Cumprimento
        if (this.isGreeting(msgLower)) {
            return this.randomPick([
                "Oi! 👋 O que você quer fazer no Fire Server?",
                "Olá! Me diz o que você precisa e eu te ajudo.",
                "E aí! Quer criar o quê?"
            ]);
        }

        // 4️⃣ Identidade
        if (this.isIdentity(msgLower)) {
            return "Sou o assistente do Fire Server, criado pela Sawi Fox Studios pra te ajudar com a DSL.\n\nQual sua dúvida?";
        }

        // 5️⃣ ASSUME E RESPONDE - Detecta palavra-chave e responde direto
        for (const [intentName, intent] of Object.entries(this.intents)) {
            if (intent.keywords.some(kw => msgLower.includes(kw))) {
                return this.respondDirectly(intent);
            }
        }

        // 6️⃣ Fallback progressivo
        return this.handleUnknown(msgLower);
    }

    /**
     * RESPONDE DIRETAMENTE (sem perguntar)
     */
    respondDirectly(intent) {
        this.repeatCount = 0; // Reset contador
        
        const response = this.randomPick(intent.responses);
        const example = intent.example;
        const tip = intent.tip;

        let fullResponse = response + "\n\n**Exemplo:**\n```dsl\n" + example + "\n```";
        
        if (tip) {
            fullResponse += "\n\n" + tip;
        }

        // Oferece ajuda adicional SEM perguntar diretamente
        fullResponse += " 😉";

        return fullResponse;
    }

    /**
     * LIDA COM RESPOSTA ESPERADA
     */
    handleExpectedAnswer(msgLower) {
        const state = this.conversationState;

        // Confirmação
        if (this.humanResponses.confirmation.some(c => msgLower === c)) {
            if (state.topic === "show_another_command") {
                this.conversationState.waitingForAnswer = false;
                return "Beleza 😄 Qual comando você quer ver? Pode ser `page`, `text`, `button`, `image`, `load` ou `divider`.";
            }
        }

        // Negação
        if (this.humanResponses.negation.some(n => msgLower === n)) {
            this.conversationState.waitingForAnswer = false;
            return "Tranquilo! Se precisar de algo, é só chamar 👍";
        }

        // Escolhas (primeiro, segundo, terceiro)
        for (const [word, number] of Object.entries(this.humanResponses.choices)) {
            if (msgLower.includes(word)) {
                return this.handleChoice(number);
            }
        }

        // Se não entendeu a resposta, clarifica
        this.conversationState.waitingForAnswer = false;
        return "Não peguei 😅 Pode falar qual comando você quer saber ou me dá mais detalhes?";
    }

    /**
     * LIDA COM ESCOLHAS (primeiro, segundo, terceiro)
     */
    handleChoice(number) {
        this.conversationState.waitingForAnswer = false;

        const options = this.conversationState.expectedAnswers;
        if (options && options[number]) {
            const choice = options[number];
            
            if (choice === "DSL") {
                return "Beleza! DSL é a linguagem do Fire Server. Comandos principais: `page`, `text`, `button`, `image`.\n\nQual você quer saber?";
            }
            if (choice === "Loads") {
                return this.respondDirectly(this.intents.load_concept);
            }
            if (choice === "Erros") {
                return this.respondDirectly(this.intents.error_help);
            }
        }

        return "Entendi! Me diz com mais detalhes o que você precisa 😊";
    }

    /**
     * FALLBACK PROGRESSIVO (anti-loop)
     */
    handleUnknown(msgLower) {
        this.repeatCount++;

        // Primeira vez
        if (this.repeatCount === 1) {
            this.ask("Você quer ajuda com:", {
                1: "DSL",
                2: "Loads", 
                3: "Erros"
            }, "help_category");
            
            return "Não entendi direito. Você quer ajuda com:\n• **DSL** (comandos)\n• **Loads** (estilos)\n• **Erros** (bugs)\n\nÉ sobre qual?";
        }

        // Segunda vez
        if (this.repeatCount === 2) {
            return "Hmm 🤔 Tenta me dizer com outras palavras, ou escreve uma palavra tipo `page`, `load`, `text` ou `erro`.";
        }

        // Terceira vez
        if (this.repeatCount === 3) {
            return "Vamos tentar assim: cola aqui o código que você tá fazendo, ou me diz **exatamente** o que você quer criar.";
        }

        // Quarta vez (zoação detectada)
        this.repeatCount = 0;
        return "Acho que você tá zoando 😅 Mas se quiser ajuda de verdade, tô aqui!";
    }

    /**
     * DETECTORES
     */
    isDisrespectful(msg) {
        const badWords = ["gay", "burro", "idiota", "merda"];
        return badWords.some(w => msg.includes(w));
    }

    handleDisrespect() {
        return "Bora manter o respeito 👍 Se quiser ajuda de verdade, me diz o que você quer mudar no site.";
    }

    isGreeting(msg) {
        const greetings = ["oi", "ola", "olá", "eai", "hey"];
        return greetings.some(g => msg === g || msg === g + "!");
    }

    isIdentity(msg) {
        return msg.includes("quem é você") || 
               msg.includes("quem criou") ||
               msg.includes("o que você é");
    }

    /**
     * REGISTRA PERGUNTA (cria expectativa de resposta)
     */
    ask(question, expectedAnswers, topic) {
        this.conversationState = {
            lastQuestion: question,
            expectedAnswers: expectedAnswers,
            topic: topic,
            waitingForAnswer: true
        };
    }

    /**
     * ESCOLHE RESPOSTA ALEATÓRIA (parece mais humano)
     */
    randomPick(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * ADICIONA MENSAGEM
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
        
        if (sender === 'ai') {
            this.lastResponse = text;
        }
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
        this.conversationState = {
            lastQuestion: null,
            expectedAnswers: null,
            topic: null,
            waitingForAnswer: false
        };
        this.repeatCount = 0;
        
        const chatMessages = document.getElementById('aiMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            this.addMessage('ai', 'Oi! 👋 Pode me perguntar sobre comandos, loads ou qualquer coisa da DSL.');
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
