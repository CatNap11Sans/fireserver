/**
 * Fire Server DSL Renderer
 * Renderiza AST em DOM seguro (sem innerHTML)
 */

class DSLRenderer {
    constructor() {
        this.currentPage = 0;
        this.ast = null;
        this.container = null;
    }

    /**
     * Renderiza a AST completa em um container
     */
    render(ast, container) {
        if (!ast || !ast.pages || ast.pages.length === 0) {
            this.renderEmpty(container);
            return;
        }

        // Salvar referências
        this.ast = ast;
        this.container = container;

        // Limpar container
        container.innerHTML = '';

        // Criar estrutura do site
        const siteWrapper = document.createElement('div');
        siteWrapper.className = 'fire-site';

        // Aplicar configuração global se existir
        if (ast.config) {
            this.applyGlobalConfig(siteWrapper, ast.config);
        }

        // Se houver mais de uma página, criar navegação
        if (ast.pages.length > 1) {
            const nav = this.createNavigation(ast.pages);
            siteWrapper.appendChild(nav);
        }

        // Criar container de páginas
        const pagesContainer = document.createElement('div');
        pagesContainer.className = 'fire-pages';

        // Renderizar cada página
        ast.pages.forEach((page, index) => {
            const pageElement = this.renderPage(page, index);
            pagesContainer.appendChild(pageElement);
        });

        siteWrapper.appendChild(pagesContainer);
        container.appendChild(siteWrapper);

        // Adicionar estilos base
        this.injectBaseStyles(container);

        // Mostrar primeira página
        this.showPage(0);
    }

    /**
     * Renderiza uma página vazia
     */
    renderEmpty(container) {
        container.innerHTML = '';
        const empty = document.createElement('div');
        empty.className = 'fire-empty';
        empty.textContent = 'Comece a escrever seu código...';
        container.appendChild(empty);
    }

    /**
     * Renderiza uma página individual
     */
    renderPage(page, index) {
        const pageElement = document.createElement('div');
        pageElement.className = 'fire-page';
        pageElement.dataset.pageIndex = index;
        pageElement.dataset.pageName = page.name;

        if (index !== 0) {
            pageElement.style.display = 'none';
        }

        // Aplicar configuração da página
        if (page.config) {
            this.applyPageConfig(pageElement, page.config);
        }

        // Renderizar elementos
        page.elements.forEach(element => {
            const el = this.renderElement(element);
            if (el) pageElement.appendChild(el);
        });

        return pageElement;
    }

    /**
     * Renderiza um elemento baseado no tipo
     */
    renderElement(element) {
        switch (element.type) {
            case 'text':
                return this.renderText(element);
            case 'image':
                return this.renderImage(element);
            case 'button':
                return this.renderButton(element);
            case 'divider':
                return this.renderDivider(element);
            case 'jump':
                return this.renderJump(element);
            default:
                console.warn('Tipo de elemento desconhecido:', element.type);
                return null;
        }
    }

    /**
     * Renderiza elemento text
     */
    renderText(element) {
        const p = document.createElement('p');
        p.className = 'fire-text';
        p.dataset.elementId = element.id;
        p.textContent = element.content;

        this.applyLoads(p, element.loads);

        return p;
    }

    /**
     * Renderiza elemento image
     */
    renderImage(element) {
        const container = document.createElement('div');
        container.className = 'fire-image-container';
        
        const img = document.createElement('img');
        img.className = 'fire-image';
        img.dataset.elementId = element.id;
        img.src = this.sanitizeUrl(element.url);
        img.alt = element.name;
        img.loading = 'lazy';

        // Error handling
        img.onerror = () => {
            img.style.display = 'none';
            const errorText = document.createElement('p');
            errorText.className = 'fire-image-error';
            errorText.textContent = '❌ Imagem não carregada';
            container.appendChild(errorText);
        };

        this.applyLoads(img, element.loads);
        container.appendChild(img);

        return container;
    }

    /**
     * Renderiza elemento button
     */
    renderButton(element) {
        const button = document.createElement('button');
        button.className = 'fire-button';
        button.dataset.elementId = element.id;
        button.textContent = element.text;

        // Configurar ação
        if (element.action.type === 'link') {
            button.onclick = () => {
                window.open(this.sanitizeUrl(element.action.value), '_blank', 'noopener,noreferrer');
            };
        } else if (element.action.type === 'page') {
            button.onclick = () => {
                this.navigateToPage(element.action.value);
            };
        }

        this.applyLoads(button, element.loads);

        return button;
    }

    /**
     * Renderiza divider
     */
    renderDivider(element) {
        const hr = document.createElement('hr');
        hr.className = 'fire-divider';
        hr.dataset.elementId = element.id;
        return hr;
    }

    /**
     * Renderiza jump (quebra de linha)
     */
    renderJump(element) {
        const br = document.createElement('div');
        br.className = 'fire-jump';
        br.dataset.elementId = element.id;
        return br;
    }

