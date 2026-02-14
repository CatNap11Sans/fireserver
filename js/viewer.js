// Viewer logic - displays published sites

document.addEventListener('DOMContentLoaded', async () => {
    await loadSite();
});

async function loadSite() {
    const loader = document.getElementById('loader');
    const container = document.getElementById('site-container');
    const errorContainer = document.getElementById('error-container');

    try {
        // Extract username and ID from path
        const path = window.location.pathname;
        const match = path.match(/\/([a-z][a-z0-9_-]+)-(\d{4})/);

        if (!match) {
            throw new Error('URL inválida');
        }

        const [, username, siteId] = match;
        const url = `${username}-${siteId}`;

        // Find site by URL
        const sitesSnapshot = await db.collection('sites')
            .where('url', '==', url)
            .where('visibility', '==', 'public')
            .limit(1)
            .get();

        if (sitesSnapshot.empty) {
            throw new Error('Site não encontrado');
        }

        const siteDoc = sitesSnapshot.docs[0];
        const siteData = siteDoc.data();

        // Update meta tags
        updateMetaTags(siteData);

        // Render site
        if (siteData.workspace) {
            workspace.deserialize(siteData.workspace);
            renderSite();
        }

        // Hide loader, show content
        loader.style.display = 'none';
        container.style.display = 'block';

    } catch (error) {
        console.error('Error loading site:', error);
        loader.style.display = 'none';
        errorContainer.style.display = 'flex';
    }
}

function updateMetaTags(siteData) {
    document.title = siteData.name || 'Fire Server';
    
    const description = document.querySelector('meta[name="description"]');
    if (description && siteData.description) {
        description.content = siteData.description;
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.content = siteData.name || 'Fire Server';
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && siteData.description) {
        ogDescription.content = siteData.description;
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && siteData.linkCard) {
        ogImage.content = siteData.linkCard;
    }

    // Set favicon
    if (siteData.favicon) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = siteData.favicon;
        document.head.appendChild(link);
    }
}

function renderSite() {
    const container = document.getElementById('site-container');
    
    // Find Home page
    const home = workspace.root.findFirstChild('Home');
    if (!home) {
        container.innerHTML = '<p>Site sem conteúdo</p>';
        return;
    }

    // Render the home page
    container.innerHTML = renderPage(home);

    // Apply any scripts (in safe mode)
    applyScripts();
}

function renderPage(pageInstance) {
    let html = '';

    // Render children
    pageInstance.children.forEach(child => {
        html += renderComponent(child);
    });

    return html;
}

function renderComponent(instance) {
    switch (instance.className) {
        case 'Text':
            return renderText(instance);
        
        case 'Button':
            return renderButton(instance);
        
        case 'Image':
            return renderImage(instance);
        
        case 'Themecolor':
            return renderThemeColor(instance);
        
        default:
            return '';
    }
}

function renderText(instance) {
    const text = escapeHTML(instance.Text || '');
    const color = instance.Color ? instance.Color.toRGBA() : '#000';
    const fontSize = instance.FontSize || 16;
    
    return `
        <div class="fs-text" style="color: ${color}; font-size: ${fontSize}px;">
            ${text}
        </div>
    `;
}

function renderButton(instance) {
    const text = escapeHTML(instance.Text || 'Botão');
    const bgColor = instance.BackgroundColor ? instance.BackgroundColor.toRGBA() : '#ff6b35';
    const color = instance.Color ? instance.Color.toRGBA() : '#fff';
    
    return `
        <button class="fs-button" style="background: ${bgColor}; color: ${color};">
            ${text}
        </button>
    `;
}

function renderImage(instance) {
    if (!instance.BackgroundImage) return '';
    
    const src = escapeHTML(instance.BackgroundImage);
    const isBackground = instance.getAttribute('isBackground');
    
    if (isBackground) {
        return `
            <img src="${src}" class="fs-image background" alt="">
        `;
    }
    
    return `
        <img src="${src}" class="fs-image" alt="">
    `;
}

function renderThemeColor(instance) {
    // Apply theme color to body or container
    const color = instance.Color;
    if (color) {
        document.body.style.background = color.toRGBA();
    }
    return '';
}

function applyScripts() {
    // This would execute safe Lua scripts via Fengari
    // Implementation depends on lua-bridge.js
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
