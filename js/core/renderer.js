// Fire Server - Renderer
// Renderiza componentes do Workspace no preview

class FireRenderer {
    constructor() {
        this.previewFrame = null;
        this.previewDocument = null;
    }

    init() {
        this.previewFrame = document.getElementById('previewFrame');
        if (!this.previewFrame) return;
        
        this.previewFrame.addEventListener('load', () => {
            this.previewDocument = this.previewFrame.contentDocument;
            this.setupPreviewDocument();
        });
        
        this.initPreview();
    }

    setupPreviewDocument() {
        if (!this.previewDocument) return;
        
        const style = this.previewDocument.createElement('style');
        style.textContent = `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, sans-serif; background: #f5f5f5; }
            .fire-page { position: relative; min-height: 100vh; background: white; }
            .fire-text { position: absolute; }
            .fire-button { position: absolute; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: transform 0.2s; }
            .fire-button:hover { transform: translateY(-2px); }
            .fire-image { position: absolute; object-fit: cover; }
        `;
        
        this.previewDocument.head.appendChild(style);
    }

    initPreview() {
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div class="fire-page"><div style="text-align: center; padding: 60px 20px; color: #999;"><div style="font-size: 4rem; margin-bottom: 1rem;">📄</div><h2>Preview</h2><p>Execute seu script para ver o resultado</p></div></div></body></html>`;
        
        this.previewFrame.srcdoc = html;
    }

    render() {
        if (!this.previewDocument) return;

        this.previewDocument.body.innerHTML = '';
        
        const site = workspace.FindFirstChild('Site');
        if (!site) return this.showError('Site não encontrado');

        const layoutMenu = site.children[0];
        if (!layoutMenu) return this.showError('LayoutMenu não encontrado');

        const pages = layoutMenu.GetChildren().filter(c => c.className === 'Page');
        if (pages.length === 0) return this.showError('Nenhuma Page');

        this.renderPage(pages[0]);
        console.log('✅ Preview renderizado');
    }

    renderPage(page) {
        const pageEl = this.previewDocument.createElement('div');
        pageEl.className = 'fire-page';
        
        if (page.BackgroundColor) {
            const { r, g, b } = page.BackgroundColor;
            pageEl.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
        
        page.GetChildren().forEach(child => {
            const el = this.renderComponent(child);
            if (el) pageEl.appendChild(el);
        });
        
        this.previewDocument.body.appendChild(pageEl);
    }

    renderComponent(component) {
        switch (component.className) {
            case 'Text': return this.renderText(component);
            case 'Button': return this.renderButton(component);
            case 'Image': return this.renderImage(component);
            default: return null;
        }
    }

    renderText(text) {
        const el = this.previewDocument.createElement('div');
        el.className = 'fire-text';
        el.textContent = text.Text || 'Text';
        
        if (text.Position) {
            el.style.left = `${text.Position.x}px`;
            el.style.top = `${text.Position.y}px`;
        }
        if (text.Size) {
            el.style.width = `${text.Size.x}px`;
            el.style.height = `${text.Size.y}px`;
        }
        if (text.Color) {
            const { r, g, b } = text.Color;
            el.style.color = `rgb(${r}, ${g}, ${b})`;
        }
        if (text.FontSize) el.style.fontSize = `${text.FontSize}px`;
        if (text.Font) el.style.fontFamily = text.Font;
        
        return el;
    }

    renderButton(button) {
        const el = this.previewDocument.createElement('button');
        el.className = 'fire-button';
        el.textContent = button.Text || 'Button';
        
        if (button.Position) {
            el.style.left = `${button.Position.x}px`;
            el.style.top = `${button.Position.y}px`;
        }
        if (button.Size) {
            el.style.width = `${button.Size.x}px`;
            el.style.height = `${button.Size.y}px`;
        }
        if (button.BackgroundColor) {
            const { r, g, b } = button.BackgroundColor;
            el.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
        if (button.Color) {
            const { r, g, b } = button.Color;
            el.style.color = `rgb(${r}, ${g}, ${b})`;
        } else {
            el.style.color = 'white';
        }
        
        if (button.Action) el.addEventListener('click', button.Action);
        
        return el;
    }

    renderImage(image) {
        const el = this.previewDocument.createElement('img');
        el.className = 'fire-image';
        el.src = image.Image || '';
        el.alt = image.Name || 'Image';
        
        if (image.Position) {
            el.style.left = `${image.Position.x}px`;
            el.style.top = `${image.Position.y}px`;
        }
        if (image.Size) {
            el.style.width = `${image.Size.x}px`;
            el.style.height = `${image.Size.y}px`;
        }
        if (image.ScaleType) el.style.objectFit = image.ScaleType;
        
        return el;
    }

    showError(message) {
        this.previewDocument.body.innerHTML = `<div style="text-align: center; padding: 60px 20px;"><div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div><h2 style="color: #f44336;">Erro</h2><p style="color: #666;">${message}</p></div>`;
    }

    clear() {
        this.initPreview();
    }
}

window.fireRenderer = new FireRenderer();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.fireRenderer.init());
} else {
    window.fireRenderer.init();
}
