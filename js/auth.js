// Auth page logic

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${targetTab}-form`).classList.add('active');
        });
    });

    // Login form
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);

    // Signup form
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', handleSignup);

    // Google login buttons
    document.getElementById('google-login').addEventListener('click', () => handleGoogleAuth(false));
    document.getElementById('google-signup').addEventListener('click', () => handleGoogleAuth(true));

    // Discord login button
    document.getElementById('discord-login').addEventListener('click', handleDiscordAuth);

    // Forgot password
    document.getElementById('forgot-password').addEventListener('click', handleForgotPassword);

    // Check if already logged in
    checkAuthState();
});

async function checkAuthState() {
    const user = await authUtils.getCurrentUser();
    if (user) {
        window.location.href = './menu.html';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const usernameOrEmail = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        showLoading(true);
        
        // Check if it's an email or username
        let email = usernameOrEmail;
        if (!usernameOrEmail.includes('@')) {
            // It's a username, fetch email from Firestore
            const userDoc = await db.collection('usernames').doc(usernameOrEmail.toLowerCase()).get();
            if (!userDoc.exists) {
                throw new Error('Usuário não encontrado');
            }
            email = userDoc.data().email;
        }

        await auth.signInWithEmailAndPassword(email, password);
        window.location.href = './menu.html';
        
    } catch (error) {
        showError(getErrorMessage(error));
    } finally {
        showLoading(false);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('signup-email').value.trim();
    const username = document.getElementById('signup-username').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-password-confirm').value;

    try {
        // Validations
        if (password !== confirmPassword) {
            throw new Error('As senhas não coincidem');
        }

        if (!authUtils.validateUsername(username)) {
            throw new Error('Nome de usuário inválido. Use apenas letras minúsculas, números, _ e -');
        }

        showLoading(true);

        // Check if username is available
        const usernameDoc = await db.collection('usernames').doc(username).get();
        if (usernameDoc.exists) {
            throw new Error('Nome de usuário já está em uso');
        }

        // Create user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Create user profile
        await db.collection('users').doc(user.uid).set({
            username: username,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            sites: []
        });

        // Reserve username
        await db.collection('usernames').doc(username).set({
            uid: user.uid,
            email: email
        });

        window.location.href = './menu.html';
        
    } catch (error) {
        showError(getErrorMessage(error));
    } finally {
        showLoading(false);
    }
}

async function handleGoogleAuth(isSignup) {
    try {
        showLoading(true);
        
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;

        // Check if user document exists
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            // New user - needs to create username
            const username = await promptUsername();
            
            if (!username) {
                await user.delete();
                throw new Error('Nome de usuário é obrigatório');
            }

            // Create user profile
            await db.collection('users').doc(user.uid).set({
                username: username,
                email: user.email,
                avatar: user.photoURL,
                provider: 'google',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                sites: []
            });

            // Reserve username
            await db.collection('usernames').doc(username).set({
                uid: user.uid,
                email: user.email
            });
        }

        window.location.href = './menu.html';
        
    } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
            showError(getErrorMessage(error));
        }
    } finally {
        showLoading(false);
    }
}

async function handleDiscordAuth() {
    try {
        showLoading(true);
        
        // Discord OAuth is configured as optional
        // This would require additional setup in Firebase Console
        showError('Login com Discord estará disponível em breve. Por favor, use email/senha ou Google.');
        
    } catch (error) {
        showError(getErrorMessage(error));
    } finally {
        showLoading(false);
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = prompt('Digite seu email para recuperação:');
    if (!email) return;

    try {
        showLoading(true);
        await auth.sendPasswordResetEmail(email);
        alert('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
        showError(getErrorMessage(error));
    } finally {
        showLoading(false);
    }
}

async function promptUsername() {
    const username = prompt('Escolha um nome de usuário (minúsculo, 3-20 caracteres):');
    if (!username) return null;

    const normalized = authUtils.normalizeUsername(username);
    
    if (!authUtils.validateUsername(normalized)) {
        alert('Nome de usuário inválido');
        return promptUsername();
    }

    // Check availability
    const usernameDoc = await db.collection('usernames').doc(normalized).get();
    if (usernameDoc.exists) {
        alert('Nome de usuário já está em uso');
        return promptUsername();
    }

    return normalized;
}

function showError(message) {
    alert('❌ ' + message);
}

function showLoading(show) {
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach(btn => {
        btn.disabled = show;
        btn.textContent = show ? 'Carregando...' : btn.textContent;
    });
}

function getErrorMessage(error) {
    const errorMessages = {
        'auth/email-already-in-use': 'Este email já está cadastrado',
        'auth/invalid-email': 'Email inválido',
        'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres)',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    };

    return errorMessages[error.code] || error.message;
}
