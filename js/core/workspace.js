// Fire Server - Workspace (Singleton Global)
// Implementa a árvore de objetos do projeto

class FireInstance {
    constructor(className, name = 'Instance') {
        this.className = className;
        this.Name = name;
        this.Parent = null;
        this.children = [];
        this.id = FireUtils.generateID();
        this.attributes = new Map();
        
        // Propriedades padrão baseadas no tipo
        this.initializeProperties();
    }

    initializeProperties() {
        // Propriedades comuns
        this.Visible = true;
        
        // Propriedades específicas por tipo
        switch(this.className) {
            case 'Text':
                this.Text = 'Texto';
                this.Color = { r: 0, g: 0, b: 0 };
                this.Font = 'Arial';
                this.FontSize = 16;
                this.Position = { x: 0, y: 0 };
                this.Size = { x: 100, y: 50 };
                break;
                
            case 'Button':
                this.Text = 'Botão';
                this.Color = { r: 255, g: 107, b: 53 };
                this.BackgroundColor = { r: 255, g: 107, b: 53 };
                this.Position = { x: 0, y: 0 };
                this.Size = { x: 120, y: 40 };
                this.Action = null;
                break;
                
            case 'Image':
                this.Image = '';
                this.Position = { x: 0, y: 0 };
                this.Size = { x: 200, y: 200 };
                this.ScaleType = 'fit';
                this.ImageColor = { r: 255, g: 255, b: 255 };
                break;
                
            case 'Page':
                this.BackgroundColor = { r: 255, g: 255, b: 255 };
                break;
                
            case 'Color':
                this.Value = { r: 0, g: 0, b: 0 };
                break;
                
            case 'UIGradient':
                this.Enabled = true;
                this.Rotation = 0;
                this.Points = [];
                break;
        }
    }

    // Métodos de navegação
    FindFirstChild(name) {
        return this.children.find(child => child.Name === name) || null;
    }

    GetChildren() {
        return [...this.children];
    }

    GetDescendants() {
        let descendants = [];
        for (const child of this.children) {
            descendants.push(child);
            descendants = descendants.concat(child.GetDescendants());
        }
        return descendants;
    }

    // Destroy - remove da árvore
    Destroy() {
        if (this.Parent) {
            const index = this.Parent.children.indexOf(this);
            if (index > -1) {
                this.Parent.children.splice(index, 1);
            }
        }
        
        // Destroy recursivo dos filhos
        for (const child of this.children) {
            child.Destroy();
        }
        
        this.children = [];
        this.Parent = null;
    }

    // Clone - cria cópia
    Clone() {
        const clone = new FireInstance(this.className, this.Name);
        
        // Copia propriedades
        for (const key in this) {
            if (key !== 'children' && key !== 'Parent' && key !== 'id') {
                if (typeof this[key] === 'object' && this[key] !== null) {
                    clone[key] = JSON.parse(JSON.stringify(this[key]));
                } else {
                    clone[key] = this[key];
                }
            }
        }
        
        // Clona filhos recursivamente
        for (const child of this.children) {
            const childClone = child.Clone();
            childClone.Parent = clone;
            clone.children.push(childClone);
        }
        
        return clone;
    }

    // Attributes
    SetAttribute(name, value) {
        this.attributes.set(name, value);
    }

    GetAttribute(name) {
        return this.attributes.get(name);
    }

    // Helper para validar hierarquia
    canHaveChild(childClassName) {
        const allowed = FireConfig.hierarchy[this.className];
        if (!allowed) return false;
        return allowed.includes(childClassName) || allowed.length === 0; // Past e comment aceitam tudo
    }
}

// Workspace Singleton
class Workspace {
    constructor() {
        if (Workspace.instance) {
            return Workspace.instance;
        }
        
        this.className = 'Workspace';
        this.Name = 'Workspace';
        this.children = [];
        this.instanceMap = new Map(); // Mapa ID -> instância para busca O(1)
        
        Workspace.instance = this;
        
        // Cria estrutura inicial
        this.initializeDefault();
    }

    initializeDefault() {
        // Cria Site raiz
        const site = this.createInstance('Site', 'Site');
        site.Parent = this;
        this.children.push(site);
        
        // Cria LayoutMenu padrão
        const layoutMenu = this.createInstance('LayoutMenu', 'MainMenu');
        layoutMenu.Parent = site;
        site.children.push(layoutMenu);
        
        // Cria Page padrão
        const page = this.createInstance('Page', 'HomePage');
        page.Parent = layoutMenu;
        layoutMenu.children.push(page);
    }

    createInstance(className, name) {
        const instance = new FireInstance(className, name);
        this.instanceMap.set(instance.id, instance);
        return instance;
    }

    // Locate - caminho relativo
    Locate(path) {
        const parts = path.split('/').filter(p => p);
        let current = this;
        
        for (const part of parts) {
            if (part === '..') {
                current = current.Parent || current;
            } else {
                current = current.FindFirstChild(part);
                if (!current) return null;
            }
        }
        
        return current;
    }

    FindFirstChild(name) {
        return this.children.find(child => child.Name === name) || null;
    }

    GetChildren() {
        return [...this.children];
    }

    GetDescendants() {
        let descendants = [];
        for (const child of this.children) {
            descendants.push(child);
            descendants = descendants.concat(child.GetDescendants());
        }
        return descendants;
    }

    // Limpa tudo
    Clear() {
        for (const child of this.children) {
            child.Destroy();
        }
        this.children = [];
        this.instanceMap.clear();
        this.initializeDefault();
    }

    // Serialização para salvar
    toJSON() {
        const serialize = (instance) => {
            const data = {
                className: instance.className,
                name: instance.Name,
                properties: {},
                children: []
            };
            
            // Salva propriedades relevantes
            for (const key in instance) {
                if (!['children', 'Parent', 'id', 'className', 'Name', 'attributes'].includes(key)) {
                    data.properties[key] = instance[key];
                }
            }
            
            // Serializa filhos
            for (const child of instance.children) {
                data.children.push(serialize(child));
            }
            
            return data;
        };
        
        return this.children.map(child => serialize(child));
    }

    // Desserialização para carregar
    fromJSON(data) {
        this.Clear();
        
        const deserialize = (data, parent) => {
            const instance = this.createInstance(data.className, data.name);
            
            // Restaura propriedades
            for (const key in data.properties) {
                instance[key] = data.properties[key];
            }
            
            // Define pai
            instance.Parent = parent;
            if (parent) {
                parent.children.push(instance);
            } else {
                this.children.push(instance);
            }
            
            // Desserializa filhos
            for (const childData of data.children) {
                deserialize(childData, instance);
            }
            
            return instance;
        };
        
        for (const itemData of data) {
            deserialize(itemData, null);
        }
    }
}

// Cria instância global do workspace
const workspace = new Workspace();

// Alias para compatibilidade
const game = workspace;

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.workspace = workspace;
    window.game = game;
    window.FireInstance = FireInstance;
    window.Workspace = Workspace;
}
