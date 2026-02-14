// DSL Parser - Parses Fire Server DSL to workspace instances
// This is a basic implementation - will be expanded with full DSL support

class DSLParser {
    constructor() {
        this.errors = [];
        this.lineNumber = 0;
    }

    parse(dslCode) {
        this.errors = [];
        const lines = dslCode.split('\n');
        
        lines.forEach((line, index) => {
            this.lineNumber = index + 1;
            this.parseLine(line.trim());
        });

        return {
            success: this.errors.length === 0,
            errors: this.errors
        };
    }

    parseLine(line) {
        // Skip empty lines and comments
        if (!line || line.startsWith('//') || line.startsWith('--')) {
            return;
        }

        // Basic DSL command parsing
        // Format: COMMAND arg1 arg2 arg3
        const parts = this.splitCommand(line);
        if (parts.length === 0) return;

        const command = parts[0].toUpperCase();
        const args = parts.slice(1);

        try {
            switch (command) {
                case 'CREATE':
                    this.handleCreate(args);
                    break;
                
                case 'SET':
                    this.handleSet(args);
                    break;
                
                case 'COLOR':
                    this.handleColor(args);
                    break;
                
                default:
                    this.addError(`Comando desconhecido: ${command}`);
            }
        } catch (error) {
            this.addError(error.message);
        }
    }

    splitCommand(line) {
        // Simple split that respects quotes
        const parts = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"' || char === "'") {
                inQuotes = !inQuotes;
            } else if (char === ' ' && !inQuotes) {
                if (current) {
                    parts.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }

        if (current) {
            parts.push(current);
        }

        if (inQuotes) {
            this.addError('Aspas não fechadas');
        }

        return parts;
    }

    handleCreate(args) {
        if (args.length < 2) {
            throw new Error('CREATE requer tipo e nome');
        }

        const [type, name] = args;
        // Would create instance in workspace
        console.log(`CREATE ${type} ${name}`);
    }

    handleSet(args) {
        if (args.length < 3) {
            throw new Error('SET requer objeto, propriedade e valor');
        }

        const [object, property, ...valueParts] = args;
        const value = valueParts.join(' ');
        // Would set property in workspace
        console.log(`SET ${object}.${property} = ${value}`);
    }

    handleColor(args) {
        if (args.length < 1) {
            throw new Error('COLOR requer valor');
        }

        const colorValue = args[0];
        
        // Validate color format
        if (colorValue.startsWith('#')) {
            if (!/^#[0-9A-Fa-f]{3,6}$/.test(colorValue)) {
                throw new Error('Formato de cor hexadecimal inválido');
            }
        } else if (colorValue.startsWith('rgb')) {
            // Validate RGB format
            if (!/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(colorValue)) {
                throw new Error('Formato RGB inválido');
            }
        }
    }

    addError(message, suggestion = null) {
        this.errors.push({
            line: this.lineNumber,
            code: 'DSL_ERROR',
            message: message,
            suggestion: suggestion
        });
    }

    validate(dslCode) {
        const result = this.parse(dslCode);
        
        // Check limits
        const lines = dslCode.split('\n').length;
        if (lines > 200) {
            result.errors.push({
                line: 0,
                code: 'LIMIT_EXCEEDED',
                message: '🔴 Limite excedido: máximo de 200 linhas',
                suggestion: 'Reduza o número de linhas do código'
            });
            result.success = false;
        }

        const charCount = dslCode.length;
        if (charCount > 10000) {
            result.errors.push({
                line: 0,
                code: 'LIMIT_EXCEEDED',
                message: '🔴 Limite excedido: máximo de 10.000 caracteres',
                suggestion: 'Reduza o tamanho do código'
            });
            result.success = false;
        }

        return result;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.DSLParser = DSLParser;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DSLParser;
}
