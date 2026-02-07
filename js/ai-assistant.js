/**
 * Fire Server AI Assistant v2.0
 * Sistema inteligente baseado em intenções (não keywords secas)
 */

class AIAssistant {
    constructor() {
        this.chatHistory = [];
        this.context = this.buildContext();
        this.knowledgeBase = this.buildKnowledgeBase();
        this.init();
    }

    /**
     * 🧩 CAMADA 1 — Contexto fixo do projeto
     */
    buildContext() {
        return {
            project: "Fire Server DSL",
            languageUsed: "DSL própria (não Python, JavaScript, etc)",
            forbidden: ["javascript do usuário", "html cru", "código malicioso"],
            allowedHelp: ["conceitos", "exemplos", "código educacional de outras linguagens"],
            maxLimits: {
                lines: 200,
                elements: 100,
                images: 10,
                chars: 10000
            }
        };
    }

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

        // Mensagem inicial
        this.addMessage('ai', '👋 Olá! Sou seu assistente do Fire Server.\n\nPosso te ajudar com:\n• 📝 Como usar a DSL\n• 🐛 Entender erros\n• 💡 Ensinar programação (Python, JS, etc)\n• 🎨 Dar exemplos\n\nComo posso ajudar?');
    }

    /**
     * 🧩 CAMADA 2 — Classificação de intenção
     * O que o usuário está TENTANDO fazer?
     */
    classifyIntent(msg) {
        const msgLower = msg.toLowerCase().trim();

        // Intenção: Aprender uma linguagem de programação
        if (this.matchesPattern(msgLower, [
            'me ensina', 'como aprender', 'quero aprender', 'ensinar',
            'tutorial', 'aprender python', 'aprender javascript', 'aprender java'
        ])) {
            return { type: 'learn_language', language: this.detectLanguage(msg) };
        }

        // Intenção: Pedir código pronto
        if (this.matchesPattern(msgLower, [
            'cria um codigo', 'me da um codigo', 'gera codigo', 'faz um site',
            'cria um site', 'codigo pronto', 'faz pra mim', 'copiar codigo'
        ])) {
            return { type: 'request_code', specifics: msg };
        }

        // Intenção: Ajuda com DSL do Fire Server
        if (this.matchesPattern(msgLower, [
            'page', 'text', 'button', 'image', 'divider', 'jump', 'title',
            'como criar', 'como fazer', 'dsl', 'fire server', 'load', 'color', 'font'
        ])) {
            return { type: 'dsl_help', command: this.detectDSLCommand(msg) };
        }

        // Intenção: Confusão ou não entendeu algo
        if (this.matchesPattern(msgLower, [
            'nao entendi', 'não entendi', 'confuso', 'o que é', 'explica',
            'não sei', 'nao sei', 'como assim', 'por que', 'porque'
        ])) {
            return { type: 'confusion', topic: msg };
        }

        // Intenção: Erro ou problema
        if (this.matchesPattern(msgLower, [
            'erro', 'error', 'bug', 'não funciona', 'nao funciona',
            'problema', 'deu errado', 'ajuda'
        ])) {
            return { type: 'error_help', context: msg };
        }

        // Padrão: Off-topic ou cumprimento
        if (this.matchesPattern(msgLower, ['oi', 'olá', 'ola', 'hey', 'bom dia', 'boa tarde'])) {
            return { type: 'greeting' };
        }

        return { type: 'off_topic', message: msg };
    }

    /**
     * Helper: Verifica se mensagem contém algum padrão
     */
    matchesPattern(msg, patterns) {
        return patterns.some(pattern => msg.includes(pattern));
    }

    /**
     * Helper: Detecta linguagem mencionada
     */
    detectLanguage(msg) {
        const msgLower = msg.toLowerCase();
        if (msgLower.includes('python')) return 'Python';
        if (msgLower.includes('javascript') || msgLower.includes('js')) return 'JavaScript';
        if (msgLower.includes('java')) return 'Java';
        if (msgLower.includes('c++')) return 'C++';
        if (msgLower.includes('html')) return 'HTML';
        if (msgLower.includes('css')) return 'CSS';
        return null;
    }

    /**
     * Helper: Detecta comando DSL mencionado
     */
    detectDSLCommand(msg) {
        const msgLower = msg.toLowerCase();
        const commands = ['page', 'text', 'button', 'image', 'divider', 'jump', 'title', 'load', 'color', 'font', 'size', 'end'];
        return commands.find(cmd => msgLower.includes(cmd)) || null;
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

        // Classificar intenção
        const intent = this.classifyIntent(message);

        // Gerar resposta baseada na intenção
        const response = this.generateResponse(intent, message);

        // Adicionar resposta da IA
        setTimeout(() => {
            this.addMessage('ai', response);
        }, 500);
    }

    /**
     * Gera resposta baseada na intenção do usuário
     */
    generateResponse(intent, originalMessage) {
        switch (intent.type) {
            case 'learn_language':
                return this.responseLearnLanguage(intent.language);

            case 'request_code':
                return this.responseRequestCode(intent.specifics);

            case 'dsl_help':
                return this.responseDSLHelp(intent.command);

            case 'confusion':
                return this.responseConfusion(intent.topic);

            case 'error_help':
                return this.responseErrorHelp(intent.context);

            case 'greeting':
                return this.responseGreeting();

            case 'off_topic':
                return this.responseOffTopic(intent.message);

            default:
                return 'Desculpe, não entendi. Pode reformular?';
        }
    }

    /**
     * 🟢 RESPOSTA: Ensinar linguagem
     */
    responseLearnLanguage(language) {
        if (!language) {
            return `Qual linguagem você quer aprender? 🤔

Posso te ensinar:
• Python 🐍
• JavaScript 💛
• Java ☕
• HTML & CSS 🎨
• E muito mais!

É só me dizer qual!`;
        }

        // Resposta específica por linguagem
        const teachings = {
            'Python': {
                intro: `Olha, aqui no Fire Server a gente não usa Python — usamos uma **DSL própria** 🙂

Mas posso te ensinar Python sim! Python é uma linguagem simples e muito usada pra automação, bots e jogos.`,
                code: `# Exemplo básico de Python
print("Olá, mundo!")

# Variáveis
nome = "João"
idade = 15
print(f"Meu nome é {nome} e tenho {idade} anos")

# Função
def somar(a, b):
    return a + b

resultado = somar(5, 3)
print(f"5 + 3 = {resultado}")`,
                explanation: `**O que esse código faz:**
• \`print()\` exibe texto na tela
• Variáveis guardam informações
• Funções são blocos de código reutilizáveis
• \`f"..."\` permite inserir variáveis no texto`
            },
            'JavaScript': {
                intro: `Aqui no Fire Server não usamos JavaScript do usuário — só nossa **DSL** 🙂

Mas posso te ensinar JavaScript! É a linguagem da web, usada em sites, apps e jogos.`,
                code: `// Exemplo básico de JavaScript
console.log("Olá, mundo!");

// Variáveis
let nome = "Maria";
let idade = 16;
console.log(\`Meu nome é \${nome} e tenho \${idade} anos\`);

// Função
function somar(a, b) {
    return a + b;
}

let resultado = somar(10, 5);
console.log(\`10 + 5 = \${resultado}\`);`,
                explanation: `**O que esse código faz:**
• \`console.log()\` exibe no console do navegador
• \`let\` declara variáveis
• Funções são criadas com \`function\`
• Template strings usam \`\${}\` para inserir variáveis`
            }
        };

        const teaching = teachings[language];
        if (teaching) {
            return `${teaching.intro}

**Exemplo básico:**
\`\`\`${language.toLowerCase()}
${teaching.code}
\`\`\`

${teaching.explanation}

Quer aprender mais? Posso te explicar loops, condicionais, arrays e muito mais! 🚀`;
        }

        return `Posso te ensinar ${language} sim! 🎓

Mas é bom saber: aqui no Fire Server usamos uma DSL própria (mais simples que ${language}).

Quer que eu te mostre exemplos de ${language} ou prefere aprender nossa DSL primeiro?`;
    }

    /**
     * 🟢 RESPOSTA: Código pronto
     */
    responseRequestCode(specifics) {
        return `Entendo que você quer um código pronto! 💻

**Como funciona aqui:**
Eu não crio o código *por você*, mas posso te **ensinar** e dar **exemplos** que você adapta.

**Exemplo: Site pessoal básico**
\`\`\`dsl
page inicial
title "Meu Site"

text bemvindo ("Olá! Bem-vindo ao meu site 👋")
jump

text sobre ("Sou desenvolvedor e adoro programar!")

button contato ("Entre em Contato" link "mailto:seu@email.com")

divider

text rodape ("Feito com 🔥 Fire Server")
end
\`\`\`

**Copie esse código** e personalize:
• Mude os textos
• Adicione mais páginas
• Coloque suas informações

Quer que eu explique alguma parte específica? 🎯`;
    }

    /**
     * 🟢 RESPOSTA: Ajuda com DSL
     */
    responseDSLHelp(command) {
        const dslHelp = {
            'page': {
                title: '📄 Comando: page',
                syntax: 'page nomeDaPagina',
                example: `page inicial
title "Minha Primeira Página"
text msg ("Olá!")
end`,
                explanation: 'Toda página começa com `page` e termina com `end`. O nome deve ser único!'
            },
            'text': {
                title: '📝 Comando: text',
                syntax: 'text id ("texto", [loads])',
                example: `text titulo ("Bem-vindo!", color("#FF6B35"); size("24"))
text descricao ("Este é meu site")`,
                explanation: 'Adiciona texto ao site. Você pode estilizar com `color()`, `size()`, `font()`'
            },
            'button': {
                title: '🔘 Comando: button',
                syntax: 'button id ("texto" link "url")',
                example: `button email ("Email" link "mailto:seu@email.com")
button github ("GitHub" link "https://github.com")
button proxima ("Próxima" page outraPagina)`,
                explanation: 'Cria botões clicáveis. Use `link` para URLs ou `page` para navegar entre páginas'
            },
            'image': {
                title: '🖼️ Comando: image',
                syntax: 'image id ("url")',
                example: `image logo ("https://exemplo.com/logo.png")`,
                explanation: '⚠️ Máximo de 10 imagens por site! Use URLs públicas (https://)'
            },
            'divider': {
                title: '➖ Comando: divider',
                syntax: 'divider',
                example: `text parte1 ("Primeira parte")
divider
text parte2 ("Segunda parte")`,
                explanation: 'Cria uma linha horizontal separadora'
            },
            'jump': {
                title: '⬇️ Comando: jump',
                syntax: 'jump',
                example: `text titulo ("Título")
jump
text subtitulo ("Subtítulo")`,
                explanation: 'Pula uma linha, adicionando espaço vertical'
            }
        };

        const help = dslHelp[command] || dslHelp['page'];

        return `${help.title}

**Sintaxe:**
\`${help.syntax}\`

**Exemplo:**
\`\`\`dsl
${help.example}
\`\`\`

**Explicação:**
${help.explanation}

Quer ver mais exemplos ou aprender outro comando? 🚀`;
    }

    /**
     * 🟢 RESPOSTA: Confusão
     */
    responseConfusion(topic) {
        return `Entendo que pode estar confuso! 🤔

Vamos simplificar:

**O Fire Server é uma ferramenta para criar sites simples**
Você escreve em uma linguagem especial (DSL) e ele transforma em um site bonito.

**Exemplo super simples:**
\`\`\`dsl
page inicio
title "Meu Site"
text msg ("Olá!")
end
\`\`\`

Esse código cria uma página com um texto "Olá!".

**Ficou mais claro?** Me diga o que ainda não entendeu que eu explico melhor! 💡`;
    }

    /**
     * 🟢 RESPOSTA: Erro
     */
    responseErrorHelp(context) {
        return `Vejo que você está com um problema! 🐛

**Erros mais comuns:**

1️⃣ **Aspas não fechadas**
❌ \`text t (Olá)\`
✅ \`text t ("Olá")\`

2️⃣ **Esqueceu o "end"**
❌ \`page inicio\ntext t ("hi")\`
✅ \`page inicio\ntext t ("hi")\nend\`

3️⃣ **Nome duplicado**
❌ \`text t ("A")\ntext t ("B")\`
✅ \`text t1 ("A")\ntext t2 ("B")\`

**Qual erro você está tendo?** Cole a mensagem de erro aqui que eu te ajudo! 🔍`;
    }

    /**
     * 🟢 RESPOSTA: Cumprimento
     */
    responseGreeting() {
        return `Olá! 👋 Como posso te ajudar hoje?

Posso:
• 📝 Te ensinar a usar a DSL
• 🐛 Ajudar com erros
• 💡 Ensinar programação
• 🎨 Dar exemplos de sites

É só me dizer o que precisa! 😊`;
    }

    /**
     * 🟢 RESPOSTA: Fora do tópico
     */
    responseOffTopic(message) {
        return `Hmm, não tenho certeza como te ajudar com isso... 🤔

Sou especialista em:
• 🔥 Fire Server e sua DSL
• 💻 Programação (Python, JavaScript, etc)
• 🎨 Criação de sites

Quer conversar sobre algum desses temas? Ou tem alguma dúvida sobre o Fire Server?`;
    }

    /**
     * Base de conhecimento (mantida para busca direta)
     */
    buildKnowledgeBase() {
        return {
            limits: `⚠️ **Limites do Fire Server:**

• Máximo de 200 linhas de código
• Máximo de 100 elementos renderizados
• Máximo de 10 imagens por site
• Máximo de 10.000 caracteres

Se ultrapassar, simplifique seu site ou divida em mais páginas!`,

            examples: `🎨 **Exemplos de sites:**

**1. Site Pessoal:**
\`\`\`dsl
page inicial
title "João Silva"
text intro ("Desenvolvedor Web 💻")
button github ("GitHub" link "https://github.com/joao")
end
\`\`\`

**2. Links Bio:**
\`\`\`dsl
page links
title "Meus Links"
text nome ("@meuuser")
button insta ("Instagram" link "https://instagram.com/...")
button twitter ("Twitter" link "https://twitter.com/...")
end
\`\`\``
        };
    }

    /**
     * Adiciona mensagem ao chat
     */
    addMessage(type, message) {
        const chatContainer = document.getElementById('aiChat');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;

        // Processar markdown simples e blocos de código
        const processedMessage = this.processMessage(message);
        messageDiv.innerHTML = processedMessage;

        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        this.chatHistory.push({ type, message, timestamp: Date.now() });
    }

    /**
     * Processa mensagem (markdown e código)
     */
    processMessage(message) {
        // Processar blocos de código com botão copiar
        message = message.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const codeId = 'code-' + Date.now() + Math.random();
            return `<div class="code-block">
                ${lang ? `<div class="code-lang">${lang}</div>` : ''}
                <pre><code id="${codeId}">${this.escapeHtml(code.trim())}</code></pre>
                <button class="copy-code-btn" onclick="window.aiAssistant.copyCode('${codeId}')">📋 Copiar</button>
            </div>`;
        });

        // Processar código inline
        message = message.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // Processar negrito
        message = message.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Processar quebras de linha
        message = message.replace(/\n/g, '<br>');

        return message;
    }

    /**
     * Copia código para clipboard
     */
    copyCode(codeId) {
        const codeElement = document.getElementById(codeId);
        if (codeElement) {
            navigator.clipboard.writeText(codeElement.textContent);
            // Feedback visual
            const btns = document.querySelectorAll('.copy-code-btn');
            btns.forEach(btn => {
                if (btn.onclick.toString().includes(codeId)) {
                    const originalText = btn.textContent;
                    btn.textContent = '✅ Copiado!';
                    setTimeout(() => {
                        btn.textContent = originalText;
                    }, 2000);
                }
            });
        }
    }

    /**
     * Escapa HTML para segurança
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Instância global (necessária para o botão de copiar)
let aiAssistant;
