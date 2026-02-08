# 🔥 Fire Server v2.0 - Instalação Rápida

## 📦 O que tem neste ZIP?

```
fire-server-v2.zip
├── 📄 index.html              # Página inicial
├── 📄 DEMO.html               # Demonstração das novidades
├── 📖 README-V2.md            # Documentação completa
├── 📖 GUIA-VISUAL.md          # Guia visual
├── 📖 QUICK-START.md          # Guia rápido
│
├── 📁 pages/
│   ├── editor-v2.html         # ✨ Editor novo (USE ESTE!)
│   ├── editor.html            # Editor antigo
│   ├── viewer.html            # Visualizador
│   └── docs.html              # Documentação
│
├── 📁 js/
│   ├── syntax-highlighter.js  # ✨ Cores customizadas
│   ├── color-picker.js        # ✨ Seletor de cores
│   ├── smart-ai.js            # ✨ IA que aprende
│   ├── editor-v2.js           # ✨ Editor atualizado
│   ├── dsl-renderer.js        # ✨ Navegação corrigida
│   ├── dsl-parser.js          # Parser DSL
│   └── ...
│
├── 📁 discord-bot/            # ✨ Bot Discord completo
│   ├── bot.js                 # Código do bot
│   ├── package.json           # Dependências
│   ├── .env.example           # Configuração
│   └── README.md              # Guia do bot
│
├── 📁 css/                    # Estilos
└── 📁 assets/                 # Exemplos e recursos
```

## 🚀 Como Usar

### Opção 1: Usar Localmente (Sem Servidor)

1. **Extraia o ZIP**
   ```
   Clique com botão direito → Extrair aqui
   ```

2. **Abra o Editor**
   ```
   Navegue até: fire-server/pages/editor-v2.html
   Clique duas vezes para abrir no navegador
   ```

3. **Pronto!** 🎉
   - Syntax highlighting funcionando
   - Color picker disponível
   - IA aprendendo com você

### Opção 2: Usar com Servidor Local (Recomendado)

1. **Instale um servidor local**
   
   **Opção A: Python (mais fácil)**
   ```bash
   # No terminal, dentro da pasta fire-server:
   python -m http.server 8000
   
   # Ou no Python 2:
   python -m SimpleHTTPServer 8000
   ```
   
   **Opção B: Node.js**
   ```bash
   # Instale o http-server:
   npm install -g http-server
   
   # Execute:
   http-server -p 8000
   ```
   
   **Opção C: VS Code**
   ```
   1. Instale extensão "Live Server"
   2. Clique direito em index.html
   3. "Open with Live Server"
   ```

2. **Acesse no navegador**
   ```
   http://localhost:8000
   ```

3. **Navegue até o Editor**
   ```
   http://localhost:8000/pages/editor-v2.html
   ```

### Opção 3: GitHub Pages (Online)

1. **Crie repositório no GitHub**
   ```bash
   git init
   git add .
   git commit -m "Fire Server v2.0"
   ```

2. **Faça push**
   ```bash
   git remote add origin https://github.com/seu-usuario/fire-server.git
   git branch -M main
   git push -u origin main
   ```

3. **Ative GitHub Pages**
   ```
   Settings → Pages → Source: main branch → Save
   ```

4. **Acesse**
   ```
   https://seu-usuario.github.io/fire-server
   ```

## 🤖 Configurar Bot Discord

1. **Entre na pasta do bot**
   ```bash
   cd fire-server/discord-bot
   ```

2. **Instale dependências**
   ```bash
   npm install
   ```

3. **Configure o token**
   ```bash
   # Copie o exemplo:
   cp .env.example .env
   
   # Edite .env e adicione seu token:
   DISCORD_TOKEN=seu_token_aqui
   ```

4. **Inicie o bot**
   ```bash
   npm start
   ```

5. **Bot online!** 🎉
   ```
   Use /ajuda no Discord para ver comandos
   ```