    /**
     * Cria navegação entre páginas
     */
    createNavigation(pages) {
        const nav = document.createElement('nav');
        nav.className = 'fire-nav';

        pages.forEach((page, index) => {
            const link = document.createElement('a');
            link.className = 'fire-nav-link';
            link.textContent = page.name;
            link.href = '#';
            link.onclick = (e) => {
                e.preventDefault();
                this.showPage(index);
            };

            if (index === 0) {
                link.classList.add('active');
            }

            nav.appendChild(link);
        });

        return nav;
    }

    /**
     * Aplica loads (estilos) a um elemento
     */
    applyLoads(element, loads) {
        if (!loads) return;

        if (loads.color) {
            element.style.color = loads.color;
        }

        if (loads.backcolor) {
            element.style.backgroundColor = loads.backcolor;
            element.style.padding = '1rem';
            element.style.borderRadius = '8px';
        }

        if (loads.font) {
            element.style.fontFamily = loads.font;
        }

        if (loads.size) {
            element.style.fontSize = loads.size + 'px';
        }

        if (loads.animation) {
            element.classList.add('fire-animated');
            element.style.animation = `fadeIn 0.5s ease-in-out`;
        }
    }

    /**
     * Aplica configuração global
     */
    applyGlobalConfig(element, config) {
        if (config.title) {
            document.title = config.title;
        }

        if (config.backcolor) {
            element.style.backgroundColor = config.backcolor;
        }
    }

    /**
     * Aplica configuração de página
     */
    applyPageConfig(element, config) {
        if (config.backcolor) {
            element.style.backgroundColor = config.backcolor;
        }
    }

    /**
     * Navega para uma página pelo nome
     */
    navigateToPage(pageName) {
        if (!this.ast || !this.ast.pages) {
            console.error('AST não encontrada');
            return;
        }

        // Procurar índice da página pelo nome
        const targetIndex = this.ast.pages.findIndex(page => page.name === pageName);
        
        if (targetIndex === -1) {
            console.error(`Página "${pageName}" não encontrada`);
            return;
        }

        // Navegar para a página
        this.showPage(targetIndex);
    }

    /**
     * Mostra uma página específica (versão corrigida)
     */
    showPage(index) {
        if (!this.container) return;

        const pages = this.container.querySelectorAll('.fire-page');
        const navLinks = this.container.querySelectorAll('.fire-nav-link');

        // Esconder todas as páginas
        pages.forEach((page, pageIndex) => {
            if (pageIndex === index) {
                page.style.display = 'block';
                page.classList.add('fire-page-active');
            } else {
                page.style.display = 'none';
                page.classList.remove('fire-page-active');
            }
        });

        // Atualizar navegação
        navLinks.forEach((link, linkIndex) => {
            if (linkIndex === index) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        this.currentPage = index;
    }
        });

        this.currentPage = index;
    }

    /**
     * Sanitiza URL para evitar XSS
     */
    sanitizeUrl(url) {
        // Bloquear javascript: e data: URLs
        if (url.toLowerCase().startsWith('javascript:') || 
            url.toLowerCase().startsWith('data:')) {
            return '#';
        }

        return url;
    }

    /**
     * Injeta estilos base para renderização
     */
    injectBaseStyles(container) {
        const styleId = 'fire-base-styles';
        
        // Não adicionar se já existe
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .fire-site {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 2rem;
                background: white;
                min-height: 100vh;
            }

            .fire-nav {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                border-bottom: 2px solid #eee;
                padding-bottom: 1rem;
            }

            .fire-nav-link {
                padding: 0.5rem 1rem;
                text-decoration: none;
                color: #666;
                border-radius: 4px;
                transition: all 0.3s;
            }

            .fire-nav-link:hover {
                background: #f5f5f5;
                color: #333;
            }

            .fire-nav-link.active {
                background: #FF6B35;
                color: white;
            }

            .fire-page {
                animation: fadeIn 0.3s ease-in-out;
            }

            .fire-text {
                margin: 1rem 0;
                line-height: 1.6;
                color: #333;
            }

            .fire-image-container {
                margin: 1.5rem 0;
                text-align: center;
            }

            .fire-image {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .fire-image-error {
                color: #999;
                font-style: italic;
            }

            .fire-button {
                display: inline-block;
                padding: 0.8rem 2rem;
                margin: 0.5rem;
                background: #FF6B35;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }

            .fire-button:hover {
                background: #F7931E;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
            }

            .fire-divider {
                margin: 2rem 0;
                border: none;
                border-top: 2px solid #eee;
            }

            .fire-jump {
                height: 1.5rem;
            }

            .fire-empty {
                text-align: center;
                padding: 4rem 2rem;
                color: #999;
                font-size: 1.2rem;
            }

            .fire-animated {
                animation: fadeIn 0.5s ease-in-out;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 768px) {
                .fire-site {
                    padding: 1rem;
                }

                .fire-nav {
                    flex-wrap: wrap;
                }

                .fire-button {
                    width: 100%;
                    margin: 0.5rem 0;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Export para uso em Node.js ou navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DSLRenderer;
}
