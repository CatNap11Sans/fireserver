/**
 * Fire Server DSL Parser
 * Converte código DSL em uma AST (Abstract Syntax Tree)
 */

class DSLParser {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.ast = {
            pages: [],
            config: {}
        };
        this.limits = {
            maxLines: 200,
            maxElements: 100,
            maxImages: 10,
            maxChars: 10000
        };
    }

    /**
     * Função principal de parse
     */
    parse(code) {
        this.errors = [];
        this.warnings = [];
        this.ast = { pages: [], config: {} };

        const lines = code.split('\n');
        
        // Validar limites
        if (!this.validateLimits(code, lines)) {
            return { ast: null, errors: this.errors, warnings: this.warnings };
        }

        // Processar linhas
        let currentPage = null;
        let lineNumber = 0;

        for (let line of lines) {
            lineNumber++;
            line = line.trim();

            // Ignorar comentários e linhas vazias
            if (line.startsWith('#') || line === '') continue;

            try {
                const result = this.parseLine(line, lineNumber);
                
                if (result.type === 'page') {
                    if (currentPage) {
                        this.ast.pages.push(currentPage);
                    }
                    currentPage = result.data;
                } else if (result.type === 'end') {
                    if (currentPage) {
                        this.ast.pages.push(currentPage);
                        currentPage = null;
                    } else {
                        this.addError(lineNumber, 'END_WITHOUT_PAGE', 'Comando "end" sem página correspondente');
                    }
                } else if (result.type === 'config') {
                    this.ast.config = { ...this.ast.config, ...result.data };
                } else {
                    if (!currentPage) {
                        this.addError(lineNumber, 'ELEMENT_OUTSIDE_PAGE', 'Elemento fora de uma página');
                        continue;
                    }
                    currentPage.elements.push(result.data);
                }
            } catch (error) {
                this.addError(lineNumber, 'PARSE_ERROR', error.message);
            }
        }

        // Se sobrou uma página aberta
        if (currentPage) {
            this.addWarning(lineNumber, 'PAGE_NOT_CLOSED', 'Página não fechada com "end"');
            this.ast.pages.push(currentPage);
        }

        // Validar nomes duplicados
        this.validateUniqueNames();

        // Validar limites de imagens
        this.validateImageLimit();

        return {
            ast: this.errors.length === 0 ? this.ast : null,
            errors: this.errors,
            warnings: this.warnings
        };
    }

    /**
     * Parse de uma linha individual
     */
    parseLine(line, lineNumber) {
        // page nome
        if (line.startsWith('page ')) {
            const name = line.substring(5).trim();
            if (!name) {
                throw new Error('Nome da página não pode estar vazio');
            }
            return {
                type: 'page',
                data: {
                    name,
                    elements: [],
                    config: {}
                }
            };
        }

        // end
        if (line === 'end') {
            return { type: 'end' };
        }

        // title nome
        if (line.startsWith('title ')) {
            const content = line.substring(6).trim();
            if (!content.match(/^"[^"]*"$/)) {
                throw new Error('Título deve estar entre aspas');
            }
            return {
                type: 'config',
                data: { title: content.slice(1, -1) }
            };
        }

        // text nome ("conteúdo", loads)
        if (line.startsWith('text ')) {
            return { type: 'element', data: this.parseText(line, lineNumber) };
        }

        // image nome ("url", loads)
        if (line.startsWith('image ')) {
            return { type: 'element', data: this.parseImage(line, lineNumber) };
        }

        // button nome ("texto" [link "url" ou page nome], loads)
        if (line.startsWith('button ')) {
            return { type: 'element', data: this.parseButton(line, lineNumber) };
        }

        // divider
        if (line === 'divider') {
            return {
                type: 'element',
                data: { type: 'divider', id: this.generateId() }
            };
        }

        // jump
        if (line === 'jump') {
            return {
                type: 'element',
                data: { type: 'jump', id: this.generateId() }
            };
        }

        // load (configuração de página)
        if (line.startsWith('load ')) {
            return { type: 'config', data: this.parseLoad(line, lineNumber) };
        }

        throw new Error(`Comando desconhecido: ${line.split(' ')[0]}`);
    }

    /**
     * Parse de elemento text
     */
    parseText(line, lineNumber) {
        const match = line.match(/^text\s+(\w+)\s*\(([^)]+)\)$/);
        if (!match) {
            throw new Error('Sintaxe inválida para text. Use: text nome ("conteúdo", loads)');
        }

        const [, name, args] = match;
        const { content, loads } = this.parseArgs(args, lineNumber);

        return {
            type: 'text',
            id: name,
            name,
            content,
            loads: loads || {}
        };
    }

    /**
     * Parse de elemento image
     */
    parseImage(line, lineNumber) {
        const match = line.match(/^image\s+(\w+)\s*\(([^)]+)\)$/);
        if (!match) {
            throw new Error('Sintaxe inválida para image. Use: image nome ("url", loads)');
        }

        const [, name, args] = match;
        const { content, loads } = this.parseArgs(args, lineNumber);

        // Validar URL
        if (!this.isValidUrl(content)) {
            this.addWarning(lineNumber, 'INVALID_URL', 'URL da imagem pode ser inválida');
        }

        return {
            type: 'image',
            id: name,
            name,
            url: content,
            loads: loads || {}
        };
    }

    /**
     * Parse de elemento button
     */
    parseButton(line, lineNumber) {
        const match = line.match(/^button\s+(\w+)\s*\(([^)]+)\)$/);
        if (!match) {
            throw new Error('Sintaxe inválida para button');
        }

        const [, name, args] = match;
        
        // Extrair texto, ação e loads
        const parts = args.match(/"([^"]+)"\s*\[\s*(link|page)\s+"?([^"\]]+)"?\s*\](?:,\s*(.+))?/);
        if (!parts) {
            throw new Error('Sintaxe inválida para button. Use: button nome ("texto" [link "url"], loads)');
        }

        const [, text, actionType, actionValue, loadsStr] = parts;
        const loads = loadsStr ? this.parseLoads(loadsStr, lineNumber) : {};

        return {
            type: 'button',
            id: name,
            name,
            text,
            action: {
                type: actionType,
                value: actionValue
            },
            loads
        };
    }

    /**
     * Parse de argumentos (content, loads)
     */
    parseArgs(args, lineNumber) {
        const match = args.match(/"([^"]+)"(?:,\s*(.+))?/);
        if (!match) {
            throw new Error('Argumentos devem estar no formato: ("conteúdo", loads)');
        }

        const [, content, loadsStr] = match;
        const loads = loadsStr ? this.parseLoads(loadsStr, lineNumber) : {};

        return { content, loads };
    }

    /**
     * Parse de loads (funções de estilo)
     */
    parseLoads(loadsStr, lineNumber) {
        const loads = {};
        const functions = loadsStr.split(';').map(f => f.trim());

        for (const func of functions) {
            if (!func) continue;

            const match = func.match(/^(\w+)\(([^)]+)\)$/);
            if (!match) {
                this.addWarning(lineNumber, 'INVALID_LOAD', `Função inválida: ${func}`);
                continue;
            }

            const [, funcName, funcArgs] = match;
            
            // Validar funções conhecidas
            const validFunctions = ['color', 'font', 'backcolor', 'size', 'slep', 'animation'];
            if (!validFunctions.includes(funcName)) {
                this.addWarning(lineNumber, 'UNKNOWN_FUNCTION', `Função desconhecida: ${funcName}`);
                continue;
            }

            loads[funcName] = funcArgs.replace(/^["']|["']$/g, '');
        }

        return loads;
    }

    /**
     * Parse de configuração load
     */
    parseLoad(line, lineNumber) {
        const match = line.match(/^load\s+(\w+)\s*:\s*(.+)$/);
        if (!match) {
            throw new Error('Sintaxe inválida para load');
        }

        const [, name, funcStr] = match;
        const loads = this.parseLoads(funcStr, lineNumber);

        return { [`load_${name}`]: loads };
    }

    /**
     * Validações
     */
    validateLimits(code, lines) {
        let valid = true;

        // Remover comentários para contar linhas reais
        const realLines = lines.filter(l => {
            const trimmed = l.trim();
            return trimmed !== '' && !trimmed.startsWith('#');
        });

        if (realLines.length > this.limits.maxLines) {
            this.addError(0, 'LINE_LIMIT', `🔴 Limite excedido: máximo de ${this.limits.maxLines} linhas`);
            valid = false;
        }

        if (code.length > this.limits.maxChars) {
            this.addError(0, 'CHAR_LIMIT', `🔴 Limite excedido: máximo de ${this.limits.maxChars} caracteres`);
            valid = false;
        }

        return valid;
    }

    validateUniqueNames() {
        const names = new Set();
        
        for (const page of this.ast.pages) {
            for (const element of page.elements) {
                if (element.name && names.has(element.name)) {
                    this.addError(0, 'DUPLICATE_NAME', `Nome duplicado: ${element.name}`);
                }
                if (element.name) names.add(element.name);
            }
        }
    }

    validateImageLimit() {
        let imageCount = 0;
        
        for (const page of this.ast.pages) {
            for (const element of page.elements) {
                if (element.type === 'image') imageCount++;
            }
        }

        if (imageCount > this.limits.maxImages) {
            this.addError(0, 'IMAGE_LIMIT', `🔴 Limite excedido: máximo de ${this.limits.maxImages} imagens por site`);
        }
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return url.startsWith('http://') || url.startsWith('https://');
        }
    }

    /**
     * Helpers
     */
    addError(line, code, message, suggestion) {
        this.errors.push({ line, code, message, suggestion });
    }

    addWarning(line, code, message, suggestion) {
        this.warnings.push({ line, code, message, suggestion });
    }

    generateId() {
        return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Export para uso em Node.js ou navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DSLParser;
}