## 📝 Primeiro Uso

### 1. Abra o Editor v2

```
pages/editor-v2.html
```

### 2. Veja o Template

O editor já vem com um código de exemplo:

```dsl
# Bem-vindo ao Fire Server! 🔥

page inicial
title "Meu Primeiro Site"

load estilo1 :color("#2596be"); size("18")

text bemvindo ("Olá! Bem-vindo 👋", estilo1)
jump

text sobre ("Crie sites incríveis!", color("#333"))

button contato ("Contato" link "mailto:seu@email.com")

end
```

### 3. Veja as Cores!

Repare que cada comando tem uma cor diferente:
- `page` = vermelho
- `text` = amarelo
- `button` = roxo
- etc.

### 4. Teste o Color Picker

1. Clique no quadrado colorido ao lado de `color("#2596be")`
2. Escolha uma nova cor
3. Clique em "Aplicar"
4. Veja o código atualizado!

### 5. Teste a IA

1. Faça um erro proposital:
   ```dsl
   text msg Olá
   ```
   
2. A IA vai detectar e sugerir:
   ```dsl
   text msg ("Olá")
   ```
   
3. Clique em "Aplicar" para corrigir!

## 🎯 Atalhos do Editor

| Atalho | Ação |
|--------|------|
| `Ctrl+S` | Salvar |
| `Ctrl+Enter` | Publicar |
| `Ctrl+H` | Abrir IA |
| `Ctrl+Space` | Autocompletar |
| `Tab` | Indentar |

## 🐛 Problemas Comuns

### "O editor não abre"

**Solução:** Use um servidor local (veja Opção 2 acima)

### "As cores não aparecem"

**Solução:** 
1. Verifique se está usando `editor-v2.html` (não o `editor.html`)
2. Recarregue a página (F5)

### "Color picker não funciona"

**Solução:**
1. Certifique-se de usar o formato: `color("#HEXCODE")`
2. Clique exatamente no quadrado colorido

### "IA não sugere nada"

**Solução:**
1. A IA aprende com o tempo
2. Cometa alguns erros primeiro
3. Depois ela vai começar a sugerir

### "Bot não inicia"

**Solução:**
1. Verifique se tem Node.js instalado
2. Execute `npm install` primeiro
3. Verifique se o token está no `.env`

## 📚 Documentação

- **README-V2.md** - Documentação completa
- **GUIA-VISUAL.md** - Tutorial com imagens
- **QUICK-START.md** - Guia rápido original
- **discord-bot/README.md** - Guia do bot

## 🎨 Arquivos Importantes

### Para usar o editor:
```
pages/editor-v2.html  ← Abra este!
```

### Para ver a demo:
```
DEMO.html  ← Abra este!
```

### Para configurar o bot:
```
discord-bot/bot.js
discord-bot/.env
```

## ✅ Checklist de Instalação

- [ ] Extraí o ZIP
- [ ] Abri `DEMO.html` para ver as novidades
- [ ] Abri `pages/editor-v2.html`
- [ ] Vi as cores do syntax highlighting
- [ ] Testei o color picker
- [ ] Vi a IA em ação
- [ ] (Opcional) Configurei o bot Discord

## 🆘 Precisa de Ajuda?

1. **Leia a documentação**
   - README-V2.md
   - GUIA-VISUAL.md

2. **Veja exemplos**
   - assets/examples.md
   - assets/personal.dsl
   - assets/links-bio.dsl

3. **Use o bot Discord**
   - `/ajuda` para comandos
   - `/dsl [comando]` para sintaxe
   - `/exemplos` para ver exemplos

## 🎉 Está Pronto!

Agora você tem:
- ✅ Editor com cores
- ✅ Color picker visual
- ✅ IA que aprende
- ✅ Navegação funcionando
- ✅ Bot Discord completo

**Divirta-se criando sites!** 🔥

---

**Dica:** Abra `DEMO.html` primeiro para ver tudo funcionando!
