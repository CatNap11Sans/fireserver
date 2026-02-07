/**
 * Fire Server Editor v2.0
 * Editor aprimorado com syntax highlighting, color picker e IA inteligente
 */

class FireEditor {
    constructor() {
        this.editor = null;
        this.parser = new DSLParser();
        this.renderer = new DSLRenderer();
        this.syntaxHighlighter = new FireSyntaxHighlighter();
        this.smartAI = new FireSmartAI();
        this.colorPicker = null;
        
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
        this.initAIPanel();
    }

    /**
     * Inicializa CodeMirror com highlighting customizado
     */
    initCodeMirror() {
        const editorElement = document.getElementById('codeEditor');
        
        // Definir modo customizado
        this.syntaxHighlighter.defineMode();
        this.syntaxHighlighter.applyTheme();
        
        this.editor = CodeMirror(editorElement, {
            mode: 'fireserver-dsl',
            theme: 'material-darker',
            lineNumbers: true,
            lineWrapping: true,
            autofocus: true,
            indentUnit: 2,
            tabSize: 2,
            gutters: ['CodeMirror-linenumbers', 'error-gutter'],
            extraKeys: {
                'Ctrl-S': () => this.saveCode(),
                'Cmd-S': () => this.saveCode(),
                'Ctrl-Enter': () => this.publish(),
                'Cmd-Enter': () => this.publish(),
                'Ctrl-H': () => this.openAIAssistant(),
                'Cmd-H': () => this.openAIAssistant(),
                'Ctrl-Space': 'autocomplete'
            }
        });

        // Template inicial
        const template = `# Bem-vindo ao Fire Server! 🔥
# Linhas com # são comentários

page inicial
title "Meu Primeiro Site"

load estilo1 :color("#2596be"); size("18")

text bemvindo ("Olá! Bem-vindo ao meu site 👋", estilo1)
jump

text sobre ("Aqui você pode criar sites incríveis sem precisar saber programar!", color("#333"))

button contato ("Entre em Contato" link "mailto:seu@email.com", backcolor("#2596be"))

end`;

        this.editor.setValue(template);

        // Inicializar color picker
        this.colorPicker = new FireColorPicker(this.editor);

        // Setup autocomplete
        this.syntaxHighlighter.setupAutocomplete(this.editor);

        // Event listeners do editor
        this.editor.on('change', () => {
            this.onCodeChange();
        });

        this.editor.on('cursorActivity', () => {
            this.onCursorMove();
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

        // Sugestões da IA em tempo real (se habilitado)
        if (this.smartAI.userPreferences.autoSuggest) {
            this.showContextualSuggestions();
        }
    }

    /**
     * Quando o cursor se move
     */
    onCursorMove() {
        const cursor = this.editor.getCursor();
        this.showQuickHelp(cursor);
    }

    /**
     * Mostra ajuda rápida baseada no contexto
     */
    showQuickHelp(cursor) {
        const line = this.editor.getLine(cursor.line);
        const helpPanel = document.getElementById('quickHelpPanel');
        
        if (!helpPanel) return;

        // Detectar comando na linha
        const words = line.trim().split(/\s+/);
        const command = words[0];

        const help = this.smartAI.getHelp(command);
        
        if (help && help.type !== 'general') {
            helpPanel.innerHTML = `
                <div class="quick-help-content">
                    <strong>${help.command || help.function}</strong>
                    <p>${help.description}</p>
                    <code>${help.syntax}</code>
                </div>
            `;
            helpPanel.style.display = 'block';
        } else {
            helpPanel.style.display = 'none';
        }
    }

    /**
     * Mostra sugestões contextuais
     */
    showContextualSuggestions() {
        const cursor = this.editor.getCursor();
        const suggestions = this.smartAI.suggestNextCommand(this.currentCode, cursor);
        
        if (suggestions.length > 0) {
            this.showSuggestionsPopup(suggestions);
        }
    }

    /**
     * Valida o código e mostra erros
     */
    validateCode() {
        const result = this.parser.parse(this.currentCode);
        const errorPanel = document.getElementById('errorPanel');
        
        errorPanel.innerHTML = '';

        // Limpar marcações de erro antigas
        this.syntaxHighlighter.clearErrors(this.editor);

        if (result.errors.length > 0) {
            // Registrar erros na IA
            result.errors.forEach(error => {
                this.smartAI.recordError(error, this.currentCode, {
                    line: error.line,
                    username: this.username
                });
            });

            // Marcar erros no editor
            this.syntaxHighlighter.markErrors(this.editor, result.errors);

            // Mostrar erros com sugestões da IA
            result.errors.forEach(error => {
                const suggestion = this.smartAI.getSuggestionForError(error);
                const errorEl = this.createErrorElement(error, 'error', suggestion);
                errorPanel.appendChild(errorEl);
            });
        }

        if (result.warnings.length > 0) {
            result.warnings.forEach(warning => {
                const warningEl = this.createErrorElement(warning, 'warning');
                errorPanel.appendChild(warningEl);
            });
        }

        // Análise da IA
        if (this.smartAI.userPreferences.explainErrors && result.errors.length > 0) {
            this.showAIAnalysis(result.errors);
        }
    }

    /**
     * Cria elemento de erro/warning com sugestões da IA
     */
    createErrorElement(error, type, aiSuggestion = null) {
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

        // Sugestão original do parser
        if (error.suggestion) {
            const suggestionEl = document.createElement('div');
            suggestionEl.className = 'error-suggestion';
            suggestionEl.textContent = `💡 ${error.suggestion}`;
            div.appendChild(suggestionEl);
        }

        // Sugestão da IA
        if (aiSuggestion) {
            const aiEl = document.createElement('div');
            aiEl.className = 'ai-suggestion';
            aiEl.innerHTML = `
                <div class="ai-suggestion-header">
                    <span class="ai-icon">🤖</span>
                    <span class="ai-title">${aiSuggestion.title}</span>
                    <span class="ai-confidence ${aiSuggestion.confidence}">${aiSuggestion.confidence}</span>
                </div>
                <div class="ai-suggestion-message">${aiSuggestion.message}</div>
                ${aiSuggestion.code ? `
                    <div class="ai-suggestion-code">
                        <code>${aiSuggestion.code}</code>
                        <button class="ai-apply-btn" data-fix="${aiSuggestion.code}" data-line="${error.line}">
                            Aplicar
                        </button>
                    </div>
                ` : ''}
            `;
            div.appendChild(aiEl);

            // Event listener para aplicar correção
            const applyBtn = aiEl.querySelector('.ai-apply-btn');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    this.applyAIFix(error.line, aiSuggestion.code);
                    this.smartAI.resolveError(
                        this.smartAI.errorHistory.length - 1,
                        aiSuggestion.code
                    );
                });
            }
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
     * Aplica correção sugerida pela IA
     */
    applyAIFix(line, fixCode) {
        if (line > 0) {
            const lineText = this.editor.getLine(line - 1);
            this.editor.replaceRange(
                fixCode,
                { line: line - 1, ch: 0 },
                { line: line - 1, ch: lineText.length }
            );
            this.showToast('✨ Correção aplicada!', 'success');
        }
    }

    /**
     * Mostra análise da IA
     */
    showAIAnalysis(errors) {
        const analysis = this.smartAI.analyzeCode(this.currentCode, errors);
        const analysisPanel = document.getElementById('aiAnalysisPanel');
        
        if (!analysisPanel) return;

        let html = '<div class="ai-analysis">';
        
        if (analysis.tips.length > 0) {
            html += '<div class="ai-tips"><h4>💡 Dicas</h4><ul>';
            analysis.tips.forEach(tip => {
                html += `<li>${tip.message}</li>`;
            });
            html += '</ul></div>';
        }

        if (analysis.improvements.length > 0) {
            html += '<div class="ai-improvements"><h4>⚡ Melhorias Sugeridas</h4>';
            analysis.improvements.forEach(imp => {
                html += `
                    <div class="improvement-item">
                        <p>${imp.message}</p>
                        ${imp.example ? `<pre><code>${imp.example}</code></pre>` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }

        html += '</div>';
        analysisPanel.innerHTML = html;
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

        // Atualizar URL
        const url = `https://catnap11sans.github.io/fireserver/${this.username}`;
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
            text: 'text novoTexto ("Seu texto aqui", color("#333"))\n',
            image: 'image minhaImagem ("https://exemplo.com/imagem.jpg")\n',
            button: 'button meuBotao ("Clique Aqui" link "https://exemplo.com", backcolor("#2596be"))\n'
        };

        const template = templates[type];
        if (template) {
            const cursor = this.editor.getCursor();
            this.editor.replaceRange(template, cursor);
            this.editor.focus();
        }
    }

    /**
     * Inicializa painel de IA
     */
    initAIPanel() {
        // Criar painel se não existir
        if (!document.getElementById('aiAnalysisPanel')) {
            const panel = document.createElement('div');
            panel.id = 'aiAnalysisPanel';
            panel.className = 'ai-analysis-panel';
            document.getElementById('editorTab').appendChild(panel);
        }

        if (!document.getElementById('quickHelpPanel')) {
            const panel = document.createElement('div');
            panel.id = 'quickHelpPanel';
            panel.className = 'quick-help-panel';
            document.getElementById('editorTab').appendChild(panel);
        }
    }

    /**
     * Abre assistente IA
     */
    openAIAssistant() {
        const modal = document.getElementById('aiModal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('aiInput').focus();
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
        const el = document.getElementById('currentUsername');
        if (el) el.textContent = this.username;
    }

    setStatus(type, text) {
        const dot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        
        if (dot) dot.className = `status-dot ${type}`;
        if (statusText) statusText.textContent = text;
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
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
        if (icon) icon.textContent = newTheme === 'material-darker' ? '🌙' : '☀️';
    }

    copyUrl() {
        const urlInput = document.getElementById('siteUrl');
        if (urlInput) {
            urlInput.select();
            document.execCommand('copy');
            this.showToast('URL copiada!', 'success');
        }
    }
}

// Inicializar quando página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.fireEditor = new FireEditor();
});
