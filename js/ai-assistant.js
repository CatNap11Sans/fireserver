/**
 * Fire Server AI Assistant
 * Assistente simples baseado em regras para ajudar com erros da DSL
 */

class AIAssistant {
    constructor() {
        this.chatHistory = [];
        this.knowledgeBase = this.buildKnowledgeBase();
        this.init();
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
        this.addMessage('ai', 'Olá! 👋 Sou seu assistente do Fire Server. Como posso ajudar?');
    }

    /**
     * Base de conhecimento com respostas
     */
    buildKnowledgeBase() {
        return {
            // Comandos básicos
            'page': {
                keywords: ['page', 'página', 'criar página'],
                response: 'Para criar uma página, use:\n\npage nomeDaPagina\ntitle "Título"\ntext texto1 ("Conteúdo")\nend\n\nCada página deve começar com "page" e terminar com "end".'
            },
            'text': {
                keywords: ['text', 'texto', 'adicionar texto'],
                response: 'Para adicionar texto, use:\n\ntext nomeDoTexto ("Seu texto aqui")\n\nVocê pode adicionar estilos:\ntext nomeDoTexto ("Texto", color("#FF0000"); size("20"))'
            },
            'image': {
                keywords: ['image', 'imagem', 'foto'],
                response: 'Para adicionar uma imagem, use:\n\nimage minhaImagem ("https://exemplo.com/foto.jpg")\n\nLembre-se: máximo de 10 imagens por site!'
            },
            'button': {
                keywords: ['button', 'botão', 'link'],
                response: 'Para criar um botão, use:\n\nbutton meuBotao ("Texto do Botão" link "https://exemplo.com")\n\nOu para navegar entre páginas:\nbutton irParaPagina ("Ir" page outraPagina)'
            },
            'color': {
                keywords: ['color', 'cor', 'mudar cor'],
                response: 'Para mudar a cor do texto:\n\ntext meuTexto ("Texto", color("#FF6B35"))\n\nUse cores em hexadecimal (#000000 a #FFFFFF) ou nomes em inglês (red, blue, green).'
            },
            'size': {
                keywords: ['size', 'tamanho', 'fonte'],
                response: 'Para mudar o tamanho da fonte:\n\ntext meuTexto ("Texto", size("24"))\n\nO tamanho é em pixels. Valores comuns: 12-72.'
            },
            'divider': {
                keywords: ['divider', 'divisor', 'linha'],
                response: 'Para adicionar uma linha separadora:\n\ndivider\n\nIsso cria uma linha horizontal entre elementos.'
            },
            'jump': {
                keywords: ['jump', 'pular', 'espaço'],
                response: 'Para adicionar um espaço vertical:\n\njump\n\nIsso pula uma linha entre elementos.'
            },
            'end': {
                keywords: ['end', 'fim', 'fechar'],
                response: 'Toda página deve terminar com "end":\n\npage minhaPage\n  ... conteúdo ...\nend\n\nSem o "end", você receberá um erro!'
            },
            'comment': {
                keywords: ['comment', 'comentário', '#'],
                response: 'Para adicionar comentários (notas que não aparecem):\n\n# Este é um comentário\n# Comentários não contam no limite de linhas!'
            },

            // Erros comuns
            'aspas': {
                keywords: ['aspas', 'quotes', 'syntax error'],
                response: '❌ Erro de aspas!\n\nTodo texto deve estar entre aspas:\n✅ Correto: text t ("Olá")\n❌ Errado: text t (Olá)\n\nCertifique-se de fechar todas as aspas!'
            },
            'duplicado': {
                keywords: ['duplicado', 'duplicate', 'nome já existe'],
                response: '❌ Nome duplicado!\n\nCada elemento deve ter um nome único:\n✅ Correto: text texto1, text texto2\n❌ Errado: text texto1, text texto1\n\nMude o nome de um dos elementos.'
            },
            'limite': {
                keywords: ['limite', 'limit', 'excedido', 'máximo'],
                response: '⚠️ Limites do Fire Server:\n\n• Máx. 200 linhas de código\n• Máx. 100 elementos\n• Máx. 10 imagens\n• Máx. 10.000 caracteres\n\nTente simplificar seu site!'
            },
            'url': {
                keywords: ['url', 'link inválido', 'https'],
                response: '🔗 URLs devem começar com http:// ou https://\n\n✅ Correto: "https://exemplo.com"\n❌ Errado: "exemplo.com"\n\nPara emails, use: "mailto:seu@email.com"'
            },

            // Ajuda geral
            'exemplo': {
                keywords: ['exemplo', 'example', 'como começar'],
                response: '📝 Exemplo completo:\n\npage inicial\ntitle "Meu Site"\n\ntext bemvindo ("Bem-vindo! 👋")\njump\n\nimage logo ("https://exemplo.com/logo.png")\njump\n\nbutton contato ("Contato" link "mailto:eu@email.com")\n\nend'
            },
            'animacao': {
                keywords: ['animação', 'animation', 'movimento'],
                response: '✨ Para adicionar animação:\n\ntext animado ("Texto", animation("fadeIn"))\n\nA animação faz o elemento aparecer suavemente!'
            },
            'backcolor': {
                keywords: ['backcolor', 'fundo', 'background'],
                response: '🎨 Para mudar cor de fundo:\n\nPara elemento:\ntext t ("Texto", backcolor("#FF6B35"))\n\nPara página inteira (logo após "page"):\npage inicio\nsite backcolor("#F0F0F0")\n\nend'
            }
        };
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

        // Gerar resposta
        const response = this.generateResponse(message);
        
        // Adicionar resposta da IA com delay
        setTimeout(() => {
            this.addMessage('ai', response);
        }, 500);
    }

