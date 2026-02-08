/**
 * Fire Server - Configuração
 * Configure a URL base do seu projeto aqui
 */

const FIRE_CONFIG = {
    // ALTERE ISSO PARA SEU USUÁRIO DO GITHUB
    githubUsername: 'catnap11sans',
    
    // Nome do repositório (geralmente 'fireserver')
    repoName: 'fireserver',
    
    // Gera URL completa
    get baseURL() {
        return `https://${this.githubUsername}.github.io/${this.repoName}`;
    },
    
    // URL do viewer
    get viewerURL() {
        return `${this.baseURL}/pages/viewer.html`;
    },
    
    // Gera URL de um site de usuário
    getUserURL(username) {
        return `${this.viewerURL}?user=${username}`;
    },
    
    // Para desenvolvimento local
    isLocal: window.location.protocol === 'file:',
    
    // Versão
    version: '2.0'
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FIRE_CONFIG;
}
