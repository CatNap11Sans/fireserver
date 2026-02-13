// Fire Server - Lua Sandbox
// Ambiente seguro para execução de código Lua usando Fengari

class LuaSandbox {
    constructor() {
        this.L = null;
        this.instructionLimit = 100000;
        this.instructionCount = 0;
        this.isRunning = false;
        this.outputCallback = null;
    }

    async init() {
        // Aguarda Fengari carregar
        if (typeof fengari === 'undefined') {
            console.warn('Aguardando Fengari carregar...');
            await this.waitForFengari();
        }

        const { lua, lauxlib, lualib } = fengari;

        // Cria novo estado Lua
        this.L = lauxlib.luaL_newstate();
        
        // Carrega bibliotecas básicas
        lualib.luaL_openlibs(this.L);
        
        // Remove bibliotecas perigosas
        this.removeDangerousLibs();
        
        // Configura print customizado
        this.setupCustomPrint();
        
        console.log('✅ Sandbox Lua inicializado');
    }

    waitForFengari() {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (typeof fengari !== 'undefined') {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
    }

    removeDangerousLibs() {
        const { lua } = fengari;
        
        const dangerous = ['io', 'os', 'debug', 'package'];
        dangerous.forEach(lib => {
            lua.lua_pushnil(this.L);
            lua.lua_setglobal(this.L, lua.to_luastring(lib));
        });
    }

    setupCustomPrint() {
        const { lua, lauxlib } = fengari;
        
        const customPrint = (L) => {
            const nargs = lua.lua_gettop(L);
            const args = [];
            
            for (let i = 1; i <= nargs; i++) {
                const str = lauxlib.luaL_tolstring(L, i, null);
                args.push(lua.to_jsstring(str));
                lua.lua_pop(L, 1);
            }
            
            const message = args.join('\t');
            
            if (this.outputCallback) {
                this.outputCallback(message, 'info');
            }
            
            return 0;
        };

        lua.lua_pushcfunction(this.L, customPrint);
        lua.lua_setglobal(this.L, lua.to_luastring('print'));
    }

    setOutputCallback(callback) {
        this.outputCallback = callback;
    }

    async execute(code) {
        const { lua, lauxlib } = fengari;
        
        if (this.isRunning) {
            throw new Error('Script já está em execução');
        }

        this.isRunning = true;
        this.instructionCount = 0;

        try {
            const loadResult = lauxlib.luaL_loadstring(this.L, lua.to_luastring(code));

            if (loadResult !== lua.LUA_OK) {
                const error = lua.lua_tostring(this.L, -1);
                const errorMsg = lua.to_jsstring(error);
                lua.lua_pop(this.L, 1);
                throw new Error(errorMsg);
            }

            const execResult = lua.lua_pcall(this.L, 0, 0, 0);

            if (execResult !== lua.LUA_OK) {
                const error = lua.lua_tostring(this.L, -1);
                const errorMsg = lua.to_jsstring(error);
                lua.lua_pop(this.L, 1);
                throw new Error(errorMsg);
            }

            return { success: true, instructionCount: this.instructionCount };

        } finally {
            this.isRunning = false;
        }
    }

    registerFunction(name, func) {
        const { lua } = fengari;
        
        const wrapper = (L) => {
            try {
                const nargs = lua.lua_gettop(L);
                const args = [];
                
                for (let i = 1; i <= nargs; i++) {
                    args.push(this.luaToJS(L, i));
                }
                
                const result = func(...args);
                
                if (result !== undefined) {
                    this.jsToLua(L, result);
                    return 1;
                }
                return 0;
                
            } catch (error) {
                console.error('Erro:', error);
                return 0;
            }
        };

        lua.lua_pushcfunction(this.L, wrapper);
        lua.lua_setglobal(this.L, lua.to_luastring(name));
    }

    luaToJS(L, index) {
        const { lua } = fengari;
        const type = lua.lua_type(L, index);
        
        switch (type) {
            case lua.LUA_TNIL:
                return null;
            case lua.LUA_TBOOLEAN:
                return lua.lua_toboolean(L, index);
            case lua.LUA_TNUMBER:
                return lua.lua_tonumber(L, index);
            case lua.LUA_TSTRING:
                return lua.to_jsstring(lua.lua_tostring(L, index));
            default:
                return null;
        }
    }

    jsToLua(L, value) {
        const { lua } = fengari;
        
        if (value === null || value === undefined) {
            lua.lua_pushnil(L);
        } else if (typeof value === 'boolean') {
            lua.lua_pushboolean(L, value);
        } else if (typeof value === 'number') {
            lua.lua_pushnumber(L, value);
        } else if (typeof value === 'string') {
            lua.lua_pushstring(L, lua.to_luastring(value));
        }
    }

    stop() {
        this.isRunning = false;
    }

    reset() {
        this.stop();
        this.init();
    }
}

// Cria instância global
window.luaSandbox = new LuaSandbox();
