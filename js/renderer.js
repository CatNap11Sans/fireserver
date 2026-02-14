// Renderer - Converts workspace instances to DOM elements

class FireServerRenderer {
    constructor() {
        this.currentPage = null;
    }

    renderToDOM(instance, container) {
        const element = this.createDOMElement(instance);
        if (element) {
            container.appendChild(element);
            
            // Render children
            instance.children.forEach(child => {
                this.renderToDOM(child, element);
            });
        }
    }

    createDOMElement(instance) {
        switch (instance.className) {
            case 'Page':
            case 'Home':
                return this.createPage(instance);
            
            case 'Text':
                return this.createText(instance);
            
            case 'Button':
                return this.createButton(instance);
            
            case 'Image':
                return this.createImage(instance);
            
            case 'TextArea':
                return this.createTextArea(instance);
            
            case 'UIGradient':
                this.applyGradient(instance);
                return null;
            
            default:
                return null;
        }
    }

    createPage(instance) {
        const div = document.createElement('div');
        div.className = 'fs-page';
        div.id = `page-${instance._id}`;
        
        if (instance.BackgroundColor) {
            div.style.backgroundColor = instance.BackgroundColor.toRGBA();
        }
        
        return div;
    }

    createText(instance) {
        const div = document.createElement('div');
        div.className = 'fs-text';
        div.textContent = instance.Text || 'Texto';
        
        if (instance.Color) {
            div.style.color = instance.Color.toRGBA();
        }
        
        if (instance.FontSize) {
            div.style.fontSize = instance.FontSize + 'px';
        }
        
        if (instance.Font) {
            div.style.fontFamily = instance.Font.Name;
            div.style.fontWeight = instance.Font.Weight;
            div.style.fontStyle = instance.Font.Style;
        }
        
        return div;
    }

    createButton(instance) {
        const button = document.createElement('button');
        button.className = 'fs-button';
        button.textContent = instance.Text || 'Botão';
        
        if (instance.BackgroundColor) {
            button.style.backgroundColor = instance.BackgroundColor.toRGBA();
        }
        
        if (instance.Color) {
            button.style.color = instance.Color.toRGBA();
        }
        
        // Add action if available
        if (instance.Action) {
            button.onclick = instance.Action;
        }
        
        return button;
    }

    createImage(instance) {
        const img = document.createElement('img');
        img.className = 'fs-image';
        img.src = instance.BackgroundImage || '';
        img.alt = instance.Name || 'Image';
        
        if (instance.getAttribute('isBackground')) {
            img.classList.add('background');
        }
        
        return img;
    }

    createTextArea(instance) {
        const textarea = document.createElement('textarea');
        textarea.className = 'fs-textarea';
        textarea.value = instance.Text || '';
        textarea.placeholder = instance.getAttribute('placeholder') || '';
        
        return textarea;
    }

    applyGradient(instance) {
        // Apply gradient to parent element
        const parent = instance.parent;
        if (!parent) return;
        
        const parentElement = document.getElementById(`page-${parent._id}`);
        if (!parentElement) return;
        
        // Create gradient CSS
        const points = instance.getAttribute('points') || [];
        if (points.length === 0) return;
        
        const gradientStops = points.map(point => {
            return `${point.color.toRGBA()} ${point.offset * 100}%`;
        }).join(', ');
        
        const rotation = instance.getAttribute('rotation') || 0;
        parentElement.style.background = `linear-gradient(${rotation}deg, ${gradientStops})`;
    }

    renderHTML(instance) {
        switch (instance.className) {
            case 'Text':
                return this.renderTextHTML(instance);
            
            case 'Button':
                return this.renderButtonHTML(instance);
            
            case 'Image':
                return this.renderImageHTML(instance);
            
            default:
                return '';
        }
    }

    renderTextHTML(instance) {
        const color = instance.Color ? instance.Color.toRGBA() : '#000';
        const fontSize = instance.FontSize || 16;
        const text = this.escapeHTML(instance.Text || 'Texto');
        
        return `<div class="fs-text" style="color: ${color}; font-size: ${fontSize}px;">${text}</div>`;
    }

    renderButtonHTML(instance) {
        const bg = instance.BackgroundColor ? instance.BackgroundColor.toRGBA() : '#ff6b35';
        const color = instance.Color ? instance.Color.toRGBA() : '#fff';
        const text = this.escapeHTML(instance.Text || 'Botão');
        
        return `<button class="fs-button" style="background: ${bg}; color: ${color};">${text}</button>`;
    }

    renderImageHTML(instance) {
        if (!instance.BackgroundImage) return '';
        
        const src = this.escapeHTML(instance.BackgroundImage);
        const className = instance.getAttribute('isBackground') ? 'fs-image background' : 'fs-image';
        
        return `<img src="${src}" class="${className}" alt="">`;
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.FireServerRenderer = FireServerRenderer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FireServerRenderer;
}
