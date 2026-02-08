/**
 * Fire Server Editor
 * Gerencia o editor de código, preview e interações
 */

class FireEditor {
    constructor() {
        this.editor = null;
        this.parser = new DSLParser();
        this.renderer = new DSLRenderer();
        this.currentCode = '';
        this.autoSaveTimer = null;
        this.previewDebounceTimer = null;
        this.username = this.getUsername();
        
        this.init();
    }

    /**
     * Inicializa o editor
     */
    init() {
        this.initCodeMirror();
        this.initEventListeners();
        this.loadSavedCode();
        this.updateStats();
        this.showUsername();
    }

    /**
     * Inicializa CodeMirror
     */
    initCodeMirror() {
        const editorElement = document.getElementById('codeEditor');
        
        this.editor = CodeMirror(editorElement, {
            mode: 'text/plain',
            theme: 'material-darker',
            lineNumbers: true,
            lineWrapping: true,
            autofocus: true,
            indentUnit: 2,
            tabSize: 2,
            extraKeys: {
                'Ctrl-S': () => this.saveCode(),
                'Cmd-S': () => this.saveCode(),
                'Ctrl-Enter': () => this.publish(),
                'Cmd-Enter': () => this.publish(),
                'Ctrl-H': () => this.openAIAssistant(),
                'Cmd-H': () => this.openAIAssistant()
            }
        });

        // Template inicial
        const template = `# Bem-vindo ao Fire Server! 🔥
# Linhas com # são comentários

page inicial
title "Meu Primeiro Site"

text bemvindo ("Olá! Bem-vindo ao meu site 👋")
jump

text sobre ("Aqui você pode criar sites incríveis sem precisar saber programar!")

button contato ("Entre em Contato" link "mailto:seu@email.com")

end`;

        this.editor.setValue(template);

        // Event listeners do editor
        this.editor.on('change', () => {
            this.onCodeChange();
        });
    }

