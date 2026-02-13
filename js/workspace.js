// workspace.js - Sistema de Workspace e hierarquia de componentes

class FireInstance {
    constructor(className, parent = null) {
        this.id = generateId();
        this.className = className;
        this.Name = className;
        this.parent = parent;
        this.children = [];
        this.attributes = {};
        this.properties = this.getDefaultProperties();
        
        // Adicionar aos filhos do pai
        if (parent) {
            parent.children.push(this);
        }
    }
    
    getDefaultProperties() {
        const defaults = {
            Visible: true,
            Position: { x: 0, y: 0 },
            Size: { x: 100, y: 100 },
            Text: '',
            Color: '#000000',
            BackgroundColor: '#ffffff',
            BackgroundImage: '',
            Font: 'Arial',
            FontSize: 16,
            Script: null
        };
        
        return { ...defaults };
    }
    
    // Navegação
    FindFirstChild(name) {
        return this.children.find(child => child.Name === name) || null;
    }
    
    GetChildren() {
        return [...this.children];
    }
    
    GetDescendants() {
        let descendants = [];
        for (let child of this.children) {
            descendants.push(child);
            descendants = descendants.concat(child.GetDescendants());
        }
        return descendants;
    }
    
    Locate(path) {
        if (!path) return null;
        
        const parts = path.split('/').filter(p => p);
        let current = this;
        
        for (let part of parts) {
            current = current.FindFirstChild(part);
            if (!current) return null;
        }
        
        return current;
    }
    
    // Modificação
    Destroy() {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1) {
                this.parent.children.splice(index, 1);
            }
        }
        
        // Destruir filhos
        for (let child of [...this.children]) {
            child.Destroy();
        }
        
        this.children = [];
        this.parent = null;
    }
    
    Clone() {
        const clone = new FireInstance(this.className, null);
        clone.Name = this.Name;
        clone.properties = { ...this.properties };
        clone.attributes = { ...this.attributes };
        
        // Clonar filhos
        for (let child of this.children) {
            const childClone = child.Clone();
            childClone.parent = clone;
            clone.children.push(childClone);
        }
        
        return clone;
    }
    
    SetAttribute(name, value) {
        this.attributes[name] = value;
    }
    
    GetAttribute(name) {
        return this.attributes[name];
    }
    
    // Serialização
    toJSON() {
        return {
            id: this.id,
            className: this.className,
            Name: this.Name,
            properties: this.properties,
            attributes: this.attributes,
            children: this.children.map(c => c.toJSON())
        };
    }
    
    static fromJSON(data, parent = null) {
        const instance = new FireInstance(data.className, parent);
        instance.id = data.id;
        instance.Name = data.Name;
        instance.properties = data.properties;
        instance.attributes = data.attributes;
        
        if (data.children) {
            for (let childData of data.children) {
                FireInstance.fromJSON(childData, instance);
            }
        }
        
        return instance;
    }
}

// Workspace Global
class Workspace extends FireInstance {
    constructor() {
        super('Workspace', null);
        this.Name = 'Workspace';
        this.instanceMap = new Map();
        
        // Criar Site root
        this.Site = new FireInstance('Site', this);
        this.registerInstance(this.Site);
    }
    
    registerInstance(instance) {
        this.instanceMap.set(instance.id, instance);
        for (let child of instance.children) {
            this.registerInstance(child);
        }
    }
    
    getInstanceById(id) {
        return this.instanceMap.get(id);
    }
    
    clear() {
        this.children = [];
        this.instanceMap.clear();
        this.Site = new FireInstance('Site', this);
        this.registerInstance(this.Site);
    }
}

// Criar workspace global
const workspace = new Workspace();
const game = workspace; // Alias para compatibilidade

