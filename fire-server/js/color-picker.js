/**
 * Fire Server Color Picker
 * Seletor de cores visual integrado ao editor
 */

class FireColorPicker {
    constructor(editor) {
        this.editor = editor;
        this.currentWidget = null;
        this.currentLine = null;
        this.currentMatch = null;
        this.init();
    }

    /**
     * Inicializa o color picker
     */
    init() {
        this.createStyles();
        this.attachToEditor();
    }

    /**
     * Cria estilos do color picker
     */
    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fire-color-widget {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid #333;
                border-radius: 4px;
                cursor: pointer;
                vertical-align: middle;
                margin: 0 5px;
                position: relative;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                transition: transform 0.2s;
            }

            .fire-color-widget:hover {
                transform: scale(1.2);
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }

            .fire-color-picker-popup {
                position: absolute;
                background: white;
                border: 1px solid #ccc;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 8px 16px rgba(0,0,0,0.3);
                z-index: 10000;
                min-width: 280px;
            }

            .fire-color-picker-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }

            .fire-color-picker-title {
                font-weight: bold;
                color: #333;
            }

            .fire-color-picker-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .fire-color-picker-close:hover {
                background: #f0f0f0;
                color: #333;
            }

            .fire-color-input-group {
                margin-bottom: 15px;
            }

            .fire-color-input-group label {
                display: block;
                margin-bottom: 5px;
                font-size: 12px;
                color: #666;
                font-weight: 500;
            }

            .fire-color-picker-native {
                width: 100%;
                height: 50px;
                border: 2px solid #ddd;
                border-radius: 6px;
                cursor: pointer;
                transition: border-color 0.2s;
            }

            .fire-color-picker-native:hover {
                border-color: #999;
            }

            .fire-color-hex-input {
                width: 100%;
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            .fire-color-hex-input:focus {
                outline: none;
                border-color: #4444FF;
            }

            .fire-color-presets {
                margin-top: 15px;
            }

            .fire-color-presets-label {
                font-size: 12px;
                color: #666;
                margin-bottom: 8px;
                display: block;
                font-weight: 500;
            }

            .fire-color-presets-grid {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 6px;
            }

            .fire-color-preset {
                width: 28px;
                height: 28px;
                border: 2px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .fire-color-preset:hover {
                transform: scale(1.15);
                border-color: #333;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .fire-color-picker-actions {
                margin-top: 15px;
                display: flex;
                gap: 8px;
            }

            .fire-color-picker-btn {
                flex: 1;
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                font-size: 14px;
                transition: all 0.2s;
            }

            .fire-color-picker-btn-primary {
                background: #4444FF;
                color: white;
            }

            .fire-color-picker-btn-primary:hover {
                background: #3333DD;
            }

            .fire-color-picker-btn-secondary {
                background: #f0f0f0;
                color: #333;
            }

            .fire-color-picker-btn-secondary:hover {
                background: #e0e0e0;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Anexa ao editor
     */
    attachToEditor() {
        this.editor.on('renderLine', (cm, line, element) => {
            this.renderColorWidgets(cm, line, element);
        });

        // Atualizar quando o código mudar
        this.editor.on('change', () => {
            this.editor.refresh();
        });
    }

    /**
     * Renderiza widgets de cor nas linhas
     */
    renderColorWidgets(cm, line, element) {
        const lineNumber = cm.getLineNumber(line);
        if (lineNumber === null) return;

        const text = line.text;
        const colorRegex = /(color|backcolor)\s*\(\s*["']?\s*(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})\s*["']?\s*\)/g;
        
        let match;
        while ((match = colorRegex.exec(text)) !== null) {
            const [fullMatch, funcName, colorValue] = match;
            const startPos = match.index + match[0].indexOf(colorValue);
            
            // Criar widget
            this.createColorWidget(cm, lineNumber, startPos, colorValue, funcName);
        }
    }

    /**
     * Cria widget de cor
     */
    createColorWidget(cm, line, ch, color, funcName) {
        const widget = document.createElement('span');
        widget.className = 'fire-color-widget';
        widget.style.backgroundColor = color;
        widget.title = `Clique para alterar a cor (${funcName})`;
        
        widget.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openColorPicker(cm, line, ch, color, funcName);
        });

        // Adicionar widget na posição correta
        const pos = { line, ch };
        cm.setBookmark(pos, { widget, insertLeft: false });
    }

    /**
     * Abre o popup do color picker
     */
    openColorPicker(cm, line, ch, currentColor, funcName) {
        // Fechar popup anterior
        this.closeColorPicker();

        // Criar popup
        const popup = document.createElement('div');
        popup.className = 'fire-color-picker-popup';
        
        popup.innerHTML = `
            <div class="fire-color-picker-header">
                <span class="fire-color-picker-title">Escolher Cor</span>
                <button class="fire-color-picker-close">×</button>
            </div>
            
            <div class="fire-color-input-group">
                <label>Seletor de Cor</label>
                <input type="color" class="fire-color-picker-native" value="${currentColor}">
            </div>
            
            <div class="fire-color-input-group">
                <label>Código Hexadecimal</label>
                <input type="text" class="fire-color-hex-input" value="${currentColor}" placeholder="#000000">
            </div>
            
            <div class="fire-color-presets">
                <span class="fire-color-presets-label">Cores Predefinidas</span>
                <div class="fire-color-presets-grid">
                    ${this.getPresetColors().map(color => 
                        `<div class="fire-color-preset" style="background-color: ${color}" data-color="${color}"></div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="fire-color-picker-actions">
                <button class="fire-color-picker-btn fire-color-picker-btn-secondary" data-action="cancel">Cancelar</button>
                <button class="fire-color-picker-btn fire-color-picker-btn-primary" data-action="apply">Aplicar</button>
            </div>
        `;

        // Posicionar popup
        const coords = cm.charCoords({ line, ch }, 'local');
        popup.style.top = (coords.bottom + 5) + 'px';
        popup.style.left = coords.left + 'px';

        // Adicionar ao DOM
        cm.getWrapperElement().appendChild(popup);

        // Event listeners
        const nativeInput = popup.querySelector('.fire-color-picker-native');
        const hexInput = popup.querySelector('.fire-color-hex-input');
        const closeBtn = popup.querySelector('.fire-color-picker-close');
        const cancelBtn = popup.querySelector('[data-action="cancel"]');
        const applyBtn = popup.querySelector('[data-action="apply"]');
        const presets = popup.querySelectorAll('.fire-color-preset');

        // Sincronizar inputs
        nativeInput.addEventListener('input', (e) => {
            hexInput.value = e.target.value;
        });

        hexInput.addEventListener('input', (e) => {
            let value = e.target.value;
            if (!value.startsWith('#')) value = '#' + value;
            if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                nativeInput.value = value;
            }
        });

        // Presets
        presets.forEach(preset => {
            preset.addEventListener('click', () => {
                const color = preset.dataset.color;
                nativeInput.value = color;
                hexInput.value = color;
            });
        });

        // Botões
        closeBtn.addEventListener('click', () => this.closeColorPicker());
        cancelBtn.addEventListener('click', () => this.closeColorPicker());
        applyBtn.addEventListener('click', () => {
            this.applyColor(cm, line, ch, hexInput.value, funcName);
            this.closeColorPicker();
        });

        this.currentWidget = popup;
    }

    /**
     * Fecha o color picker
     */
    closeColorPicker() {
        if (this.currentWidget) {
            this.currentWidget.remove();
            this.currentWidget = null;
        }
    }

    /**
     * Aplica a cor selecionada
     */
    applyColor(cm, line, ch, newColor, funcName) {
        const lineText = cm.getLine(line);
        const regex = new RegExp(`(${funcName}\\s*\\(\\s*["']?)\\s*#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}\\s*(["']?\\s*\\))`);
        
        const newText = lineText.replace(regex, `$1${newColor}$2`);
        
        cm.replaceRange(newText, { line, ch: 0 }, { line, ch: lineText.length });
        cm.refresh();
    }

    /**
     * Cores predefinidas
     */
    getPresetColors() {
        return [
            '#FF4444', '#FF6B6B', '#FF8C00', '#FFD700',
            '#FFFF44', '#90EE90', '#44FF44', '#00CED1',
            '#4444FF', '#6A5ACD', '#9B4DCA', '#FF69B4',
            '#FF1493', '#DC143C', '#8B4513', '#2F4F4F',
            '#000000', '#333333', '#666666', '#999999',
            '#CCCCCC', '#EEEEEE', '#FFFFFF', '#F0F0F0'
        ];
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FireColorPicker;
}
