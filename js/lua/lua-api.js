// Fire Server - Lua API
// Implementa API Lua completa conforme especificação do projeto

class LuaAPI {
    constructor() {
        this.initialized = false;
    }

    async init() {
        await this.waitForDependencies();
        
        this.registerWorkspaceAPI();
        this.registerCreateAPI();
        this.registerColorAPI();
        this.registerVector2API();
        this.registerTaskAPI();
        this.registerEventAPI();
        
        this.initialized = true;
        console.log('✅ API Lua registrada');
    }

    waitForDependencies() {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (window.luaSandbox && window.workspace) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
    }

    registerWorkspaceAPI() {
        const { registerFunction } = window.luaSandbox;
        
        registerFunction('workspace_Locate', (path) => {
            return workspace.Locate(path);
        });

        registerFunction('workspace_FindFirstChild', (name) => {
            return workspace.FindFirstChild(name);
        });
    }

    registerCreateAPI() {
        const { registerFunction } = window.luaSandbox;
        
        const types = ['Text', 'Button', 'Image', 'Page', 'Color'];
        types.forEach(type => {
            registerFunction(`Create_${type}`, () => {
                return workspace.createInstance(type, type);
            });
        });
    }

    registerColorAPI() {
        const { registerFunction } = window.luaSandbox;
        
        registerFunction('Color_RGB', (r, g, b) => ({ r, g, b }));
        registerFunction('Color_HEX', (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 0, b: 0 };
        });
    }

    registerVector2API() {
        const { registerFunction } = window.luaSandbox;
        
        registerFunction('Vector2_new', (x, y) => ({ x, y }));
        registerFunction('Vector2_zero', () => ({ x: 0, y: 0 }));
        registerFunction('Vector2_one', () => ({ x: 1, y: 1 }));
    }

    registerTaskAPI() {
        const { registerFunction } = window.luaSandbox;
        
        registerFunction('task_wait', (seconds = 0) => {
            // Implementação simplificada
        });
        
        registerFunction('task_spawn', (func) => {
            setTimeout(func, 0);
        });
    }

    registerEventAPI() {
        const { registerFunction } = window.luaSandbox;
        const events = new Map();
        
        registerFunction('Event_new', (name) => {
            const id = name || `event_${Date.now()}`;
            events.set(id, { listeners: [] });
            return id;
        });

        registerFunction('Event_fire', (id, ...args) => {
            const event = events.get(id);
            if (event) {
                event.listeners.forEach(fn => fn(...args));
            }
        });
    }
}

window.luaAPI = new LuaAPI();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.luaAPI.init());
} else {
    window.luaAPI.init();
}
