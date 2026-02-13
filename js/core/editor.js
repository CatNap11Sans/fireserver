// Fire Server - Editor Principal
// Integra Monaco Editor, Workspace, e UI

class FireEditor {
    constructor() {
        this.editor = null;
        this.currentTab = null;
        this.tabs = new Map();
        this.selectedInstance = null;
        this.isRunning = false;
        
        this.init();
    }

    async init() {
        try {
            await this.setupMonaco();
            this.setupUI();
            this.setupEventListeners();
            this.createDefaultTab();
            this.updateExplorer();
            
            FireUtils.log('Editor inicializado com sucesso', 'success');
        } catch (error) {
            FireUtils.log(`Erro ao inicializar editor: ${error.message}`, 'error');
        }
    }

    // Configura Monaco Editor
    async setupMonaco() {
        return new Promise((resolve, reject) => {
            require.config({ 
                paths: { 
                    'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' 
                } 
            });

            require(['vs/editor/editor.main'], () => {
                try {
                    // Registra linguagem Lua customizada
                    monaco.languages.register({ id: 'lua' });
                    
                    // Define syntax highlighting para Lua
                    monaco.languages.setMonarchTokensProvider('lua', {
                        keywords: [
                            'and', 'break', 'do', 'else', 'elseif', 'end', 'false',
                            'for', 'function', 'if', 'in', 'local', 'nil', 'not',
                            'or', 'repeat', 'return', 'then', 'true', 'until', 'while'
                        ],
                        
                        typeKeywords: [
                            'workspace', 'game', 'Create', 'Instance', 'Color', 'Font',
                            'Vector2', 'Event', 'task', 'Plugin'
                        ],
                        
                        operators: [
                            '+', '-', '*', '/', '%', '^', '#',
                            '==', '~=', '<=', '>=', '<', '>',
                            '=', '(', ')', '{', '}', '[', ']',
                            ';', ':', ',', '.', '..', '...'
                        ],
                        
                        tokenizer: {
                            root: [
                                [/[a-zA-Z_]\w*/, {
                                    cases: {
                                        '@keywords': 'keyword',
                                        '@typeKeywords': 'type',
                                        '@default': 'identifier'
                                    }
                                }],
                                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                                [/'([^'\\]|\\.)*$/, 'string.invalid'],
                                [/"/, 'string', '@string_double'],
                                [/'/, 'string', '@string_single'],
                                [/\d+\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                                [/0[xX][\da-fA-F]+/, 'number.hex'],
                                [/\d+/, 'number'],
                                [/--\[\[/, 'comment', '@comment'],
                                [/--.*$/, 'comment'],
                            ],
                            
                            comment: [
                                [/[^\]]+/, 'comment'],
                                [/\]\]/, 'comment', '@pop'],
                                [/[\]]/, 'comment']
                            ],
                            
                            string_double: [
                                [/[^\\"]+/, 'string'],
                                [/\\./, 'string.escape'],
                                [/"/, 'string', '@pop']
                            ],
                            
                            string_single: [
                                [/[^\\']+/, 'string'],
                                [/\\./, 'string.escape'],
                                [/'/, 'string', '@pop']
                            ]
                        }
                    });
                    
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    createDefaultTab() {
        const defaultCode = `-- Fire Server - Script de Exemplo
-- Criando uma página simples

-- Localiza a página principal
local page = workspace:FindFirstChild("Site")
if page then
    local menu = page:FindFirstChild("MainMenu")
    if menu then
        local homepage = menu:FindFirstChild("HomePage")
        if homepage then
            print("✅ Página encontrada!")
            
            -- Define cor de fundo da página
            homepage.BackgroundColor = {r = 245, g = 245, b = 250}
            
            print("✅ Página configurada!")
        end
    end
end

print("🔥 Fire Server está funcionando!")
print("Execute o código com o botão Testar")
`;

        this.createTab('Script1', defaultCode);
    }

    createTab(name, code = '') {
        const tabId = FireUtils.generateID();
        
        // Cria container para o editor desta tab
        const editorContainer = document.createElement('div');
        editorContainer.id = `editor-${tabId}`;
        editorContainer.style.width = '100%';
        editorContainer.style.height = '100%';
        editorContainer.style.display = 'none';
        
        // Por enquanto, adiciona ao preview area (vamos ajustar depois)
        const previewArea = document.getElementById('previewArea');
        previewArea.appendChild(editorContainer);
        
        // Cria instância do Monaco para esta tab
        const editor = monaco.editor.create(editorContainer, {
            value: code,
            language: 'lua',
            theme: FireConfig.monaco.theme,
            fontSize: FireConfig.monaco.fontSize,
            lineNumbers: FireConfig.monaco.lineNumbers,
            minimap: FireConfig.monaco.minimap,
            automaticLayout: FireConfig.monaco.automaticLayout,
            scrollBeyondLastLine: FireConfig.monaco.scrollBeyondLastLine,
            wordWrap: FireConfig.monaco.wordWrap
        });
        
        // Armazena tab
        this.tabs.set(tabId, {
            id: tabId,
            name: name,
            editor: editor,
            container: editorContainer,
            code: code
        });
        
        // Adiciona tab na UI
        this.addTabToUI(tabId, name);
        
        // Ativa esta tab
        this.switchTab(tabId);
        
        // Setup auto-save
        editor.onDidChangeModelContent(FireUtils.debounce(() => {
            const tab = this.tabs.get(tabId);
            if (tab) {
                tab.code = editor.getValue();
            }
        }, 500));
        
        return tabId;
    }

    addTabToUI(tabId, name) {
        const tabList = document.getElementById('tabList');
        
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.tab = tabId;
        
        const icon = document.createElement('span');
        icon.className = 'tab-icon';
        icon.textContent = '📜';
        
        const tabName = document.createElement('span');
        tabName.className = 'tab-name';
        tabName.textContent = name;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'tab-close';
        closeBtn.textContent = '×';
        closeBtn.title = 'Fechar';
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(tabId);
        });
        
        tab.addEventListener('click', () => {
            this.switchTab(tabId);
        });
        
        tab.appendChild(icon);
        tab.appendChild(tabName);
        tab.appendChild(closeBtn);
        
        tabList.appendChild(tab);
    }

    switchTab(tabId) {
        const tab = this.tabs.get(tabId);
        if (!tab) return;
        
        // Esconde todas as tabs
        this.tabs.forEach(t => {
            t.container.style.display = 'none';
        });
        
        // Mostra esta tab
        tab.container.style.display = 'block';
        
        // Atualiza UI
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        this.currentTab = tabId;
        this.editor = tab.editor;
        
        // Força layout do Monaco
        tab.editor.layout();
    }

    closeTab(tabId) {
        const tab = this.tabs.get(tabId);
        if (!tab) return;
        
        // Não permite fechar a última tab
        if (this.tabs.size === 1) {
            FireUtils.log('Não é possível fechar a última aba', 'warning');
            return;
        }
        
        // Remove editor
        tab.editor.dispose();
        tab.container.remove();
        
        // Remove da UI
        document.querySelector(`[data-tab="${tabId}"]`).remove();
        
        // Remove do mapa
        this.tabs.delete(tabId);
        
        // Ativa outra tab
        const firstTab = this.tabs.keys().next().value;
        this.switchTab(firstTab);
    }

    setupUI() {
        // Preview inicial
        const preview = document.getElementById('previewFrame');
        preview.srcdoc = this.getPreviewHTML();
    }

    getPreviewHTML() {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
        }
        .preview-message {
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="preview-message">
        <h2>👀 Preview</h2>
        <p>Execute seu script para ver o resultado aqui</p>
    </div>
</body>
</html>
        `;
    }

    setupEventListeners() {
        // Botão de teste
        document.getElementById('testBtn').addEventListener('click', () => this.runScript());
        
        // Botão de parar
        document.getElementById('stopBtn').addEventListener('click', () => this.stopScript());
        
        // Botão de salvar
        document.getElementById('saveBtn').addEventListener('click', () => this.saveProject());
        
        // Nova tab
        document.getElementById('newTab').addEventListener('click', () => {
            const name = `Script${this.tabs.size + 1}`;
            this.createTab(name);
        });
        
        // Configurações
        document.getElementById('settingsBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.add('active');
        });
        
        // Fechar modals
        document.querySelectorAll('.modal-close, #cancelSettings').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });
        
        // IA Assistant
        document.getElementById('aiAssistant').addEventListener('click', () => {
            document.getElementById('aiModal').classList.add('active');
        });
        
        // Voltar ao menu
        document.getElementById('backToMenu').addEventListener('click', () => {
            if (confirm('Deseja voltar ao menu? Alterações não salvas serão perdidas.')) {
                window.location.href = '../index.html';
            }
        });
        
        // Discord
        document.getElementById('discordBtn').addEventListener('click', () => {
            window.open('https://discord.gg/fireserver', '_blank');
        });
        
        // Limpar output
        document.getElementById('clearOutput').addEventListener('click', () => {
            document.getElementById('outputContent').innerHTML = '';
        });
    }

    async runScript() {
        if (this.isRunning) {
            FireUtils.log('Script já está em execução', 'warning');
            return;
        }
        
        const tab = this.tabs.get(this.currentTab);
        if (!tab) return;
        
        const code = tab.editor.getValue();
        
        this.isRunning = true;
        document.getElementById('testBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        
        FireUtils.log('Executando script...', 'info');
        
        try {
            // Aqui vai a integração com Fengari (próximo passo)
            // Por enquanto, apenas simula
            await this.executeLuaCode(code);
            
            FireUtils.log('Script executado com sucesso!', 'success');
        } catch (error) {
            FireUtils.log(`Erro: ${error.message}`, 'error');
        } finally {
            this.isRunning = false;
            document.getElementById('testBtn').disabled = false;
            document.getElementById('stopBtn').disabled = true;
        }
    }

    async executeLuaCode(code) {
        try {
            // Configura callback de output
            luaSandbox.setOutputCallback((message, type) => {
                FireUtils.log(message, type);
            });

            // Executa código Lua
            const result = await luaSandbox.execute(code);

            if (result.success) {
                FireUtils.log('✅ Código executado', 'success');
                
                // Renderiza resultado no preview
                fireRenderer.render();
            }
            
            return result;
            
        } catch (error) {
            throw error;
        }
    }

    stopScript() {
        this.isRunning = false;
        document.getElementById('testBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        FireUtils.log('Script parado', 'warning');
    }

    saveProject() {
        const data = {
            workspace: workspace.toJSON(),
            tabs: Array.from(this.tabs.values()).map(tab => ({
                name: tab.name,
                code: tab.code
            }))
        };
        
        localStorage.setItem(FireConfig.storage.currentProject, JSON.stringify(data));
        FireUtils.log('Projeto salvo com sucesso!', 'success');
    }

    loadProject() {
        const saved = localStorage.getItem(FireConfig.storage.currentProject);
        if (!saved) return;
        
        try {
            const data = JSON.parse(saved);
            
            // Restaura workspace
            workspace.fromJSON(data.workspace);
            
            // Restaura tabs
            this.tabs.forEach(tab => this.closeTab(tab.id));
            data.tabs.forEach(tabData => {
                this.createTab(tabData.name, tabData.code);
            });
            
            this.updateExplorer();
            FireUtils.log('Projeto carregado com sucesso!', 'success');
        } catch (error) {
            FireUtils.log(`Erro ao carregar projeto: ${error.message}`, 'error');
        }
    }

    updateExplorer() {
        const tree = document.getElementById('explorerTree');
        tree.innerHTML = '';
        
        const buildTree = (instance, parentElement, level = 0) => {
            const item = document.createElement('div');
            item.className = 'tree-item';
            item.style.paddingLeft = `${level * 20}px`;
            if (this.selectedInstance === instance) {
                item.classList.add('selected');
            }
            
            const icon = document.createElement('span');
            icon.className = 'tree-item-icon';
            icon.textContent = FireConfig.componentIcons[instance.className] || '📦';
            
            const name = document.createElement('span');
            name.className = 'tree-item-name';
            name.textContent = instance.Name;
            
            const addBtn = document.createElement('button');
            addBtn.className = 'tree-item-add';
            addBtn.textContent = '🔵';
            addBtn.title = 'Adicionar filho';
            
            item.appendChild(icon);
            item.appendChild(name);
            item.appendChild(addBtn);
            
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectInstance(instance);
            });
            
            parentElement.appendChild(item);
            
            // Renderiza filhos
            for (const child of instance.children) {
                buildTree(child, parentElement, level + 1);
            }
        };
        
        for (const child of workspace.children) {
            buildTree(child, tree);
        }
    }

    selectInstance(instance) {
        this.selectedInstance = instance;
        this.updateExplorer();
        this.updateProperties(instance);
    }

    updateProperties(instance) {
        const props = document.getElementById('propertiesContent');
        props.innerHTML = '';
        
        if (!instance) {
            props.innerHTML = '<p class="no-selection">Nenhum objeto selecionado</p>';
            return;
        }
        
        // Nome
        const nameGroup = this.createPropertyGroup('Básico');
        nameGroup.appendChild(this.createPropertyInput('Nome', instance.Name, 'text', (value) => {
            instance.Name = value;
            this.updateExplorer();
        }));
        props.appendChild(nameGroup);
        
        // Outras propriedades baseadas no tipo
        if (instance.Text !== undefined) {
            const textGroup = this.createPropertyGroup('Texto');
            textGroup.appendChild(this.createPropertyInput('Texto', instance.Text, 'text', (value) => {
                instance.Text = value;
            }));
            props.appendChild(textGroup);
        }
        
        // Mais propriedades serão adicionadas...
    }

    createPropertyGroup(title) {
        const group = document.createElement('div');
        group.className = 'property-group';
        
        const groupTitle = document.createElement('div');
        groupTitle.className = 'property-group-title';
        groupTitle.textContent = title;
        
        group.appendChild(groupTitle);
        return group;
    }

    createPropertyInput(label, value, type, onChange) {
        const item = document.createElement('div');
        item.className = 'property-item';
        
        const labelEl = document.createElement('label');
        labelEl.className = 'property-label';
        labelEl.textContent = label;
        
        const input = document.createElement('input');
        input.className = 'property-input';
        input.type = type;
        input.value = value;
        
        input.addEventListener('input', (e) => {
            onChange(e.target.value);
        });
        
        item.appendChild(labelEl);
        item.appendChild(input);
        
        return item;
    }
}

// Inicializa quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.fireEditor = new FireEditor();
    });
} else {
    window.fireEditor = new FireEditor();
}
