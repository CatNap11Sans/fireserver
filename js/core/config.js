// Fire Server - Configuração Central
const FireConfig = {
    // Limites do sistema
    limits: {
        maxDSLLines: 200,
        maxElements: 100,
        maxImages: 10,
        maxTextLength: 10000,
        maxScriptInstructions: 100000,
        maxRecursionDepth: 100
    },

    // Validação de username
    usernameRegex: /^(?!.*([_-])\1)[a-z](?:[a-z0-9_-]{1,18}[a-z0-9])$/,

    // Mensagens de erro
    errors: {
        maxLines: '🔴 Limite excedido: máximo de 200 linhas de código',
        maxElements: '🔴 Limite excedido: máximo de 100 elementos renderizados',
        maxImages: '🔴 Limite excedido: máximo de 10 imagens por site',
        maxText: '🔴 Limite excedido: máximo de 10.000 caracteres de texto',
        invalidUsername: '🔴 Username inválido. Use apenas minúsculas, números, - e _',
        invalidURL: '🔴 URL inválida. Use HTTPS para links externos',
        invalidCommand: '🔴 Comando desconhecido',
        missingQuotes: '🔴 Aspas não fechadas',
        missingArgs: '🔴 Argumentos faltando',
        tooManyArgs: '🔴 Argumentos demais',
        pageNotFound: '🔴 Página não encontrada',
        scriptError: '🔴 Erro no script Lua'
    },

    // Configurações do Monaco Editor
    monaco: {
        theme: 'vs-dark',
        fontSize: 14,
        lineNumbers: 'on',
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on'
    },

    // Cores do tema
    colors: {
        primary: '#ff6b35',
        secondary: '#f7931e',
        dark: '#1a1a2e',
        light: '#f5f5f5',
        accent: '#16213e',
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    },

    // Ícones dos componentes (para o Explorer)
    componentIcons: {
        Site: '🌍',
        LayoutMenu: '🧭',
        Page: '📄',
        Text: '🔤',
        Button: '🔘',
        Image: '🖼️',
        Themecolor: '🎨',
        UIGradient: '✨',
        PointGradient: '🚦',
        Font: '🗒️',
        Color: '🎨',
        Size: '📏',
        Linked: '🔗',
        Animator: '🎦',
        Action: '⚡',
        Selectcolorbutton: '🖱️',
        UIStroke: '🔲',
        Selectcolortext: '🔡',
        backgroudimage: '🎴',
        Sides: '↔️',
        Points: '⭕',
        Past: '📁',
        comment: '🔓',
        Script: '📜',
        Event: '📡'
    },

    // Tipos de componentes e suas relações pai-filho permitidas
    hierarchy: {
        Site: ['LayoutMenu', 'Page', 'Past', 'comment'],
        LayoutMenu: ['Page'],
        Page: ['Text', 'Button', 'Image', 'Themecolor', 'UIGradient', 'PointGradient', 'Past', 'comment'],
        Text: ['Font', 'Color', 'Size', 'Linked', 'Animator'],
        Button: ['Text', 'Color', 'Action', 'Selectcolorbutton', 'UIStroke', 'Selectcolortext', 'UIGradient'],
        Image: ['Size', 'Position', 'backgroudimage', 'Animator'],
        Themecolor: ['Color'],
        UIGradient: ['Sides'],
        PointGradient: ['Points'],
        Past: [], // Pasta pode conter qualquer coisa, mas nada dentro funciona
        comment: [], // Comentários não executam nada
        Script: []
    },

    // OAuth Configuration
    oauth: {
        google: {
            clientId: '662919949034-3a61rqlropg8v67qccpda5u0eu4lgnod.apps.googleusercontent.com',
            redirectUri: 'https://catnap11sans.github.io/fireserver/pages/login.html',
            authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            scope: 'openid email profile',
            userinfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
        },
        discord: {
            clientId: '1467262023162269942',
            redirectUri: 'https://catnap11sans.github.io/fireserver/pages/login.html',
            authUrl: 'https://discord.com/api/oauth2/authorize',
            scope: 'identify email',
            userinfoUrl: 'https://discord.com/api/users/@me'
        }
    },

    // API URL (será configurado depois)
    apiURL: 'https://api.fireserver.dev',

    // Local Storage keys
    storage: {
        currentProject: 'fire_current_project',
        userSession: 'fire_user_session',
        editorState: 'fire_editor_state'
    }
};

// Utilitários globais
const FireUtils = {
    // Gera timestamp formatado
    timestamp() {
        const now = new Date();
        return `[${now.toLocaleTimeString('pt-BR')}]`;
    },

    // Valida username
    validateUsername(username) {
        return FireConfig.usernameRegex.test(username);
    },

    // Normaliza username
    normalizeUsername(username) {
        return username.toLowerCase().trim();
    },

    // Valida URL
    validateURL(url) {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'https:';
        } catch {
            return false;
        }
    },

    // Escapa HTML para prevenir XSS
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // Gera ID único
    generateID() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Debounce para otimização
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Log no console de output
    log(message, type = 'info') {
        const outputContent = document.getElementById('outputContent');
        if (!outputContent) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `output-message ${type}`;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'output-time';
        timeSpan.textContent = this.timestamp();
        
        const textSpan = document.createElement('span');
        textSpan.className = 'output-text';
        textSpan.textContent = message;
        
        messageDiv.appendChild(timeSpan);
        messageDiv.appendChild(textSpan);
        outputContent.appendChild(messageDiv);
        
        // Auto-scroll
        outputContent.scrollTop = outputContent.scrollHeight;
    }
};

// Exporta para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FireConfig, FireUtils };
}
