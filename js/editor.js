// Editor main logic
let editor = null;
let currentSite = null;
let isTestMode = false;

document.addEventListener('DOMContentLoaded', async () => {
    await authUtils.requireAuth();
    await loadEditor();
    setupEditorEvents();
});

async function loadEditor() {
    // Get site ID from URL
    const urlParams = new URLParams(window.location.search);
    const siteId = urlParams.get('site');

    if (!siteId) {
        alert('Site não encontrado');
        window.location.href = '/menu.html';
        return;
    }

    // Load site data
    try {
        const siteDoc = await db.collection('sites').doc(siteId).get();
        if (!siteDoc.exists) {
            throw new Error('Site não encontrado');
        }

        currentSite = { id: siteId, ...siteDoc.data() };

        // Load workspace
        if (currentSite.workspace) {
            workspace.deserialize(currentSite.workspace);
        }

        // Initialize Monaco Editor
        await initMonacoEditor();

        // Render explorer
        renderExplorer();

        // Initial preview
        updatePreview();

        log('Editor carregado com sucesso', 'success');

    } catch (error) {
        alert('Erro ao carregar site: ' + error.message);
        window.location.href = '/menu.html';
    }
}

async function initMonacoEditor() {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
    
    require(['vs/editor/editor.main'], () => {
        // Monaco will be available for code editing
        log('Monaco Editor inicializado', 'info');
    });
}

function setupEditorEvents() {
    // Toolbar buttons
    document.getElementById('test-btn').addEventListener('click', startTest);
    document.getElementById('stop-btn').addEventListener('click', stopTest);
    document.getElementById('save-btn').addEventListener('click', saveSite);
    document.getElementById('config-btn').addEventListener('click', openConfig);
    document.getElementById('back-menu-btn').addEventListener('click', () => {
        if (confirm('Deseja voltar ao menu? Alterações não salvas serão perdidas.')) {
            window.location.href = '/menu.html';
        }
    });

    // AI button
    document.getElementById('ai-help-btn').addEventListener('click', openAIModal);

    // Clear output
    document.getElementById('clear-output').addEventListener('click', () => {
        document.getElementById('output-content').innerHTML = '';
    });

    // AI form
    document.getElementById('ai-form').addEventListener('submit', handleAIMessage);
}

function renderExplorer() {
    const explorerTree = document.getElementById('explorer-tree');
    explorerTree.innerHTML = '';

    renderTreeItem(workspace.root, explorerTree);
}

function renderTreeItem(instance, container) {
    const item = document.createElement('div');
    item.className = 'tree-item';
    item.dataset.id = instance._id;

    const icon = getComponentIcon(instance.className);
    
    item.innerHTML = `
        <span class="tree-item-icon">${icon}</span>
        <span class="tree-item-name">${instance.Name}</span>
        <button class="tree-item-add" title="Adicionar filho">🔵</button>
    `;

    item.addEventListener('click', (e) => {
        if (!e.target.closest('.tree-item-add')) {
            selectItem(instance);
        }
    });

    item.querySelector('.tree-item-add').addEventListener('click', (e) => {
        e.stopPropagation();
        showAddMenu(instance);
    });

    container.appendChild(item);

    // Render children
    if (instance.children.length > 0) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';
        
        instance.children.forEach(child => {
            renderTreeItem(child, childrenContainer);
        });

        container.appendChild(childrenContainer);
    }
}

function getComponentIcon(className) {
    const icons = {
        'Site': '📝',
        'LayoutMenu': '🧭',
        'Page': '📄',
        'Home': '🏡',
        'Text': '🔤',
        'Button': '🔘',
        'Image': '🖼️',
        'Themecolor': '🎨',
        'UIGradient': '✨',
        'Past': '📁',
        'comment': '🔓'
    };
    return icons[className] || '📦';
}

function selectItem(instance) {
    // Update selection in explorer
    document.querySelectorAll('.tree-item').forEach(item => {
        item.classList.remove('selected');
    });

    const treeItem = document.querySelector(`[data-id="${instance._id}"]`);
    if (treeItem) {
        treeItem.classList.add('selected');
    }

    // Show properties
    showProperties(instance);
}

function showProperties(instance) {
    const propertiesContent = document.getElementById('properties-content');
    
    propertiesContent.innerHTML = `
        <div class="property-group">
            <div class="property-group-title">Geral</div>
            <div class="property-field">
                <label class="property-label">Nome</label>
                <input type="text" class="property-input" value="${instance.Name}" 
                       onchange="updateProperty(${instance._id}, 'Name', this.value)">
            </div>
            <div class="property-field">
                <label class="property-label">Classe</label>
                <input type="text" class="property-input" value="${instance.className}" disabled>
            </div>
        </div>
    `;

    // Add specific properties based on className
    if (instance.className === 'Text' || instance.className === 'Button') {
        propertiesContent.innerHTML += `
            <div class="property-group">
                <div class="property-group-title">Texto</div>
                <div class="property-field">
                    <label class="property-label">Conteúdo</label>
                    <input type="text" class="property-input" value="${instance.Text || ''}" 
                           onchange="updateProperty(${instance._id}, 'Text', this.value)">
                </div>
            </div>
        `;
    }
}

