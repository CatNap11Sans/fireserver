// Lua Bridge - Integrates Fengari (Lua in JS) with Fire Server
// Provides safe Lua execution environment

class LuaBridge {
    constructor() {
        this.L = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Fengari should be loaded via script tag
            if (typeof fengari === 'undefined') {
                throw new Error('Fengari não está carregado');
            }

            this.L = fengari.lauxlib.luaL_newstate();
            fengari.lualib.luaL_openlibs(this.L);

            // Setup sandbox
            this.setupSandbox();
            
            // Expose Fire Server API to Lua
            this.exposeAPI();

            this.initialized = true;
            console.log('Lua Bridge inicializado com sucesso');
            
        } catch (error) {
            console.error('Erro ao inicializar Lua Bridge:', error);
        }
    }

    setupSandbox() {
        // Remove dangerous functions from Lua environment
        const dangerousFunctions = [
            'io', 'os', 'debug', 'package',
            'load', 'loadfile', 'loadstring',
            'dofile', 'getfenv', 'setfenv'
        ];

        dangerousFunctions.forEach(func => {
            this.executeCode(`${func} = nil`);
        });

        // Set instruction limit (prevent infinite loops)
        // This would require lua_sethook implementation
    }

    exposeAPI() {
        // Expose workspace to Lua
        this.setGlobal('workspace', {
            Locate: (path) => workspace.locate(path),
            FindFirstChild: (name) => workspace.findFirstChild(name),
            GetChildren: () => workspace.getChildren(),
            GetDescendants: () => workspace.getDescendants()
        });

        // Expose Color
        this.setGlobal('Color', {
            RGB: (r, g, b) => Color.RGB(r, g, b),
            HEX: (hex) => Color.HEX(hex),
            HSV: (h, s, v) => Color.HSV(h, s, v),
            New: (r, g, b, a) => Color.New(r, g, b, a),
            random: () => Color.random()
        });

        // Expose Vector2
        this.setGlobal('Vector2', {
            new: (x, y) => Vector2.new(x, y),
            zero: Vector2.zero,
            one: Vector2.one
        });

        // Expose task utilities
        this.setGlobal('task', {
            wait: (seconds) => {
                return new Promise(resolve => setTimeout(resolve, (seconds || 0) * 1000));
            },
            spawn: (func) => {
                setTimeout(func, 0);
            }
        });

        // Expose print for debugging
        this.setGlobal('print', (...args) => {
            console.log('[Lua]', ...args);
        });

        this.setGlobal('warn', (...args) => {
            console.warn('[Lua]', ...args);
        });

        this.setGlobal('error', (msg) => {
            throw new Error('[Lua Error] ' + msg);
        });
    }

    setGlobal(name, value) {
        if (!this.L) return;

        try {
            const lua = fengari.lua;
            const lauxlib = fengari.lauxlib;

            // Convert JS value to Lua
            if (typeof value === 'function') {
                lua.lua_pushcfunction(this.L, value);
            } else if (typeof value === 'object') {
                // Create Lua table for object
                lua.lua_newtable(this.L);
                
                for (const key in value) {
                    lua.lua_pushstring(this.L, key);
                    
                    if (typeof value[key] === 'function') {
                        lua.lua_pushcfunction(this.L, value[key]);
                    } else {
                        fengari.interop.push(this.L, value[key]);
                    }
                    
                    lua.lua_settable(this.L, -3);
                }
            } else {
                fengari.interop.push(this.L, value);
            }

            lua.lua_setglobal(this.L, name);
            
        } catch (error) {
            console.error('Error setting global:', error);
        }
    }

    executeCode(code) {
        if (!this.L) {
            throw new Error('Lua Bridge não inicializado');
        }

        try {
            const lauxlib = fengari.lauxlib;
            
            // Load and execute Lua code
            const status = lauxlib.luaL_dostring(this.L, code);
            
            if (status !== fengari.lua.LUA_OK) {
                const error = fengari.lua.lua_tostring(this.L, -1);
                throw new Error(error);
            }

            return true;
            
        } catch (error) {
            console.error('Lua execution error:', error);
            throw error;
        }
    }

    executeScript(script) {
        // Execute a script instance
        if (!script || !script.Source) {
            return;
        }

        try {
            this.executeCode(script.Source);
        } catch (error) {
            console.error('Script error in', script.Name, ':', error);
        }
    }

    destroy() {
        if (this.L) {
            fengari.lua.lua_close(this.L);
            this.L = null;
            this.initialized = false;
        }
    }
}

// Create global instance
if (typeof window !== 'undefined') {
    window.luaBridge = new LuaBridge();
    
    // Auto-initialize when Fengari is available
    if (typeof fengari !== 'undefined') {
        window.luaBridge.initialize();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LuaBridge;
}