    /**
     * Gera resposta baseada em regras
     */
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Buscar na base de conhecimento
        for (const [key, value] of Object.entries(this.knowledgeBase)) {
            for (const keyword of value.keywords) {
                if (lowerMessage.includes(keyword)) {
                    return value.response;
                }
            }
        }

        // Respostas para perguntas comuns
        if (lowerMessage.includes('como') && lowerMessage.includes('funciona')) {
            return 'O Fire Server usa uma linguagem simples (DSL) para criar sites!\n\n1. Escreva "page" para criar uma página\n2. Adicione elementos (text, image, button)\n3. Feche com "end"\n4. Clique em "Publicar"!\n\nDigite "exemplo" para ver um exemplo completo.';
        }

        if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
            return 'Posso ajudar com:\n\n📄 Comandos: page, text, image, button, divider, jump\n🎨 Estilos: color, size, font, backcolor, animation\n❌ Erros: aspas, nomes duplicados, limites\n\nDigite um comando para saber mais, ou "exemplo" para ver um site completo!';
        }

        if (lowerMessage.includes('erro') || lowerMessage.includes('error')) {
            return 'Para ajudar com erros, preciso saber qual:\n\n• Erro de aspas?\n• Nome duplicado?\n• Limite excedido?\n• URL inválida?\n\nMe conte mais sobre o erro que está vendo!';
        }

        // Resposta padrão
        return 'Hmm, não tenho certeza sobre isso! 🤔\n\nTente perguntar sobre:\n• Comandos (page, text, image, button)\n• Estilos (color, size, animation)\n• Erros que está enfrentando\n• Digite "exemplo" para ver um exemplo\n\nOu digite "ajuda" para ver tudo que posso fazer!';
    }

    /**
     * Adiciona mensagem ao chat
     */
    addMessage(type, text) {
        const chatContainer = document.getElementById('aiChat');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.whiteSpace = 'pre-line'; // Preservar quebras de linha

        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        this.chatHistory.push({ type, text });
    }

    /**
     * Analisa código e sugere melhorias
     */
    analyzeCode(code, errors) {
        if (errors.length === 0) {
            return '✅ Seu código está ótimo! Sem erros detectados.';
        }

        let suggestions = '🔍 Análise do código:\n\n';
        
        errors.forEach((error, index) => {
            suggestions += `${index + 1}. Linha ${error.line}: ${error.message}\n`;
            if (error.suggestion) {
                suggestions += `   💡 ${error.suggestion}\n`;
            }
            suggestions += '\n';
        });

        return suggestions;
    }
}

// Inicializar quando página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new AIAssistant();
});
