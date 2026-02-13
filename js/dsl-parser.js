// dsl-parser.js - Parser da linguagem DSL do Fire Server

class DSLParser {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.lineCount = 0;
    }
    
    parse(dslCode) {
        this.errors = [];
        this.warnings = [];
        this.lineCount = 0;
        
        const lines = dslCode.split('\n');
        this.lineCount = lines.length;
        
        // Validar limite de linhas
        if (this.lineCount > CONFIG.MAX_DSL_LINES) {
            this.errors.push({
                line: this.lineCount,
                code: 'MAX_LINES',
                message: CONFIG.ERROR_MESSAGES.MAX_LINES
            });
            return { success: false, errors: this.errors, ast: null };
        }
        
        const ast = {
            type: 'Program',
            body: []
        };
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i + 1;
            
            // Ignorar linhas vazias e comentários
            if (!line || line.startsWith('//') || line.startsWith('#')) {
                continue;
            }
            
            try {
                const node = this.parseLine(line, lineNumber);
                if (node) {
                    ast.body.push(node);
                }
            } catch (error) {
                this.errors.push({
                    line: lineNumber,
                    code: 'PARSE_ERROR',
                    message: error.message,
                    suggestion: error.suggestion
                });
            }
        }
        
        return {
            success: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
            ast: ast
        };
    }
    
    parseLine(line, lineNumber) {
        // Comandos básicos da DSL
        // Formato: COMANDO arg1 arg2 arg3...
        
        const parts = this.tokenize(line);
        if (parts.length === 0) return null;
        
        const command = parts[0].toUpperCase();
        const args = parts.slice(1);
        
        switch (command) {
            case 'PAGE':
                return this.parsePage(args, lineNumber);
            
            case 'TEXT':
                return this.parseText(args, lineNumber);
            
            case 'BUTTON':
                return this.parseButton(args, lineNumber);
            
            case 'IMAGE':
                return this.parseImage(args, lineNumber);
            
            case 'COLOR':
                return this.parseColor(args, lineNumber);
            
            case 'BACKGROUND':
                return this.parseBackground(args, lineNumber);
            
            case 'GRADIENT':
                return this.parseGradient(args, lineNumber);
            
            case 'LINK':
                return this.parseLink(args, lineNumber);
            
            default:
                throw {
                    message: `${CONFIG.ERROR_MESSAGES.INVALID_COMMAND}: ${command}`,
                    suggestion: 'Comandos válidos: PAGE, TEXT, BUTTON, IMAGE, COLOR, BACKGROUND, GRADIENT, LINK'
                };
        }
    }
    
    tokenize(line) {
        const tokens = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"' || char === "'") {
                if (inQuotes && current) {
                    tokens.push(current);
                    current = '';
                }
                inQuotes = !inQuotes;
            } else if (char === ' ' && !inQuotes) {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }
        
        if (current) {
            tokens.push(current);
        }
        
        // Validar aspas fechadas
        if (inQuotes) {
            throw {
                message: CONFIG.ERROR_MESSAGES.UNCLOSED_QUOTES,
                suggestion: 'Certifique-se de fechar todas as aspas'
            };
        }
        
        return tokens;
    }
    
    parsePage(args, lineNumber) {
        if (args.length < 1) {
            throw {
                message: CONFIG.ERROR_MESSAGES.MISSING_ARGS,
                suggestion: 'Uso: PAGE "Nome da Página"'
            };
        }
        
        return {
            type: 'Page',
            name: args[0],
            line: lineNumber
        };
    }
    
    parseText(args, lineNumber) {
        if (args.length < 1) {
            throw {
                message: CONFIG.ERROR_MESSAGES.MISSING_ARGS,
                suggestion: 'Uso: TEXT "Conteúdo do texto"'
            };
        }
        
        const text = args.join(' ');
        
        if (text.length > CONFIG.MAX_TEXT_LENGTH) {
            throw {
                message: CONFIG.ERROR_MESSAGES.MAX_TEXT,
                suggestion: 'Reduza o tamanho do texto'
            };
        }
        
        return {
            type: 'Text',
            content: text,
            line: lineNumber
        };
    }
    
    parseButton(args, lineNumber) {
        if (args.length < 1) {
            throw {
                message: CONFIG.ERROR_MESSAGES.MISSING_ARGS,
                suggestion: 'Uso: BUTTON "Texto do Botão" [URL opcional]'
            };
        }
        
        return {
            type: 'Button',
            text: args[0],
            url: args[1] || null,
            line: lineNumber
        };
    }
    
    parseImage(args, lineNumber) {
        if (args.length < 1) {
            throw {
                message: CONFIG.ERROR_MESSAGES.MISSING_ARGS,
                suggestion: 'Uso: IMAGE "URL da imagem"'
            };
        }
        
        const url = args[0];
        
        // Validar URL
        if (!url.startsWith('https://')) {
            throw {
                message: CONFIG.ERROR_MESSAGES.INVALID_URL,
                suggestion: 'Use URLs que começam com https://'
            };
        }
        
        return {
            type: 'Image',
            url: url,
            alt: args[1] || 'Imagem',
            line: lineNumber
        };
    }
    
    parseColor(args, lineNumber) {
        if (args.length < 1) {
            throw {
                message: CONFIG.ERROR_MESSAGES.MISSING_ARGS,
                suggestion: 'Uso: COLOR #hexadecimal ou COLOR rgb(r,g,b)'
            };
        }
        
        return {
            type: 'Color',
            value: args[0],
            line: lineNumber
        };
    }
    
    parseBackground(args, lineNumber) {
        if (args.length < 1) {
            throw {
                message: CONFIG.ERROR_MESSAGES.MISSING_ARGS,
                suggestion: 'Uso: BACKGROUND #cor ou BACKGROUND "URL"'
            };
        }
        
        return {
            type: 'Background',
            value: args[0],
            line: lineNumber
        };
    }
    
    parseGradient(args, lineNumber) {
        if (args.length < 2) {
            throw {
                message: CONFIG.ERROR_MESSAGES.MISSING_ARGS,
                suggestion: 'Uso: GRADIENT #cor1 #cor2 [#cor3...]'
            };
        }
        
        return {
            type: 'Gradient',
            colors: args,
            line: lineNumber
        };
    }
    
    parseLink(args, lineNumber) {
        if (args.length < 2) {
            throw {
                message: CONFIG.ERROR_MESSAGES.MISSING_ARGS,
                suggestion: 'Uso: LINK "Texto" "URL"'
            };
        }
        
        const url = args[1];
        
        // Validar URL
        if (!url.startsWith('https://') && !url.startsWith('/')) {
            throw {
                message: CONFIG.ERROR_MESSAGES.INVALID_URL,
                suggestion: 'Use URLs que começam com https:// ou caminhos relativos /'
            };
        }
        
        return {
            type: 'Link',
            text: args[0],
            url: url,
            line: lineNumber
        };
    }
    
    validate(ast) {
        let elementCount = 0;
        let imageCount = 0;
        
        for (let node of ast.body) {
            elementCount++;
            
            if (node.type === 'Image') {
                imageCount++;
            }
        }
        
        if (elementCount > CONFIG.MAX_ELEMENTS) {
            this.errors.push({
                line: 0,
                code: 'MAX_ELEMENTS',
                message: CONFIG.ERROR_MESSAGES.MAX_ELEMENTS
            });
        }
        
        if (imageCount > CONFIG.MAX_IMAGES) {
            this.errors.push({
                line: 0,
                code: 'MAX_IMAGES',
                message: CONFIG.ERROR_MESSAGES.MAX_IMAGES
            });
        }
        
        return this.errors.length === 0;
    }
}

