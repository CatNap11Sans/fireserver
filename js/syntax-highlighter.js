/**
 * Fire Server Syntax Highlighter
 * Sistema de highlighting customizado para DSL
 */

class FireSyntaxHighlighter {
    constructor() {
        this.colors = {
            page: '#FF4444',        // vermelho
            end: '#FF4444',         // vermelho
            load: '#4444FF',        // azul
            text: '#FFFF44',        // amarelo
            image: '#FF69B4',       // rosa
            button: '#9B4DCA',      // roxo
            divider: '#44FF44',     // verde
            jump: '#44FF44',        // verde
            string: '#8B4513',      // marrom
            function: '#FF00FF',    // magenta
            link: '#4444FF',        // azul
            pageName: '#4444FF',    // azul (para page dentro de button)
            comment: '#808080',     // cinza
            error: '#FF0000'        // vermelho erro
        };
    }

    /**
     * Define o modo CodeMirror customizado
     */
    defineMode() {
        CodeMirror.defineMode('fireserver-dsl', () => {
            return {
                token: (stream, state) => {
                    // Comentários
                    if (stream.match(/^#.*/)) {
                        return 'comment';
                    }

                    // Strings
                    if (stream.match(/"[^"]*"/)) {
                        return 'string';
                    }

                    // Comandos principais
                    if (stream.match(/^page\b/)) {
                        return 'keyword-page';
                    }
                    if (stream.match(/^end\b/)) {
                        return 'keyword-end';
                    }
                    if (stream.match(/^load\b/)) {
                        return 'keyword-load';
                    }
                    if (stream.match(/^text\b/)) {
                        return 'keyword-text';
                    }
                    if (stream.match(/^image\b/)) {
                        return 'keyword-image';
                    }
                    if (stream.match(/^button\b/)) {
                        return 'keyword-button';
                    }
                    if (stream.match(/^divider\b/)) {
                        return 'keyword-divider';
                    }
                    if (stream.match(/^jump\b/)) {
                        return 'keyword-jump';
                    }
                    if (stream.match(/^title\b/)) {
                        return 'keyword-page';
                    }

                    // Funções (loads)
                    if (stream.match(/\b(color|font|backcolor|size|slep|animation)\s*\(/)) {
                        stream.backUp(1); // Volta o parêntese
                        return 'function';
                    }

                    // link e page dentro de button
                    if (stream.match(/\b(link|page)\s+/)) {
                        return 'keyword-link';
                    }

                    // Próximo char
                    stream.next();
                    return null;
                },
                startState: () => ({})
            };
        });
    }

    /**
     * Aplica o tema customizado
     */
    applyTheme() {
        const style = document.createElement('style');
        style.textContent = `
            /* Syntax highlighting customizado */
            .cm-keyword-page { color: ${this.colors.page} !important; font-weight: bold; }
            .cm-keyword-end { color: ${this.colors.end} !important; font-weight: bold; }
            .cm-keyword-load { color: ${this.colors.load} !important; font-weight: bold; }
            .cm-keyword-text { color: ${this.colors.text} !important; font-weight: bold; }
            .cm-keyword-image { color: ${this.colors.image} !important; font-weight: bold; }
            .cm-keyword-button { color: ${this.colors.button} !important; font-weight: bold; }
            .cm-keyword-divider { color: ${this.colors.divider} !important; font-weight: bold; }
            .cm-keyword-jump { color: ${this.colors.jump} !important; font-weight: bold; }
            .cm-keyword-link { color: ${this.colors.link} !important; font-weight: bold; }
            .cm-string { color: ${this.colors.string} !important; }
            .cm-function { color: ${this.colors.function} !important; font-weight: bold; }
            .cm-comment { color: ${this.colors.comment} !important; font-style: italic; }

            /* Linhas com erro */
            .cm-error-line {
                background-color: rgba(255, 0, 0, 0.1);
                border-left: 3px solid ${this.colors.error};
            }

            /* Gutter de linha com erro */
            .cm-error-gutter {
                color: ${this.colors.error};
                cursor: pointer;
            }
            .cm-error-gutter::before {
                content: '⚠️';
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Marca linhas com erro
     */
    markErrors(editor, errors) {
        // Limpar marcações anteriores
        editor.clearGutter('error-gutter');
        
        // Marcar novas
        errors.forEach(error => {
            if (error.line > 0) {
                const line = error.line - 1;
                
                // Adicionar classe à linha
                editor.addLineClass(line, 'background', 'cm-error-line');
                
                // Adicionar marker no gutter
                const marker = document.createElement('div');
                marker.className = 'cm-error-gutter';
                marker.title = error.message;
                marker.addEventListener('click', () => {
                    editor.setCursor(line, 0);
                    editor.focus();
                });
                
                editor.setGutterMarker(line, 'error-gutter', marker);
            }
        });
    }

    /**
     * Limpa todas as marcações de erro
     */
    clearErrors(editor) {
        const lineCount = editor.lineCount();
        for (let i = 0; i < lineCount; i++) {
            editor.removeLineClass(i, 'background', 'cm-error-line');
        }
        editor.clearGutter('error-gutter');
    }

    /**
     * Autocomplete inteligente
     */
    setupAutocomplete(editor) {
        const keywords = [
            'page', 'end', 'load', 'text', 'image', 'button', 
            'divider', 'jump', 'title'
        ];
        
        const functions = [
            'color', 'font', 'backcolor', 'size', 'slep', 'animation'
        ];

        CodeMirror.commands.autocomplete = (cm) => {
            CodeMirror.showHint(cm, () => {
                const cursor = cm.getCursor();
                const token = cm.getTokenAt(cursor);
                const start = token.start;
                const end = cursor.ch;
                const line = cursor.line;
                const currentWord = token.string;

                const list = [...keywords, ...functions].filter(word => 
                    word.startsWith(currentWord.toLowerCase())
                );

                return {
                    list: list.length ? list : keywords,
                    from: CodeMirror.Pos(line, start),
                    to: CodeMirror.Pos(line, end)
                };
            });
        };

        editor.setOption('extraKeys', {
            ...editor.getOption('extraKeys'),
            'Ctrl-Space': 'autocomplete',
            'Tab': (cm) => {
                if (cm.somethingSelected()) {
                    cm.indentSelection('add');
                } else {
                    cm.replaceSelection('  ', 'end');
                }
            }
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FireSyntaxHighlighter;
}
