// editor.js - Lógica principal do editor Fire Server

(function() {
    'use strict';
    
    // Estado global do editor
    const EditorState = {
        currentFile: null,
        selectedObject: null,
        mode: 'select', // select, move, scale
        isPlaying: false,
        hasUnsavedChanges: false
    };
    
    // Elementos DOM
    const elements = {
        sidebar: document.querySelector('.sidebar'),
        toolbar: document.querySelector('.toolbar'),
        tabs: document.getElementById('tabs-container'),
        preview: document.getElementById('preview-area'),
        output: document.getElementById('output-console'),
        explorer: document.getElementById('explorer-tree'),
        properties: document.getElementById('properties-content'),
        aiPanel: document.getElementById('ai-panel'),
        aiMessages: document.getElementById('ai-messages'),
        configModal: document.getElementById('config-modal')
    };
    
    // Inicializar editor
    function initEditor() {
        console.log('🔥 Fire Server Editor iniciando...');
        
        // Verificar autenticação
        if (!isAuthenticated()) {
            if (confirm('Você precisa fazer login para usar o editor. Ir para login?')) {
                window.location.href = 'login.html';
            }
            return;
        }
        
        // Carregar dados do usuário
        const user = getCurrentUser();
        console.log('Usuário:', user);
        
        // Setup event listeners
        setupToolbar();
        setupSidebar();
        setupExplorer();
        setupAI();
        setupKeyboardShortcuts();
        
        // Carregar site atual ou criar novo
        loadOrCreateSite();
        
        // Atualizar explorer
        updateExplorer();
        
        log('Editor pronto! 🎉', 'success');
    }
    
    // Configurar toolbar
    function setupToolbar() {
        document.getElementById('select-mode').addEventListener('click', () => setMode('select'));
        document.getElementById('move-mode').addEventListener('click', () => setMode('move'));
        document.getElementById('scale-mode').addEventListener('click', () => setMode('scale'));
        
        document.getElementById('test-btn').addEventListener('click', playPreview);
        document.getElementById('stop-btn').addEventListener('click', stopPreview);
        document.getElementById('config-btn').addEventListener('click', openConfig);
        document.getElementById('save-btn').addEventListener('click', saveSite);
    }
    
    // Configurar sidebar
    function setupSidebar() {
        document.getElementById('toggle-sidebar').addEventListener('click', toggleSidebar);
        document.getElementById('ai-assistant').addEventListener('click', toggleAI);
        document.getElementById('discord-btn').addEventListener('click', openDiscord);
        document.getElementById('back-home').addEventListener('click', () => {
            if (EditorState.hasUnsavedChanges) {
                if (confirm('Você tem alterações não salvas. Deseja sair mesmo assim?')) {
                    window.location.href = '../index.html';
                }
            } else {
                window.location.href = '../index.html';
            }
        });
    }
    
    // Configurar explorer
    function setupExplorer() {
        document.getElementById('add-root').addEventListener('click', () => {
            addObjectDialog(workspace.Site);
        });
        
        elements.explorer.addEventListener('click', (e) => {
            const item = e.target.closest('.tree-item');
            if (!item) return;
            
            const id = item.dataset.id;
            const instance = workspace.getInstanceById(id);
            
            if (e.target.classList.contains('tree-item-add')) {
                addObjectDialog(instance);
            } else {
                selectObject(instance);
            }
        });
    }
    
    // Configurar AI
    function setupAI() {
        document.getElementById('close-ai').addEventListener('click', () => {
            elements.aiPanel.classList.remove('active');
        });
        
        document.getElementById('ai-send').addEventListener('click', sendAIMessage);
        
        document.getElementById('ai-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                sendAIMessage();
            }
        });
    }
    
    // Setup atalhos de teclado
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S - Salvar
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveSite();
            }
            
            // Ctrl+Shift+P - Play/Preview
            if (e.ctrlKey && e.shiftKey && e.key === 'p') {
                e.preventDefault();
                playPreview();
            }
            
            // Esc - Parar
            if (e.key === 'Escape') {
                stopPreview();
            }
            
            // Delete - Deletar objeto selecionado
            if (e.key === 'Delete' && EditorState.selectedObject) {
                if (confirm('Deletar objeto selecionado?')) {
                    EditorState.selectedObject.Destroy();
                    EditorState.selectedObject = null;
                    updateExplorer();
                    updateProperties();
                }
            }
        });
    }
    
    // Mudar modo de edição
    function setMode(mode) {
        EditorState.mode = mode;
        
        // Atualizar UI
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(`${mode}-mode`).classList.add('active');
        
        log(`Modo: ${mode}`, 'info');
    }
    
    // Atualizar explorer tree
    function updateExplorer() {
        elements.explorer.innerHTML = '';
        
        function renderTree(instance, level = 0) {
            const item = document.createElement('div');
            item.className = 'tree-item';
            if (EditorState.selectedObject === instance) {
                item.classList.add('selected');
            }
            item.dataset.id = instance.id;
            item.dataset.type = instance.className;
            item.style.marginLeft = `${level * 20}px`;
            
            const icon = CONFIG.COMPONENT_ICONS[instance.className] || '📦';
            
            item.innerHTML = `
                <span class="tree-item-icon">${icon}</span>
                <span class="tree-item-name">${instance.Name}</span>
                <span class="tree-item-add">🔵</span>
            `;
            
            elements.explorer.appendChild(item);
            
            // Renderizar filhos
            for (let child of instance.children) {
                renderTree(child, level + 1);
            }
        }
        
        renderTree(workspace.Site);
    }
    
    // Selecionar objeto
    function selectObject(instance) {
        EditorState.selectedObject = instance;
        updateExplorer();
        updateProperties();
        log(`Selecionado: ${instance.Name} (${instance.className})`, 'info');
    }
    
    // Atualizar painel de propriedades
    function updateProperties() {
        if (!EditorState.selectedObject) {
            elements.properties.innerHTML = '<p style="color: #999; font-size: 13px;">Selecione um objeto no Explorer</p>';
            return;
        }
        
        const obj = EditorState.selectedObject;
        const props = obj.properties;
        
        let html = `
            <div class="property-group">
                <label class="property-label">Nome</label>
                <input type="text" class="property-input" value="${obj.Name}" onchange="updateObjectName(this.value)">
            </div>
            <div class="property-group">
                <label class="property-label">Tipo</label>
                <input type="text" class="property-input" value="${obj.className}" disabled>
            </div>
        `;
        
        // Propriedades específicas por tipo
        if (props.Text !== undefined) {
            html += `
                <div class="property-group">
                    <label class="property-label">Texto</label>
                    <textarea class="property-input" onchange="updateObjectProperty('Text', this.value)">${props.Text}</textarea>
                </div>
            `;
        }
        
        if (props.Color !== undefined) {
            html += `
                <div class="property-group">
                    <label class="property-label">Cor</label>
                    <div class="property-color">
                        <input type="color" value="${props.Color}" onchange="updateObjectProperty('Color', this.value)">
                        <input type="text" class="property-input" value="${props.Color}" onchange="updateObjectProperty('Color', this.value)">
                    </div>
                </div>
            `;
        }
        
        if (props.BackgroundColor !== undefined) {
            html += `
                <div class="property-group">
                    <label class="property-label">Cor de Fundo</label>
                    <div class="property-color">
                        <input type="color" value="${props.BackgroundColor}" onchange="updateObjectProperty('BackgroundColor', this.value)">
                        <input type="text" class="property-input" value="${props.BackgroundColor}" onchange="updateObjectProperty('BackgroundColor', this.value)">
                    </div>
                </div>
            `;
        }
        
        if (props.FontSize !== undefined) {
            html += `
                <div class="property-group">
                    <label class="property-label">Tamanho da Fonte</label>
                    <input type="number" class="property-input" value="${props.FontSize}" onchange="updateObjectProperty('FontSize', parseInt(this.value))">
                </div>
            `;
        }
        
        if (props.Visible !== undefined) {
            html += `
                <div class="property-group">
                    <label class="property-label">
                        <input type="checkbox" ${props.Visible ? 'checked' : ''} onchange="updateObjectProperty('Visible', this.checked)">
                        Visível
                    </label>
                </div>
            `;
        }
        
        elements.properties.innerHTML = html;
    }
    
    // Funções globais para properties (chamadas inline)
    window.updateObjectName = function(name) {
        if (EditorState.selectedObject) {
            EditorState.selectedObject.Name = name;
            EditorState.hasUnsavedChanges = true;
            updateExplorer();
        }
    };
    
    window.updateObjectProperty = function(prop, value) {
        if (EditorState.selectedObject) {
            EditorState.selectedObject.properties[prop] = value;
            EditorState.hasUnsavedChanges = true;
            log(`${prop} atualizado`, 'success');
        }
    };
    
    // Dialog para adicionar objeto
    function addObjectDialog(parent) {
        const types = ['Page', 'Text', 'Button', 'Image', 'Frame', 'Script'];
        const type = prompt('Tipo de objeto:\n' + types.join(', '));
        
        if (!type) return;
        
        if (!types.includes(type)) {
            alert('Tipo inválido!');
            return;
        }
        
        const instance = Instance.new(type, parent);
        instance.Name = `${type}1`;
        
        EditorState.hasUnsavedChanges = true;
        updateExplorer();
        selectObject(instance);
        log(`${type} criado`, 'success');
    }
    
    // Play preview
    function playPreview() {
        if (EditorState.isPlaying) return;
        
        EditorState.isPlaying = true;
        log('▶️ Executando preview...', 'info');
        
        try {
            // Executar scripts Lua se existirem
            const scripts = workspace.GetDescendants().filter(obj => obj.className === 'Script');
            
            for (let script of scripts) {
                if (script.properties.Source) {
                    executeLuaScript(script.properties.Source);
                }
            }
            
            // Renderizar site
            renderSitePreview();
            
            log('✅ Preview executado com sucesso', 'success');
            
        } catch (error) {
            log(`❌ Erro: ${error.message}`, 'error');
        }
    }
    
    // Parar preview
    function stopPreview() {
        if (!EditorState.isPlaying) return;
        
        EditorState.isPlaying = false;
        log('⏹️ Preview parado', 'info');
    }
    
    // Renderizar preview do site
    function renderSitePreview() {
        const previewFrame = document.getElementById('preview-frame');
        const doc = previewFrame.contentDocument;
        
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview</title>
                <style>
                    body { margin: 0; padding: 20px; font-family: sans-serif; }
                </style>
            </head>
            <body>
                <h1>Preview do Site</h1>
                <p>Funcionalidade de renderização em desenvolvimento...</p>
            </body>
            </html>
        `);
        doc.close();
        
        previewFrame.style.display = 'block';
        document.getElementById('preview-loading').style.display = 'none';
    }
    
    // Executar script Lua
    function executeLuaScript(code) {
        // Fengari execution
        if (typeof fengari !== 'undefined') {
            try {
                fengari.load(code)();
            } catch (error) {
                throw new Error(`Erro Lua: ${error.message}`);
            }
        } else {
            log('Fengari não carregado', 'warning');
        }
    }
    
    // Salvar site
    function saveSite() {
        log('💾 Salvando site...', 'info');
        
        const siteData = {
            version: '1.0',
            timestamp: Date.now(),
            workspace: workspace.toJSON(),
            config: {
                title: document.getElementById('site-title')?.value || 'Meu Site',
                description: document.getElementById('site-description')?.value || '',
                ogImage: document.getElementById('site-og-image')?.value || ''
            }
        };
        
        // Salvar no localStorage
        const user = getCurrentUser();
        const key = `${CONFIG.STORAGE_KEYS.SITES_DATA}_${user.id}`;
        
        if (saveToStorage(key, siteData)) {
            EditorState.hasUnsavedChanges = false;
            log('✅ Site salvo com sucesso!', 'success');
        } else {
            log('❌ Erro ao salvar site', 'error');
        }
    }
    
    // Carregar ou criar site
    function loadOrCreateSite() {
        const user = getCurrentUser();
        const key = `${CONFIG.STORAGE_KEYS.SITES_DATA}_${user.id}`;
        const siteData = loadFromStorage(key);
        
        if (siteData && siteData.workspace) {
            // Carregar site existente
            workspace.clear();
            workspace.Site = FireInstance.fromJSON(siteData.workspace.children[0]);
            workspace.children = [workspace.Site];
            workspace.registerInstance(workspace.Site);
            
            log('Site carregado', 'success');
        } else {
            // Criar novo site
            log('Novo site criado', 'info');
        }
    }
    
    // AI Assistant
    function toggleAI() {
        elements.aiPanel.classList.toggle('active');
    }
    
    function sendAIMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Adicionar mensagem do usuário
        addAIMessage(message, 'user');
        input.value = '';
        
        // Simular resposta da IA (sem usar API externa)
        setTimeout(() => {
            const response = generateLocalAIResponse(message);
            addAIMessage(response, 'assistant');
        }, 500);
    }
    
    function addAIMessage(text, role) {
        const div = document.createElement('div');
        div.className = `ai-message ${role}`;
        div.textContent = text;
        elements.aiMessages.appendChild(div);
        elements.aiMessages.scrollTop = elements.aiMessages.scrollHeight;
    }
    
    function generateLocalAIResponse(message) {
        const lower = message.toLowerCase();
        
        // Respostas baseadas em palavras-chave
        if (lower.includes('erro') || lower.includes('error')) {
            return 'Para resolver erros, verifique:\n1. Aspas fechadas\n2. Comandos válidos\n3. URLs com https://\n4. Sintaxe correta';
        }
        
        if (lower.includes('criar') || lower.includes('como')) {
            return 'Você pode criar elementos usando:\n- Create.Text(parent)\n- Create.Button(parent)\n- Create.Image(parent)\n\nExemplo:\nlocal text = Create.Text(workspace.Site)\ntext.Text = "Olá!"';
        }
        
        if (lower.includes('cor') || lower.includes('color')) {
            return 'Cores no Fire Server:\n- Color.RGB(255, 107, 53)\n- Color.HEX("#FF6B35")\n- Color.HSV(15, 80, 100)\n- Color.random()';
        }
        
        if (lower.includes('ajuda') || lower.includes('help')) {
            return 'Posso ajudar com:\n- Explicar erros\n- Mostrar exemplos de código\n- Sugerir soluções\n- Ensinar comandos DSL';
        }
        
        return 'Entendo sua pergunta! Precisa de ajuda específica com código, DSL ou configuração? Tente ser mais específico.';
    }
    
    // Outras funções
    function toggleSidebar() {
        elements.sidebar.style.display = elements.sidebar.style.display === 'none' ? 'flex' : 'none';
    }
    
    function openDiscord() {
        window.open('https://discord.gg/fireserver', '_blank');
    }
    
    function openConfig() {
        elements.configModal.classList.add('active');
    }
    
    document.getElementById('close-config')?.addEventListener('click', () => {
        elements.configModal.classList.remove('active');
    });
    
    // Log no console
    function log(message, type = 'info') {
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        elements.output.appendChild(line);
        elements.output.scrollTop = elements.output.scrollHeight;
        
        console.log(message);
    }
    
    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEditor);
    } else {
        initEditor();
    }
    
})();