// Renderer DSL -> HTML
class DSLRenderer {
    constructor() {
        this.currentPage = null;
    }
    
    render(ast) {
        const container = document.createElement('div');
        container.className = 'dsl-container';
        container.style.cssText = 'max-width: 1200px; margin: 0 auto; padding: 20px;';
        
        for (let node of ast.body) {
            const element = this.renderNode(node);
            if (element) {
                container.appendChild(element);
            }
        }
        
        return container;
    }
    
    renderNode(node) {
        switch (node.type) {
            case 'Page':
                return this.renderPage(node);
            case 'Text':
                return this.renderText(node);
            case 'Button':
                return this.renderButton(node);
            case 'Image':
                return this.renderImage(node);
            case 'Link':
                return this.renderLink(node);
            default:
                return null;
        }
    }
    
    renderPage(node) {
        const page = document.createElement('div');
        page.className = 'dsl-page';
        page.id = `page-${node.name.toLowerCase().replace(/\s+/g, '-')}`;
        
        const title = document.createElement('h1');
        title.textContent = node.name;
        page.appendChild(title);
        
        return page;
    }
    
    renderText(node) {
        const p = document.createElement('p');
        p.textContent = node.content;
        p.style.cssText = 'margin: 10px 0; line-height: 1.6;';
        return p;
    }
    
    renderButton(node) {
        const btn = document.createElement('button');
        btn.textContent = node.text;
        btn.style.cssText = `
            padding: 12px 24px;
            background: ${CONFIG.THEME_COLORS.primary};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
            transition: all 0.3s;
        `;
        
        btn.onmouseover = () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        };
        
        btn.onmouseout = () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = 'none';
        };
        
        if (node.url) {
            btn.onclick = () => {
                if (node.url.startsWith('https://')) {
                    window.open(node.url, '_blank');
                } else {
                    window.location.href = node.url;
                }
            };
        }
        
        return btn;
    }
    
    renderImage(node) {
        const img = document.createElement('img');
        img.src = node.url;
        img.alt = node.alt;
        img.style.cssText = 'max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;';
        
        // Lazy loading
        img.loading = 'lazy';
        
        return img;
    }
    
    renderLink(node) {
        const a = document.createElement('a');
        a.textContent = node.text;
        a.href = node.url;
        a.style.cssText = `
            color: ${CONFIG.THEME_COLORS.primary};
            text-decoration: none;
            font-weight: 600;
            margin: 0 5px;
        `;
        
        if (node.url.startsWith('https://')) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        }
        
        return a;
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.DSLParser = DSLParser;
    window.DSLRenderer = DSLRenderer;
}
