/**
 * Fire Server Smart AI Assistant
 * IA que aprende com os erros do usuário (sem API externa)
 */

class FireSmartAI {
    constructor() {
        this.errorHistory = this.loadHistory();
        this.patterns = this.loadPatterns();
        this.suggestions = this.loadSuggestions();
        this.userPreferences = this.loadPreferences();
        this.init();
    }

    /**
     * Inicializa a IA
     */
    init() {
        this.loadKnowledge();
    }

    /**
     * Carrega histórico de erros
     */
    loadHistory() {
        const stored = localStorage.getItem('fire_ai_history');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Salva histórico
     */
    saveHistory() {
        localStorage.setItem('fire_ai_history', JSON.stringify(this.errorHistory));
    }

    /**
     * Carrega padrões aprendidos
     */
    loadPatterns() {
        const stored = localStorage.getItem('fire_ai_patterns');
        return stored ? JSON.parse(stored) : {
            commonErrors: {},
            successfulFixes: {},
            userHabits: {}
        };
    }

    /**
     * Salva padrões
     */
    savePatterns() {
        localStorage.setItem('fire_ai_patterns', JSON.stringify(this.patterns));
    }

    /**
     * Carrega sugestões
     */
    loadSuggestions() {
        const stored = localStorage.getItem('fire_ai_suggestions');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Salva sugestões
     */
    saveSuggestions() {
        localStorage.setItem('fire_ai_suggestions', JSON.stringify(this.suggestions));
    }

    /**
     * Carrega preferências do usuário
     */
    loadPreferences() {
        const stored = localStorage.getItem('fire_ai_preferences');
        return stored ? JSON.parse(stored) : {
            helpLevel: 'medium', // low, medium, high
            autoSuggest: true,
            explainErrors: true
        };
    }

    /**
     * Salva preferências
     */
    savePreferences() {
        localStorage.setItem('fire_ai_preferences', JSON.stringify(this.userPreferences));
    }

    /**
     * Base de conhecimento inicial
     */
    loadKnowledge() {
        this.knowledgeBase = {
            commands: {
                page: {
                    syntax: 'page nome',
                    description: 'Cria uma nova página',
                    examples: ['page inicio', 'page sobre', 'page contato'],
                    commonErrors: [
                        { error: 'page', fix: 'page nome', reason: 'Falta o nome da página' },
                        { error: 'page  ', fix: 'page inicio', reason: 'Nome vazio' }
                    ]
                },
                text: {
                    syntax: 'text nome ("conteúdo", loads)',
                    description: 'Adiciona texto',
                    examples: [
                        'text titulo ("Bem-vindo!")',
                        'text descricao ("Meu site", color("#FF0000"))'
                    ],
                    commonErrors: [
                        { error: 'text nome', fix: 'text nome ("texto")', reason: 'Faltam as aspas' },
                        { error: 'text nome "texto"', fix: 'text nome ("texto")', reason: 'Faltam os parênteses' }
                    ]
                },
                image: {
                    syntax: 'image nome ("url", loads)',
                    description: 'Adiciona imagem',
                    examples: [
                        'image logo ("https://exemplo.com/logo.png")',
                        'image foto ("https://i.imgur.com/abc123.jpg", size("200"))'
                    ],
                    commonErrors: [
                        { error: 'image nome url', fix: 'image nome ("url")', reason: 'URL precisa estar entre aspas e parênteses' }
                    ]
                },
                button: {
                    syntax: 'button nome ("texto" [link "url" ou page nome], loads)',
                    description: 'Adiciona botão',
                    examples: [
                        'button contato ("Fale Conosco" link "mailto:email@exemplo.com")',
                        'button voltar ("Voltar" page inicio)'
                    ],
                    commonErrors: [
                        { error: 'button nome ("texto" link url)', fix: 'button nome ("texto" link "url")', reason: 'URL do link precisa estar entre aspas' },
                        { error: 'button nome ("texto" [page nome])', fix: 'button nome ("texto" page nome)', reason: 'Não precisa de colchetes ao redor de page' }
                    ]
                },
                divider: {
                    syntax: 'divider',
                    description: 'Adiciona linha separadora',
                    examples: ['divider'],
                    commonErrors: []
                },
                jump: {
                    syntax: 'jump',
                    description: 'Pula uma linha',
                    examples: ['jump'],
                    commonErrors: []
                },
                load: {
                    syntax: 'load nome :função',
                    description: 'Define funções de estilo',
                    examples: [
                        'load estilo1 :color("#FF0000")',
                        'load estilo2 :color("#00FF00"); font("Arial")'
                    ],
                    commonErrors: []
                }
            },
            functions: {
                color: {
                    syntax: 'color("#RRGGBB")',
                    description: 'Define a cor do texto',
                    examples: ['color("#FF0000")', 'color("#2596be")']
                },
                backcolor: {
                    syntax: 'backcolor("#RRGGBB")',
                    description: 'Define a cor de fundo',
                    examples: ['backcolor("#FFFFFF")', 'backcolor("#000000")']
                },
                font: {
                    syntax: 'font("nome")',
                    description: 'Define a fonte',
                    examples: ['font("Arial")', 'font("Georgia")']
                },
                size: {
                    syntax: 'size("tamanho")',
                    description: 'Define o tamanho',
                    examples: ['size("20")', 'size("16")']
                },
                slep: {
                    syntax: 'slep("valor")',
                    description: 'Define tempo de espera',
                    examples: ['slep("1000")', 'slep("500")']
                },
                animation: {
                    syntax: 'animation("nome")',
                    description: 'Aplica animação',
                    examples: ['animation("fadeIn")', 'animation("slideUp")']
                }
            }
        };
    }

    /**
     * Registra um erro
     */
    recordError(error, code, context) {
        const errorRecord = {
            timestamp: Date.now(),
            error: error,
            code: code,
            context: context,
            resolved: false,
            fixApplied: null
        };

        this.errorHistory.push(errorRecord);
        
        // Manter apenas os últimos 100 erros
        if (this.errorHistory.length > 100) {
            this.errorHistory.shift();
        }

        // Atualizar padrões
        this.updatePatterns(error);
        
        this.saveHistory();
    }

    /**
     * Marca erro como resolvido
     */
    resolveError(errorIndex, fix) {
        if (this.errorHistory[errorIndex]) {
            this.errorHistory[errorIndex].resolved = true;
            this.errorHistory[errorIndex].fixApplied = fix;
            this.errorHistory[errorIndex].resolvedAt = Date.now();
            
            // Aprender com a correção
            this.learnFromFix(this.errorHistory[errorIndex]);
            
            this.saveHistory();
        }
    }

    /**
     * Atualiza padrões com base em erro
     */
    updatePatterns(error) {
        const errorKey = error.code || error.message;
        
        if (!this.patterns.commonErrors[errorKey]) {
            this.patterns.commonErrors[errorKey] = {
                count: 0,
                lastSeen: null,
                solutions: []
            };
        }

        this.patterns.commonErrors[errorKey].count++;
        this.patterns.commonErrors[errorKey].lastSeen = Date.now();
        
        this.savePatterns();
    }

    /**
     * Aprende com correções bem-sucedidas
     */
    learnFromFix(errorRecord) {
        const errorKey = errorRecord.error.code || errorRecord.error.message;
        
        if (!this.patterns.successfulFixes[errorKey]) {
            this.patterns.successfulFixes[errorKey] = [];
        }

        this.patterns.successfulFixes[errorKey].push({
            fix: errorRecord.fixApplied,
            timestamp: Date.now(),
            timeTaken: errorRecord.resolvedAt - errorRecord.timestamp
        });

        this.savePatterns();
    }

    /**
     * Analisa código e sugere melhorias
     */
    analyzeCode(code, errors) {
        const analysis = {
            suggestions: [],
            warnings: [],
            tips: [],
            improvements: []
        };

        // Analisar erros comuns
        errors.forEach(error => {
            const suggestion = this.getSuggestionForError(error);
            if (suggestion) {
                analysis.suggestions.push(suggestion);
            }
        });

        // Analisar padrões de código
        const patterns = this.analyzeCodePatterns(code);
        analysis.tips.push(...patterns.tips);
        analysis.improvements.push(...patterns.improvements);

        // Sugestões baseadas em histórico
        const historicalSuggestions = this.getHistoricalSuggestions(code);
        analysis.suggestions.push(...historicalSuggestions);

        return analysis;
    }

    /**
     * Obtém sugestão para erro específico
     */
    getSuggestionForError(error) {
        // Procurar em erros comuns conhecidos
        for (const [cmd, data] of Object.entries(this.knowledgeBase.commands)) {
            const commonError = data.commonErrors.find(ce => 
                error.message.toLowerCase().includes(ce.error.toLowerCase())
            );
            
            if (commonError) {
                return {
                    type: 'fix',
                    title: 'Correção Sugerida',
                    message: commonError.reason,
                    code: commonError.fix,
                    confidence: 'high',
                    action: 'replace'
                };
            }
        }

        // Procurar em padrões aprendidos
        const errorKey = error.code;
        if (this.patterns.successfulFixes[errorKey]) {
            const fixes = this.patterns.successfulFixes[errorKey];
            const mostRecent = fixes[fixes.length - 1];
            
            return {
                type: 'learned',
                title: 'Baseado em correções anteriores',
                message: 'Esta solução funcionou antes para este tipo de erro',
                code: mostRecent.fix,
                confidence: 'medium',
                action: 'suggest'
            };
        }

        // Sugestão genérica baseada no tipo de erro
        return this.getGenericSuggestion(error);
    }

    /**
     * Sugestão genérica
     */
    getGenericSuggestion(error) {
        if (error.message.includes('aspas')) {
            return {
                type: 'generic',
                title: 'Dica',
                message: 'Lembre-se: textos e URLs precisam estar entre aspas ("texto")',
                confidence: 'low'
            };
        }

        if (error.message.includes('sintaxe')) {
            return {
                type: 'generic',
                title: 'Erro de Sintaxe',
                message: 'Verifique se seguiu o formato correto do comando. Use o botão "?" para ver exemplos.',
                confidence: 'low'
            };
        }

        return null;
    }

    /**
     * Analisa padrões no código
     */
    analyzeCodePatterns(code) {
        const tips = [];
        const improvements = [];

        // Verificar se usa muitos elementos similares
        const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
        
        // Sugerir uso de load se há muitos elementos com as mesmas cores
        const colorUsage = {};
        lines.forEach(line => {
            const match = line.match(/color\("([^"]+)"\)/);
            if (match) {
                const color = match[1];
                colorUsage[color] = (colorUsage[color] || 0) + 1;
            }
        });

        Object.entries(colorUsage).forEach(([color, count]) => {
            if (count >= 3) {
                improvements.push({
                    type: 'optimization',
                    message: `Você usa a cor ${color} ${count} vezes. Considere criar um "load" para reutilizar:`,
                    example: `load meuEstilo :color("${color}")\n\nDepois use: text nome ("texto", meuEstilo)`
                });
            }
        });

        // Dicas baseadas em experiência
        if (lines.length > 50 && !code.includes('jump')) {
            tips.push({
                type: 'tip',
                message: 'Seu site está ficando grande! Use "jump" para dar espaços e melhorar a legibilidade.'
            });
        }

        if (lines.filter(l => l.includes('text')).length > 10 && !code.includes('divider')) {
            tips.push({
                type: 'tip',
                message: 'Considere usar "divider" para separar seções de texto no seu site.'
            });
        }

        return { tips, improvements };
    }

    /**
     * Sugestões baseadas em histórico
     */
    getHistoricalSuggestions(code) {
        const suggestions = [];

        // Analisar hábitos do usuário
        const recentErrors = this.errorHistory.slice(-20);
        const frequentErrors = {};

        recentErrors.forEach(record => {
            const key = record.error.code;
            frequentErrors[key] = (frequentErrors[key] || 0) + 1;
        });

        // Sugerir prevenção para erros frequentes
        Object.entries(frequentErrors).forEach(([errorCode, count]) => {
            if (count >= 3) {
                suggestions.push({
                    type: 'prevention',
                    title: 'Erro Frequente Detectado',
                    message: `Você teve ${count} erros de tipo "${errorCode}" recentemente. Tenha cuidado!`,
                    confidence: 'medium'
                });
            }
        });

        return suggestions;
    }

    /**
     * Gera explicação detalhada de erro
     */
    explainError(error) {
        let explanation = {
            error: error.message,
            why: '',
            how: '',
            example: '',
            related: []
        };

        // Buscar na base de conhecimento
        for (const [cmd, data] of Object.entries(this.knowledgeBase.commands)) {
            if (error.message.toLowerCase().includes(cmd)) {
                explanation.why = `Este erro acontece porque o comando "${cmd}" não está no formato correto.`;
                explanation.how = `Formato correto: ${data.syntax}`;
                explanation.example = data.examples[0];
                explanation.related = data.examples;
                break;
            }
        }

        // Adicionar contexto histórico
        const similarErrors = this.errorHistory.filter(e => 
            e.error.code === error.code && e.resolved
        ).length;

        if (similarErrors > 0) {
            explanation.note = `Você já resolveu ${similarErrors} erro(s) similar(es) antes. Você está aprendendo! 💪`;
        }

        return explanation;
    }

    /**
     * Sugere próximos comandos com base no contexto
     */
    suggestNextCommand(currentCode, cursorPosition) {
        const lines = currentCode.split('\n');
        const currentLine = lines[cursorPosition.line] || '';
        const previousLine = lines[cursorPosition.line - 1] || '';

        const suggestions = [];

        // Se está dentro de uma página
        if (previousLine.includes('page ') && !currentCode.includes('end')) {
            suggestions.push({
                command: 'title',
                reason: 'Adicionar título à página',
                code: 'title "Título da Página"'
            });
        }

        // Se acabou de adicionar texto
        if (previousLine.includes('text ')) {
            suggestions.push({
                command: 'jump',
                reason: 'Dar espaço após o texto',
                code: 'jump'
            });
            suggestions.push({
                command: 'button',
                reason: 'Adicionar ação relacionada',
                code: 'button acao ("Clique Aqui" link "https://exemplo.com")'
            });
        }

        // Se tem muitos elementos, sugerir dividir
        const elementCount = lines.filter(l => 
            l.includes('text ') || l.includes('image ') || l.includes('button ')
        ).length;

        if (elementCount > 5 && !currentCode.includes('divider')) {
            suggestions.push({
                command: 'divider',
                reason: 'Organizar melhor o conteúdo',
                code: 'divider'
            });
        }

        return suggestions;
    }

    /**
     * Modo de ajuda interativa
     */
    getHelp(query) {
        query = query.toLowerCase();

        // Ajuda sobre comandos
        for (const [cmd, data] of Object.entries(this.knowledgeBase.commands)) {
            if (query.includes(cmd)) {
                return {
                    type: 'command',
                    command: cmd,
                    description: data.description,
                    syntax: data.syntax,
                    examples: data.examples
                };
            }
        }

        // Ajuda sobre funções
        for (const [func, data] of Object.entries(this.knowledgeBase.functions)) {
            if (query.includes(func)) {
                return {
                    type: 'function',
                    function: func,
                    description: data.description,
                    syntax: data.syntax,
                    examples: data.examples
                };
            }
        }

        // Ajuda genérica
        return {
            type: 'general',
            message: 'Como posso ajudar? Pergunte sobre comandos (page, text, image, button) ou funções (color, size, font).',
            availableCommands: Object.keys(this.knowledgeBase.commands),
            availableFunctions: Object.keys(this.knowledgeBase.functions)
        };
    }

    /**
     * Reseta o aprendizado
     */
    resetLearning() {
        this.errorHistory = [];
        this.patterns = {
            commonErrors: {},
            successfulFixes: {},
            userHabits: {}
        };
        this.suggestions = [];
        
        this.saveHistory();
        this.savePatterns();
        this.saveSuggestions();
    }

    /**
     * Exporta dados de aprendizado
     */
    exportLearning() {
        return {
            version: '1.0',
            timestamp: Date.now(),
            errorHistory: this.errorHistory,
            patterns: this.patterns,
            preferences: this.userPreferences,
            stats: {
                totalErrors: this.errorHistory.length,
                resolvedErrors: this.errorHistory.filter(e => e.resolved).length,
                mostCommonError: this.getMostCommonError()
            }
        };
    }

    /**
     * Obtém erro mais comum
     */
    getMostCommonError() {
        if (Object.keys(this.patterns.commonErrors).length === 0) {
            return null;
        }

        return Object.entries(this.patterns.commonErrors)
            .sort((a, b) => b[1].count - a[1].count)[0];
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FireSmartAI;
}
