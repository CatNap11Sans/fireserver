// config.js - Configurações globais do Fire Server

const CONFIG = {
    // Limites do sistema
    MAX_DSL_LINES: 300,
    MAX_ELEMENTS: 100,
    MAX_IMAGES: 10,
    MAX_TEXT_LENGTH: 10000,
    
    // URLs e endpoints
    GITHUB_PAGES_URL: 'https://catnap11sans.github.io/fireserver',
    API_BASE_URL: window.location.origin,
    
    // Autenticação OAuth2
    OAUTH: {
        GOOGLE: {
            CLIENT_ID: '662919949034-3a61rqlropg8v67qccpda5u0eu4lgnod.apps.googleusercontent.comSEU_GOOGLE_CLIENT_ID_AQUI',
            REDIRECT_URI: window.location.origin + '/pages/login.html',
            SCOPE: 'openid email profile',
            AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth'
        },
        DISCORD: {
            CLIENT_ID: '1467262023162269942',
            REDIRECT_URI: window.location.origin + '/pages/login.html',
            SCOPE: 'identify email',
            AUTH_URL: 'https://discord.com/api/oauth2/authorize'
        }
    },
    
    // Cores padrão do tema
    THEME_COLORS: {
        primary: '#FF6B35',
        secondary: '#F7931E',
        dark: '#1a1a1a',
        light: '#ffffff',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8'
    },
    
    // Ícones para cada tipo de componente
    COMPONENT_ICONS: {
        Site: '📝',
        LayoutMenu: '🧭',
        Page: '📄',
        Past: '📁',
        comment: '🔓',
        Text: '🔤',
        Button: '🔘',
        Themecolor: '🎨',
        Image: '🖼️',
        UIGradient: '✨',
        PointGradient: '🚦',
        Font: '🗒️',
        Color: '🎨',
        Size: '📏',
        Linked: '🔗',
        Animator: '🎦',
        Action: '🔗',
        Selectcolorbutton: '🖱️',
        UIStroke: '🔲',
        Selectcolortext: '🔡',
        backgroudimage: '🎴',
        Sides: '↔️',
        Points: '⭕',
        Script: '📜',
        StorageVents: '📦'
    },
    
    // Validação de username
    USERNAME_REGEX: /^(?!.*([_-])\1)[a-z](?:[a-z0-9_-]{1,18}[a-z0-9])$/,
    
    // Storage keys
    STORAGE_KEYS: {
        USER_DATA: 'fireserver_user',
        CURRENT_SITE: 'fireserver_current_site',
        SITES_DATA: 'fireserver_sites',
        AUTH_TOKEN: 'fireserver_auth_token',
        THEME: 'fireserver_theme'
    },
    
    // Mensagens de erro
    ERROR_MESSAGES: {
        MAX_LINES: '🔴 Limite excedido: máximo de 300 linhas de código',
        MAX_ELEMENTS: '🔴 Limite excedido: máximo de 100 elementos renderizados',
        MAX_IMAGES: '🔴 Limite excedido: máximo de 10 imagens por site',
        MAX_TEXT: '🔴 Limite excedido: máximo de 10.000 caracteres de texto',
        INVALID_USERNAME: '🔴 Username inválido. Use apenas letras minúsculas, números, - e _',
        INVALID_COMMAND: '🔴 Comando inexistente',
        UNCLOSED_QUOTES: '🔴 Aspas não fechadas',
        INVALID_URL: '🔴 URL inválida. Use https://',
        MISSING_ARGS: '🔴 Argumentos faltando',
        EXTRA_ARGS: '🔴 Argumentos em excesso',
        AUTH_REQUIRED: '🔴 Faça login para continuar',
        SAVE_ERROR: '🔴 Erro ao salvar site',
        LOAD_ERROR: '🔴 Erro ao carregar site'
    }
};

// Função para validar username
function validateUsername(username) {
    if (!username) return false;
    return CONFIG.USERNAME_REGEX.test(username);
}

// Função para normalizar username
function normalizeUsername(username) {
    return username.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '');
}

// Função para gerar ID único
function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}

// Função para formatar URL do site
function formatSiteURL(username) {
    return `${CONFIG.GITHUB_PAGES_URL}/${username}`;
}

// Salvar no localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Erro ao salvar:', e);
        return false;
    }
}

// Carregar do localStorage
function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Erro ao carregar:', e);
        return null;
    }
}

// Verificar autenticação
function isAuthenticated() {
    return !!loadFromStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
}

// Obter dados do usuário
function getCurrentUser() {
    return loadFromStorage(CONFIG.STORAGE_KEYS.USER_DATA);
}

// Export para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