function updateProperty(instanceId, property, value) {
    const instance = workspace.instanceMap.get(instanceId);
    if (instance) {
        instance[property] = value;
        updatePreview();
        log(`Propriedade ${property} atualizada`, 'info');
    }
}

function showAddMenu(parentInstance) {
    const validChildren = getValidChildren(parentInstance.className);
    
    if (validChildren.length === 0) {
        alert('Este componente não pode ter filhos');
        return;
    }

    const choice = prompt(`Adicionar:\n${validChildren.map((c, i) => `${i+1}. ${c}`).join('\n')}\n\nDigite o número:`);
    
    if (choice) {
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < validChildren.length) {
            const className = validChildren[index];
            const newInstance = workspace.createInstance(className, parentInstance);
            newInstance.Name = className;
            renderExplorer();
            updatePreview();
            log(`${className} adicionado`, 'success');
        }
    }
}

function getValidChildren(parentClass) {
    const rules = {
        'Site': ['LayoutMenu', 'Home', 'Page', 'Past', 'comment'],
        'LayoutMenu': ['Page'],
        'Page': ['Text', 'Button', 'Image', 'Themecolor', 'UIGradient'],
        'Home': ['Text', 'Button', 'Image', 'Themecolor', 'UIGradient'],
        'Text': ['Font', 'Color', 'Size', 'Linked', 'Animator'],
        'Button': ['Text', 'Color', 'UIStroke', 'UICorner']
    };

    return rules[parentClass] || [];
}

function updatePreview() {
    const iframe = document.getElementById('preview-iframe');
    const html = renderWorkspaceToHTML();
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
}

function renderWorkspaceToHTML() {
    // Basic rendering - will be enhanced with proper renderer
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/css/viewer.css">
            <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            </style>
        </head>
        <body>
    `;

    const home = workspace.root.findFirstChild('Home');
    if (home) {
        html += renderInstance(home);
    }

    html += `
        </body>
        </html>
    `;

    return html;
}

function renderInstance(instance) {
    let html = '';

    switch (instance.className) {
        case 'Home':
        case 'Page':
            html += '<div class="fs-page">';
            instance.children.forEach(child => {
                html += renderInstance(child);
            });
            html += '</div>';
            break;

        case 'Text':
            html += `<div class="fs-text">${escapeHTML(instance.Text || 'Texto')}</div>`;
            break;

        case 'Button':
            html += `<button class="fs-button">${escapeHTML(instance.Text || 'Botão')}</button>`;
            break;

        case 'Image':
            if (instance.BackgroundImage) {
                html += `<img src="${escapeHTML(instance.BackgroundImage)}" class="fs-image">`;
            }
            break;
    }

    return html;
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function startTest() {
    isTestMode = true;
    document.getElementById('test-btn').disabled = true;
    document.getElementById('stop-btn').disabled = false;
    log('Modo de teste iniciado', 'info');
    updatePreview();
}

function stopTest() {
    isTestMode = false;
    document.getElementById('test-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
    log('Modo de teste parado', 'info');
}

async function saveSite() {
    try {
        await db.collection('sites').doc(currentSite.id).update({
            workspace: workspace.serialize(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        log('Site salvo com sucesso!', 'success');
    } catch (error) {
        log('Erro ao salvar: ' + error.message, 'error');
    }
}

function openConfig() {
    const modal = document.getElementById('config-modal');
    document.getElementById('config-name').value = currentSite.name;
    document.getElementById('config-visibility').value = currentSite.visibility;
    document.getElementById('config-description').value = currentSite.description || '';
    modal.classList.add('active');
}

function openAIModal() {
    document.getElementById('ai-modal').classList.add('active');
}

function handleAIMessage(e) {
    e.preventDefault();
    
    const input = document.getElementById('ai-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message to chat
    const messagesContainer = document.getElementById('ai-messages');
    messagesContainer.innerHTML += `
        <div class="ai-message ai-message-user">
            <div class="message-content">${escapeHTML(message)}</div>
        </div>
    `;

    // Simple AI response (would integrate with actual AI later)
    setTimeout(() => {
        messagesContainer.innerHTML += `
            <div class="ai-message ai-message-bot">
                <div class="message-content">
                    Essa é uma resposta de exemplo. A IA completa será implementada em breve!
                    Sua pergunta foi: "${escapeHTML(message)}"
                </div>
            </div>
        `;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 500);

    input.value = '';
}

function log(message, type = 'info') {
    const output = document.getElementById('output-content');
    const time = new Date().toLocaleTimeString();
    
    output.innerHTML += `
        <div class="output-message ${type}">
            <span class="output-time">[${time}]</span>
            <span class="output-text">${escapeHTML(message)}</span>
        </div>
    `;

    output.scrollTop = output.scrollHeight;
}

// URLParams polyfill
class URLParams {
    constructor(search) {
        this.params = new Map();
        if (search.startsWith('?')) {
            search = search.substring(1);
        }
        search.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
                this.params.set(key, decodeURIComponent(value || ''));
            }
        });
    }

    get(key) {
        return this.params.get(key);
    }
}

// Make functions global for onclick handlers
window.updateProperty = updateProperty;
window.closeModal = (id) => document.getElementById(id).classList.remove('active');
