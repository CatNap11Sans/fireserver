const firebaseConfig = {
  apiKey: "AIzaSyAEE6PwZ7RYqScMBvi08GzD1l4nb14Hd0A",
  authDomain: "fireserverstudios.firebaseapp.com",
  projectId: "fireserverstudios",
  storageBucket: "fireserverstudios.firebasestorage.app",
  messagingSenderId: "934725619599",
  appId: "1:934725619599:web:9369f3dad91361875e45fa"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referências principais
const auth = firebase.auth();
const db = firebase.firestore();

// Configurações de persistência
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Provedor Google
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Provedor Discord (OAuth genérico - requer configuração no Firebase Console)
const discordProvider = new firebase.auth.OAuthProvider('oidc.discord');
discordProvider.addScope('identify');
discordProvider.addScope('email');

// Utilitários de autenticação
const authUtils = {
    // Verifica se o usuário está logado
    isLoggedIn: () => {
        return new Promise((resolve) => {
            firebase.auth().onAuthStateChanged((user) => {
                resolve(!!user);
            });
        });
    },

    // Obtém o usuário atual
    getCurrentUser: () => {
        return new Promise((resolve) => {
            firebase.auth().onAuthStateChanged((user) => {
                resolve(user);
            });
        });
    },

    // Redireciona para login se não estiver autenticado
    requireAuth: async () => {
        const isLoggedIn = await authUtils.isLoggedIn();
        if (!isLoggedIn) {
            window.location.href = './login.html';
        }
    },

    // Validador de username
    validateUsername: (username) => {
        const regex = /^(?!.*([_-])\1)[a-z](?:[a-z0-9_-]{1,18}[a-z0-9])$/;
        return regex.test(username);
    },

    // Normaliza username
    normalizeUsername: (username) => {
        return username.toLowerCase().trim();
    },

    // Gera ID único de 4 dígitos
    generateSiteId: () => {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
};

// Export para uso global
window.firebaseApp = firebase.app();
window.auth = auth;
window.db = db;
window.googleProvider = googleProvider;
window.discordProvider = discordProvider;
window.authUtils = authUtils;