// Create API
const Create = {
    Text(parent) {
        const instance = new FireInstance('Text', parent);
        workspace.registerInstance(instance);
        return instance;
    },
    
    Button(parent) {
        const instance = new FireInstance('Button', parent);
        workspace.registerInstance(instance);
        return instance;
    },
    
    Image(parent) {
        const instance = new FireInstance('Image', parent);
        workspace.registerInstance(instance);
        return instance;
    },
    
    Frame(parent) {
        const instance = new FireInstance('Frame', parent);
        workspace.registerInstance(instance);
        return instance;
    },
    
    Page(parent) {
        const instance = new FireInstance('Page', parent);
        workspace.registerInstance(instance);
        return instance;
    },
    
    Past(parent) {
        const instance = new FireInstance('Past', parent);
        workspace.registerInstance(instance);
        return instance;
    },
    
    LayoutMenu(parent) {
        const instance = new FireInstance('LayoutMenu', parent);
        workspace.registerInstance(instance);
        return instance;
    },
    
    UIGradient(parent) {
        const instance = new FireInstance('UIGradient', parent);
        instance.properties.Points = [];
        instance.properties.Rotation = 0;
        instance.properties.Enabled = true;
        workspace.registerInstance(instance);
        return instance;
    },
    
    UIStroke(parent) {
        const instance = new FireInstance('UIStroke', parent);
        instance.properties.Enabled = true;
        instance.properties.Color = '#000000';
        instance.properties.Thickness = 1;
        workspace.registerInstance(instance);
        return instance;
    },
    
    Script(parent) {
        const instance = new FireInstance('Script', parent);
        instance.properties.Source = '';
        workspace.registerInstance(instance);
        return instance;
    },
    
    StorageVent(parent) {
        const instance = new FireInstance('StorageVent', parent);
        instance.properties.connections = [];
        workspace.registerInstance(instance);
        return instance;
    }
};

// Instance.new API
const Instance = {
    new(className, parent) {
        if (Create[className]) {
            return Create[className](parent);
        }
        
        const instance = new FireInstance(className, parent);
        workspace.registerInstance(instance);
        return instance;
    }
};

// Color API
const Color = {
    RGB(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`;
    },
    
    HEX(hex) {
        return hex.startsWith('#') ? hex : `#${hex}`;
    },
    
    HSV(h, s, v) {
        // Converter HSV para RGB
        const c = (v / 100) * (s / 100);
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = (v / 100) - c;
        
        let r, g, b;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        
        return `rgb(${r}, ${g}, ${b})`;
    },
    
    New(r, g, b, a = 1) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    },
    
    locate(name) {
        const themeColors = {
            'Primary': CONFIG.THEME_COLORS.primary,
            'Secondary': CONFIG.THEME_COLORS.secondary,
            'Dark': CONFIG.THEME_COLORS.dark,
            'Light': CONFIG.THEME_COLORS.light
        };
        return themeColors[name] || '#000000';
    },
    
    random() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }
};

// Font API
const Font = {
    new(name, weight = 'normal') {
        return { Name: name, Weight: weight, Style: 'normal' };
    },
    
    txt(name) {
        return this.new(name);
    },
    
    google(name, weight = 'normal') {
        // Carregar fonte do Google Fonts
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${name.replace(' ', '+')}:wght@${weight === 'bold' ? '700' : '400'}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        return { Name: name, Weight: weight, Style: 'normal' };
    }
};

// Vector2 API
const Vector2 = {
    new(x, y) {
        return { x, y };
    },
    
    zero() {
        return { x: 0, y: 0 };
    },
    
    one() {
        return { x: 1, y: 1 };
    }
};

// Event system
class FireEvent {
    constructor(name = '') {
        this.name = name;
        this.connections = [];
    }
    
    Connect(callback) {
        const connection = {
            callback,
            connected: true,
            Disconnect() {
                this.connected = false;
            }
        };
        this.connections.push(connection);
        return connection;
    }
    
    Wait() {
        return new Promise(resolve => {
            const connection = this.Connect((...args) => {
                connection.Disconnect();
                resolve(...args);
            });
        });
    }
    
    Fire(...args) {
        for (let connection of this.connections) {
            if (connection.connected) {
                try {
                    connection.callback(...args);
                } catch (e) {
                    console.error('Event error:', e);
                }
            }
        }
    }
    
    DisconnectAll() {
        for (let connection of this.connections) {
            connection.connected = false;
        }
        this.connections = [];
    }
}

const Event = {
    new(name) {
        return new FireEvent(name);
    },
    
    on(eventName, callback) {
        if (!window._globalEvents) window._globalEvents = {};
        if (!window._globalEvents[eventName]) {
            window._globalEvents[eventName] = new FireEvent(eventName);
        }
        return window._globalEvents[eventName].Connect(callback);
    },
    
    fire(eventName, ...args) {
        if (window._globalEvents && window._globalEvents[eventName]) {
            window._globalEvents[eventName].Fire(...args);
        }
    }
};

// Task API
const task = {
    wait(seconds = 0) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    },
    
    spawn(fn, ...args) {
        setTimeout(() => fn(...args), 0);
    },
    
    delay(time, fn, ...args) {
        setTimeout(() => fn(...args), time * 1000);
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.workspace = workspace;
    window.game = game;
    window.Create = Create;
    window.Instance = Instance;
    window.Color = Color;
    window.Font = Font;
    window.Vector2 = Vector2;
    window.Event = Event;
    window.task = task;
}