    /**
     * Event listeners gerais
     */
    initEventListeners() {
        // Tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Botões do header
        document.getElementById('saveBtn').addEventListener('click', () => this.saveCode());
        document.getElementById('publishBtn').addEventListener('click', () => this.publish());
        document.getElementById('toggleTheme').addEventListener('click', () => this.toggleTheme());

        // Toolbar
        document.getElementById('newPageBtn').addEventListener('click', () => this.insertTemplate('page'));
        document.getElementById('addTextBtn').addEventListener('click', () => this.insertTemplate('text'));
        document.getElementById('addImageBtn').addEventListener('click', () => this.insertTemplate('image'));
        document.getElementById('addButtonBtn').addEventListener('click', () => this.insertTemplate('button'));

        // Configurações
        document.getElementById('autoSave').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.startAutoSave();
            } else {
                this.stopAutoSave();
            }
        });

        document.getElementById('livePreview').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.updatePreview();
            }
        });

        document.getElementById('showLineNumbers').addEventListener('change', (e) => {
            this.editor.setOption('lineNumbers', e.target.checked);
        });

        // IA
        document.getElementById('aiHelpBtn').addEventListener('click', () => this.openAIAssistant());

        // Preview devices
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.addEventListener('click', () => this.changeDevice(btn.dataset.device));
        });

        // Output
        document.getElementById('copyUrlBtn').addEventListener('click', () => this.copyUrl());

        // Auto-save por padrão
        this.startAutoSave();
    }

    /**
     * Quando o código muda
     */
    onCodeChange() {
        this.currentCode = this.editor.getValue();
        this.updateStats();
        this.validateCode();
        
        // Preview com debounce
        if (document.getElementById('livePreview').checked) {
            clearTimeout(this.previewDebounceTimer);
            this.previewDebounceTimer = setTimeout(() => {
                this.updatePreview();
            }, 500);
        }

        // Marcar como não salvo
        this.setStatus('unsaved', 'Não salvo');
    }

    /**
     * Valida o código e mostra erros
     */
    validateCode() {
        const result = this.parser.parse(this.currentCode);
        const errorPanel = document.getElementById('errorPanel');
        
        errorPanel.innerHTML = '';

        if (result.errors.length > 0) {
            result.errors.forEach(error => {
                const errorEl = this.createErrorElement(error, 'error');
                errorPanel.appendChild(errorEl);
            });
        }

        if (result.warnings.length > 0) {
            result.warnings.forEach(warning => {
                const warningEl = this.createErrorElement(warning, 'warning');
                errorPanel.appendChild(warningEl);
            });
        }
    }

    /**
     * Cria elemento de erro/warning
     */
    createErrorElement(error, type) {
        const div = document.createElement('div');
        div.className = `error-item ${type}`;

        if (error.line > 0) {
            const lineEl = document.createElement('div');
            lineEl.className = 'error-line';
            lineEl.textContent = `Linha ${error.line}`;
            div.appendChild(lineEl);
        }

        const messageEl = document.createElement('div');
        messageEl.className = 'error-message';
        messageEl.textContent = error.message;
        div.appendChild(messageEl);

        if (error.suggestion) {
            const suggestionEl = document.createElement('div');
            suggestionEl.className = 'error-suggestion';
            suggestionEl.textContent = `💡 ${error.suggestion}`;
            div.appendChild(suggestionEl);
        }

        // Clicar no erro leva à linha
        if (error.line > 0) {
            div.style.cursor = 'pointer';
            div.addEventListener('click', () => {
                this.editor.setCursor(error.line - 1, 0);
                this.editor.focus();
            });
        }

        return div;
    }

    /**
     * Atualiza preview
     */
    updatePreview() {
        const result = this.parser.parse(this.currentCode);
        
        if (!result.ast) {
            return; // Há erros, não atualizar preview
        }

        const previewFrame = document.getElementById('previewFrame');
        const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        
        previewDoc.open();
        previewDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview</title>
            </head>
            <body style="margin: 0; padding: 0;">
                <div id="preview-container"></div>
            </body>
            </html>
        `);
        previewDoc.close();

        // Renderizar no iframe
        const container = previewDoc.getElementById('preview-container');
        this.renderer.render(result.ast, container);
    }

    /**
     * Atualiza estatísticas
     */
    updateStats() {
        const lines = this.currentCode.split('\n').length;
        const chars = this.currentCode.length;
        
        document.getElementById('lineCount').textContent = lines;
        document.getElementById('charCount').textContent = chars;

        // Atualizar output stats
        const result = this.parser.parse(this.currentCode);
        if (result.ast) {
            let totalElements = 0;
            let totalImages = 0;
            
            result.ast.pages.forEach(page => {
                totalElements += page.elements.length;
                page.elements.forEach(el => {
                    if (el.type === 'image') totalImages++;
                });
            });

            document.getElementById('totalElements').textContent = totalElements;
            document.getElementById('totalPages').textContent = result.ast.pages.length;
            document.getElementById('totalImages').textContent = totalImages;
        }
    }

    /**
     * Salva código
     */
    async saveCode() {
        this.setStatus('saving', 'Salvando...');

        try {
            // Validar primeiro
            const result = this.parser.parse(this.currentCode);
            if (result.errors.length > 0) {
                this.showToast('Corrija os erros antes de salvar', 'error');
                this.setStatus('error', 'Erro ao salvar');
                return;
            }

            // Salvar localmente
            localStorage.setItem(`fire_site_${this.username}`, this.currentCode);

            // TODO: Salvar no backend
            // await this.saveToBackend();

            this.setStatus('saved', 'Salvo');
            this.showToast('Código salvo com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            this.setStatus('error', 'Erro ao salvar');
            this.showToast('Erro ao salvar código', 'error');
        }
    }

    /**
     * Publica site
     */
    async publish() {
        await this.saveCode();
        
        const result = this.parser.parse(this.currentCode);
        if (result.errors.length > 0) {
            this.showToast('Corrija os erros antes de publicar', 'error');
            return;
        }

        // TODO: Publicar no backend
        // await this.publishToBackend();

        // Atualizar URL com o caminho correto do GitHub Pages
        const url = FIRE_CONFIG.getUserURL(this.username);
        document.getElementById('siteUrl').value = url;

        // Mudar para tab de output
        this.switchTab('output');

        this.showToast('🎉 Site publicado com sucesso!', 'success');
    }

    /**
     * Insere templates
     */
    insertTemplate(type) {
        const templates = {
            page: '\npage novapagina\ntitle "Nova Página"\n\ntext texto1 ("Conteúdo da página")\n\nend\n',
            text: 'text novoTexto ("Seu texto aqui")\n',
            image: 'image minhaImagem ("https://exemplo.com/imagem.jpg")\n',
            button: 'button meuBotao ("Clique Aqui" link "https://exemplo.com")\n'
        };

        const template = templates[type];
        if (template) {
            const cursor = this.editor.getCursor();
            this.editor.replaceRange(template, cursor);
            this.editor.focus();
        }
    }

    /**
     * Troca de tab
     */
    switchTab(tabName) {
        // Atualizar tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });

        // Atualizar conteúdo
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = {
            editor: 'editorTab',
            preview: 'previewTab',
            output: 'outputTab'
        }[tabName];

        document.getElementById(targetContent).classList.add('active');

        // Atualizar preview se necessário
        if (tabName === 'preview') {
            this.updatePreview();
        }
    }

    /**
     * Muda dispositivo do preview
     */
    changeDevice(device) {
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        const frame = document.getElementById('previewFrame');
        frame.className = device;
    }

    /**
     * Abre assistente IA
     */
    openAIAssistant() {
        document.getElementById('aiModal').classList.add('active');
        document.getElementById('aiInput').focus();
    }

    /**
     * Auto-save
     */
    startAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            if (this.currentCode !== localStorage.getItem(`fire_site_${this.username}`)) {
                this.saveCode();
            }
        }, 30000); // 30 segundos
    }

    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
    }

    /**
     * Carrega código salvo
     */
    loadSavedCode() {
        const saved = localStorage.getItem(`fire_site_${this.username}`);
        if (saved && saved !== this.editor.getValue()) {
            // Perguntar se quer carregar
            if (confirm('Encontramos um código salvo. Deseja carregá-lo?')) {
                this.editor.setValue(saved);
            }
        }
    }

    /**
     * Utilitários
     */
    getUsername() {
        // TODO: Pegar do sistema de autenticação
        return localStorage.getItem('fire_username') || 'usuario';
    }

    showUsername() {
        document.getElementById('currentUsername').textContent = this.username;
    }

    setStatus(type, text) {
        const dot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        
        dot.className = `status-dot ${type}`;
        statusText.textContent = text;
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    toggleTheme() {
        const currentTheme = this.editor.getOption('theme');
        const newTheme = currentTheme === 'material-darker' ? 'default' : 'material-darker';
        this.editor.setOption('theme', newTheme);
        
        const icon = document.getElementById('themeIcon');
        icon.textContent = newTheme === 'material-darker' ? '🌙' : '☀️';
    }

    copyUrl() {
        const urlInput = document.getElementById('siteUrl');
        urlInput.select();
        document.execCommand('copy');
        this.showToast('URL copiada!', 'success');
    }
}

// Inicializar quando página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.fireEditor = new FireEditor();
    window.aiAssistant = new AIAssistant();
});
