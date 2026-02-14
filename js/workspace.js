// Fire Server Workspace System
// Sistema completo de gerenciamento de componentes e hierarquia

class FireServerWorkspace {
    constructor() {
        this.root = null;
        this.instanceMap = new Map(); // Para busca O(1)
        this.nextId = 1;
        this.initialize();
    }

    initialize() {
        // Criar estrutura base
        this.root = this.createInstance('Site', null, 'workspace');
        this.root.Name = 'Site';
    }

    createInstance(className, parent, name = '') {
        const instance = new Instance(className, parent, name || className);
        instance._id = this.nextId++;
        this.instanceMap.set(instance._id, instance);
        
        if (parent) {
            parent.children.push(instance);
        }

        return instance;
    }

    locate(path) {
        if (!path) return null;
        
        const parts = path.split('/').filter(p => p);
        let current = this.root;

        for (const part of parts) {
            const child = current.children.find(c => c.Name === part);
            if (!child) return null;
            current = child;
        }

        return current;
    }

    findFirstChild(name) {
        return this.root.findFirstChild(name);
    }

    getChildren() {
        return this.root.children;
    }

    getDescendants() {
        return this.root.getDescendants();
    }

    // Serializar workspace para salvar
    serialize() {
        return this.serializeInstance(this.root);
    }

    serializeInstance(instance) {
        const data = {
            className: instance.className,
            name: instance.Name,
            properties: {},
            children: []
        };

        // Salvar propriedades
        for (const key in instance.properties) {
            data.properties[key] = instance.properties[key];
        }

        // Salvar filhos recursivamente
        for (const child of instance.children) {
            data.children.push(this.serializeInstance(child));
        }

        return data;
    }

    // Deserializar workspace do banco
    deserialize(data) {
        this.root = this.deserializeInstance(data, null);
    }

    deserializeInstance(data, parent) {
        const instance = this.createInstance(data.className, parent, data.name);
        
        // Restaurar propriedades
        for (const key in data.properties) {
            instance.properties[key] = data.properties[key];
        }

        // Restaurar filhos recursivamente
        for (const childData of data.children || []) {
            this.deserializeInstance(childData, instance);
        }

        return instance;
    }
}

// Classe de instância individual
class Instance {
    constructor(className, parent, name) {
        this.className = className;
        this.parent = parent;
        this.Name = name;
        this.children = [];
        this.properties = {};
        this.attributes = new Map();
        this._id = 0;
    }

    // Navegação
    findFirstChild(name) {
        return this.children.find(c => c.Name === name) || null;
    }

    getChildren() {
        return this.children;
    }

    getDescendants() {
        const descendants = [];
        
        const traverse = (instance) => {
            for (const child of instance.children) {
                descendants.push(child);
                traverse(child);
            }
        };

        traverse(this);
        return descendants;
    }

    // Manipulação
    destroy() {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1) {
                this.parent.children.splice(index, 1);
            }
        }

        // Destruir filhos recursivamente
        while (this.children.length > 0) {
            this.children[0].destroy();
        }
    }

    clone() {
        const cloned = new Instance(this.className, null, this.Name);
        
        // Copiar propriedades
        for (const key in this.properties) {
            cloned.properties[key] = this.properties[key];
        }

        // Copiar atributos
        this.attributes.forEach((value, key) => {
            cloned.attributes.set(key, value);
        });

        // Copiar filhos recursivamente
        for (const child of this.children) {
            const childClone = child.clone();
            childClone.parent = cloned;
            cloned.children.push(childClone);
        }

        return cloned;
    }

    // Atributos customizados
    setAttribute(name, value) {
        this.attributes.set(name, value);
    }

    getAttribute(name) {
        return this.attributes.get(name);
    }

    // Getters/Setters para propriedades comuns
    get Visible() { return this.properties.Visible !== false; }
    set Visible(value) { this.properties.Visible = value; }

    get Position() { return this.properties.Position || new Vector2(0, 0); }
    set Position(value) { this.properties.Position = value; }

    get Size() { return this.properties.Size || new Vector2(100, 100); }
    set Size(value) { this.properties.Size = value; }

    get Text() { return this.properties.Text || ''; }
    set Text(value) { this.properties.Text = value; }

    get Color() { return this.properties.Color || new Color(0, 0, 0); }
    set Color(value) { this.properties.Color = value; }

    get BackgroundColor() { return this.properties.BackgroundColor || new Color(255, 255, 255); }
    set BackgroundColor(value) { this.properties.BackgroundColor = value; }

    get BackgroundImage() { return this.properties.BackgroundImage || ''; }
    set BackgroundImage(value) { this.properties.BackgroundImage = value; }

    get Font() { return this.properties.Font || new Font('Arial'); }
    set Font(value) { this.properties.Font = value; }

    get FontSize() { return this.properties.FontSize || 16; }
    set FontSize(value) { this.properties.FontSize = value; }
}

// Classes auxiliares
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static new(x, y) {
        return new Vector2(x, y);
    }

    static get zero() {
        return new Vector2(0, 0);
    }

    static get one() {
        return new Vector2(1, 1);
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    mul(n) {
        return new Vector2(this.x * n, this.y * n);
    }

    div(n) {
        return new Vector2(this.x / n, this.y / n);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalized() {
        const mag = this.magnitude();
        return mag > 0 ? this.div(mag) : Vector2.zero;
    }
}

class Color {
    constructor(r, g, b, a = 1) {
        this.r = Math.max(0, Math.min(255, r));
        this.g = Math.max(0, Math.min(255, g));
        this.b = Math.max(0, Math.min(255, b));
        this.a = Math.max(0, Math.min(1, a));
    }

    static RGB(r, g, b) {
        return new Color(r, g, b);
    }

    static HEX(hex) {
        hex = hex.replace(/^#/, '');
        
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return new Color(r, g, b);
    }

    static HSV(h, s, v) {
        s = s / 100;
        v = v / 100;

        const c = v * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = v - c;

        let r, g, b;

        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }

        return new Color(
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255)
        );
    }

    static New(r, g, b, a) {
        return new Color(r, g, b, a);
    }

    static random() {
        return new Color(
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        );
    }

    toHex() {
        const toHex = (n) => {
            const hex = Math.round(n).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
    }

    toRGB() {
        return [this.r, this.g, this.b];
    }

    toRGBA() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    lerp(otherColor, t) {
        t = Math.max(0, Math.min(1, t));
        return new Color(
            this.r + (otherColor.r - this.r) * t,
            this.g + (otherColor.g - this.g) * t,
            this.b + (otherColor.b - this.b) * t,
            this.a + (otherColor.a - this.a) * t
        );
    }
}

class Font {
    constructor(name, weight = 'normal', style = 'normal') {
        this.Name = name;
        this.Weight = weight;
        this.Style = style;
    }

    static new(name, weight) {
        return new Font(name, weight);
    }

    static txt(name) {
        return new Font(name);
    }

    static google(name, weight) {
        // Would load from Google Fonts
        return new Font(name, weight);
    }

    toCSSString() {
        return `${this.Style} ${this.Weight} 16px ${this.Name}`;
    }
}

// Criar instância global do workspace
if (typeof window !== 'undefined') {
    window.workspace = new FireServerWorkspace();
    window.Vector2 = Vector2;
    window.Color = Color;
    window.Font = Font;
    window.Instance = Instance;
}

// Para uso em Node.js também
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FireServerWorkspace,
        Instance,
        Vector2,
        Color,
        Font
    };
}
