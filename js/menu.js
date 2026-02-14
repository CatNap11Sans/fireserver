// Menu/Dashboard logic

let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    await authUtils.requireAuth();
    await loadUserData();
    setupEventListeners();
});

async function loadUserData() {
    currentUser = await authUtils.getCurrentUser();
    
    if (!currentUser) {
        window.location.href = '/login.html';
        return;
    }

    // Load user profile
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();

    // Update UI
    document.getElementById('user-name').textContent = userData.username;
    document.getElementById('url-username').textContent = userData.username;
    
    const avatar = document.getElementById('user-avatar');
    if (userData.avatar) {
        avatar.style.backgroundImage = `url(${userData.avatar})`;
        avatar.textContent = '';
    } else {
        avatar.textContent = userData.username[0].toUpperCase();
    }

    // Load sites
    await loadSites(userData);
}

async function loadSites(userData) {
    const sitesGrid = document.getElementById('sites-grid');
    const emptyState = document.getElementById('empty-state');

    // Get user's sites
    const sitesSnapshot = await db.collection('sites')
        .where('userId', '==', currentUser.uid)
        .get();

    if (sitesSnapshot.empty) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    sitesGrid.innerHTML = '';

    sitesSnapshot.forEach(doc => {
        const site = doc.data();
        const siteCard = createSiteCard(doc.id, site);
        sitesGrid.appendChild(siteCard);
    });
}

function createSiteCard(siteId, site) {
    const card = document.createElement('div');
    card.className = 'site-card';
    card.innerHTML = `
        <div class="site-card-preview">
            ${site.linkCard ? `<img src="${site.linkCard}" alt="${site.name}">` : ''}
        </div>
        <div class="site-card-body">
            <div class="site-card-header">
                <div class="site-favicon">
                    ${site.favicon ? `<img src="${site.favicon}" alt="">` : '🔥'}
                </div>
                <div class="site-info">
                    <div class="site-name">${site.name}</div>
                    <span class="site-status ${site.visibility}">${getStatusLabel(site.visibility)}</span>
                </div>
            </div>
            <div class="site-card-footer">
                <button class="btn btn-sm btn-primary" onclick="editSite('${siteId}')">
                    Editar
                </button>
                <button class="btn btn-sm btn-secondary" onclick="configureSite('${siteId}')">
                    Configurar
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSite('${siteId}')">
                    Excluir
                </button>
            </div>
        </div>
    `;

    // Make card clickable (except buttons)
    card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            editSite(siteId);
        }
    });

    return card;
}

function getStatusLabel(visibility) {
    const labels = {
        public: 'Público',
        private: 'Privado',
        suspended: 'Em Suspensão'
    };
    return labels[visibility] || visibility;
}

function setupEventListeners() {
    // Create site button
    document.getElementById('create-site-btn').addEventListener('click', openCreateSiteModal);

    // Profile link
    document.getElementById('profile-link').addEventListener('click', (e) => {
        e.preventDefault();
        openProfileModal();
    });

    // Create site form
    document.getElementById('create-site-form').addEventListener('submit', handleCreateSite);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Delete account
    document.getElementById('delete-account-btn').addEventListener('click', handleDeleteAccount);
}

function openCreateSiteModal() {
    const modal = document.getElementById('create-site-modal');
    modal.classList.add('active');
}

async function handleCreateSite(e) {
    e.preventDefault();

    const name = document.getElementById('site-name').value.trim();
    const description = document.getElementById('site-description').value.trim();

    try {
        // Get user data
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();

        // Generate site ID
        const siteId = authUtils.generateSiteId();
        const url = `${userData.username}-${siteId}`;

        // Create site document
        await db.collection('sites').add({
            userId: currentUser.uid,
            name: name,
            description: description,
            url: url,
            visibility: 'public',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            workspace: new FireServerWorkspace().serialize()
        });

        closeModal('create-site-modal');
        location.reload();

    } catch (error) {
        alert('Erro ao criar site: ' + error.message);
    }
}

function editSite(siteId) {
    window.location.href = `/editor.html?site=${siteId}`;
}

function configureSite(siteId) {
    // Implement site configuration
    alert('Configuração do site em desenvolvimento');
}

async function deleteSite(siteId) {
    if (!confirm('Você tem certeza? Esta ação não pode ser desfeita.')) {
        return;
    }

    try {
        await db.collection('sites').doc(siteId).delete();
        location.reload();
    } catch (error) {
        alert('Erro ao excluir site: ' + error.message);
    }
}

async function openProfileModal() {
    const modal = document.getElementById('profile-modal');
    
    // Load user data
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();

    document.getElementById('profile-username').textContent = userData.username;
    document.getElementById('profile-email').textContent = userData.email;
    document.getElementById('profile-discord').textContent = userData.discord || 'Não conectado';

    modal.classList.add('active');
}

async function handleLogout() {
    if (confirm('Deseja sair da sua conta?')) {
        await auth.signOut();
        window.location.href = '/login.html';
    }
}

async function handleDeleteAccount() {
    if (!confirm('ATENÇÃO: Todos os seus sites serão excluídos permanentemente. Tem certeza?')) {
        return;
    }

    const password = prompt('Digite sua senha para confirmar:');
    if (!password) return;

    try {
        // Re-authenticate
        const credential = firebase.auth.EmailAuthProvider.credential(
            currentUser.email,
            password
        );
        await currentUser.reauthenticateWithCredential(credential);

        // Delete all sites
        const sitesSnapshot = await db.collection('sites')
            .where('userId', '==', currentUser.uid)
            .get();

        const batch = db.batch();
        sitesSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Delete user data
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const username = userDoc.data().username;

        await db.collection('users').doc(currentUser.uid).delete();
        await db.collection('usernames').doc(username).delete();

        // Delete auth account
        await currentUser.delete();

        alert('Conta excluída com sucesso');
        window.location.href = '/index.html';

    } catch (error) {
        alert('Erro ao excluir conta: ' + error.message);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Make functions global
window.editSite = editSite;
window.configureSite = configureSite;
window.deleteSite = deleteSite;
window.closeModal = closeModal;
