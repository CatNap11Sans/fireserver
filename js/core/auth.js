// Fire Server - Authentication Module
// Gerencia autenticação e sessão do usuário

class FireAuth {
    constructor() {
        this.storageKeys = {
            authToken: 'fireserver_auth_token',
            userData: 'fireserver_user_data',
            googleUser: 'fireserver_google_user',
            discordUser: 'fireserver_discord_user'
        };
        
        this.currentUser = null;
        this.loadCurrentUser();
    }

    // Verifica se está autenticado
    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;
        
        // Verifica se o token expirou (1 hora para Google)
        const oneHour = 60 * 60 * 1000;
        const tokenAge = Date.now() - token.timestamp;
        
        if (tokenAge > oneHour) {
            console.warn('Token expirado');
            return false;
        }
        
        return true;
    }

    // Obtém o token atual
    getToken() {
        try {
            const data = localStorage.getItem(this.storageKeys.authToken);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Erro ao carregar token:', e);
            return null;
        }
    }

    // Carrega dados do usuário atual
    loadCurrentUser() {
        try {
            const data = localStorage.getItem(this.storageKeys.userData);
            this.currentUser = data ? JSON.parse(data) : null;
            return this.currentUser;
        } catch (e) {
            console.error('Erro ao carregar usuário:', e);
            return null;
        }
    }

    // Obtém usuário atual
    getCurrentUser() {
        if (!this.currentUser) {
            this.loadCurrentUser();
        }
        return this.currentUser;
    }

    // Obtém todos os logins ativos
    getActiveLogins() {
        const logins = {
            google: null,
            discord: null
        };
        
        try {
            const googleData = localStorage.getItem(this.storageKeys.googleUser);
            const discordData = localStorage.getItem(this.storageKeys.discordUser);
            
            if (googleData) logins.google = JSON.parse(googleData);
            if (discordData) logins.discord = JSON.parse(discordData);
        } catch (e) {
            console.error('Erro ao carregar logins:', e);
        }
        
        return logins;
    }

    // Conta quantos sites o usuário pode ter
    getAvailableSites() {
        const logins = this.getActiveLogins();
        let count = 0;
        
        if (logins.google) count++;
        if (logins.discord) count++;
        
        return count;
    }

    // Verifica se pode criar mais sites
    canCreateSite(currentSiteCount = 0) {
        const maxSites = this.getAvailableSites();
        return currentSiteCount < maxSites;
    }

    // Logout
    logout(provider = 'all') {
        if (provider === 'all') {
            // Remove tudo
            localStorage.removeItem(this.storageKeys.authToken);
            localStorage.removeItem(this.storageKeys.userData);
            localStorage.removeItem(this.storageKeys.googleUser);
            localStorage.removeItem(this.storageKeys.discordUser);
            
            this.currentUser = null;
            
            // Redireciona para login
            window.location.href = 'login.html';
        } else if (provider === 'google') {
            localStorage.removeItem(this.storageKeys.googleUser);
            
            // Se só tinha Google, faz logout completo
            const logins = this.getActiveLogins();
            if (!logins.discord) {
                this.logout('all');
            }
        } else if (provider === 'discord') {
            localStorage.removeItem(this.storageKeys.discordUser);
            
            // Se só tinha Discord, faz logout completo
            const logins = this.getActiveLogins();
            if (!logins.google) {
                this.logout('all');
            }
        }
    }

    // Requer autenticação (redireciona se não autenticado)
    requireAuth() {
        if (!this.isAuthenticated()) {
            alert('Você precisa fazer login para acessar esta página');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Gera informações da UI
    getUserDisplayInfo() {
        const user = this.getCurrentUser();
        if (!user) return null;
        
        return {
            name: user.name || 'Usuário',
            email: user.email || '',
            avatar: user.avatar || this.getDefaultAvatar(),
            provider: user.provider || 'unknown',
            initials: this.getInitials(user.name)
        };
    }

    // Obtém iniciais do nome
    getInitials(name) {
        if (!name) return '??';
        
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    // Avatar padrão
    getDefaultAvatar() {
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ff6b35"/><text x="50" y="50" font-size="40" fill="white" text-anchor="middle" dy=".3em">?</text></svg>';
    }

    // Atualiza informações do usuário na UI
    updateUserUI() {
        const userInfo = this.getUserDisplayInfo();
        if (!userInfo) return;
        
        // Atualiza elementos com classe user-name
        document.querySelectorAll('.user-name').forEach(el => {
            el.textContent = userInfo.name;
        });
        
        // Atualiza elementos com classe user-email
        document.querySelectorAll('.user-email').forEach(el => {
            el.textContent = userInfo.email;
        });
        
        // Atualiza avatares
        document.querySelectorAll('.user-avatar').forEach(el => {
            if (el.tagName === 'IMG') {
                el.src = userInfo.avatar;
                el.alt = userInfo.name;
            } else {
                el.style.backgroundImage = `url(${userInfo.avatar})`;
            }
        });
        
        // Atualiza iniciais
        document.querySelectorAll('.user-initials').forEach(el => {
            el.textContent = userInfo.initials;
        });
    }

    // Log de debug
    debug() {
        console.group('🔐 Fire Server Auth Debug');
        console.log('Autenticado:', this.isAuthenticated());
        console.log('Usuário atual:', this.getCurrentUser());
        console.log('Token:', this.getToken());
        console.log('Logins ativos:', this.getActiveLogins());
        console.log('Sites disponíveis:', this.getAvailableSites());
        console.groupEnd();
    }
}

// Cria instância global
const fireAuth = new FireAuth();

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.fireAuth = fireAuth;
}

// Para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FireAuth;
}
