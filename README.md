# 🔥 Fire Server - Plataforma de Criação de Sites Gratuita

Uma plataforma completa para criar sites gratuitamente usando DSL própria e scripts Lua (Fengari).

## 🌟 Características

- ✨ Editor visual com preview em tempo real
- 🎨 DSL simples e intuitiva
- 🚀 Scripts Lua com Fengari (Lua VM em JavaScript)
- 🔒 Ambiente 100% seguro (sandbox)
- 🤖 Assistente IA para ajuda contextual
- 💰 Totalmente gratuito
- 🌐 Hospedagem no GitHub Pages

## 📋 Equipes Envolvidas

- Fire Server Developments
- Sawi Fox Studios
- CnSScSc Projects
- CatNap11Sans Developments
- Kiwi's Productions

## 🚀 Como Começar

### 1. Configurar GitHub Pages

1. Faça fork deste repositório
2. Vá em Settings > Pages
3. Selecione branch `main` e pasta `/` (root)
4. Salve e aguarde o deploy
5. Seu site estará em: `https://seu-usuario.github.io/fireserver/`

### 2. Configurar OAuth2 (IMPORTANTE)

#### 📧 Google OAuth2

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em "APIs e Serviços" > "Tela de consentimento OAuth"
4. Configure a tela de consentimento:
   - Tipo de usuário: Externo
   - Nome do app: Fire Server
   - Email de suporte: seu email
   - Domínio autorizado: `github.io`
5. Vá em "Credenciais" > "Criar credenciais" > "ID do cliente OAuth 2.0"
6. Configure:
   - Tipo de aplicativo: Aplicativo da Web
   - Nome: Fire Server
   - URIs de redirecionamento autorizados:
     ```
     https://seu-usuario.github.io/fireserver/pages/login.html
     http://localhost:8000/pages/login.html (para testes locais)
     ```
7. Copie o **Client ID** gerado
8. Cole no arquivo `js/config.js`:
   ```javascript
   GOOGLE: {
       CLIENT_ID: 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com',
       ...
   }
   ```

#### 💬 Discord OAuth2

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em "New Application"
3. Dê um nome: "Fire Server"
4. Vá em "OAuth2" no menu lateral
5. Em "Redirects", adicione:
   ```
   https://seu-usuario.github.io/fireserver/pages/login.html
   http://localhost:8000/pages/login.html
   ```
6. Copie o **Client ID**
7. Cole no arquivo `js/config.js`:
   ```javascript
   DISCORD: {
       CLIENT_ID: 'SEU_CLIENT_ID_AQUI',
       ...
   }
   ```

### 3. Testar Localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/fireserver.git
cd fireserver

# Inicie um servidor local (escolha uma opção):

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (npx)
npx http-server -p 8000

# PHP
php -S localhost:8000

# Acesse http://localhost:8000
```

## 📚 Estrutura do Projeto

```
fireserver/
├── index.html              # Página inicial
├── 404.html               # Página de erro
├── css/
│   ├── main.css          # Estilos principais
│   └── editor.css        # Estilos do editor
├── js/
│   ├── config.js         # Configurações globais
│   ├── workspace.js      # Sistema de workspace
│   ├── dsl-parser.js     # Parser da DSL
│   ├── editor.js         # Editor principal
│   └── lua-api.js        # API Lua/Fengari
├── pages/
│   ├── editor.html       # Editor de código
│   ├── login.html        # Página de login
│   ├── viewer.html       # Visualizador de sites
│   └── docs.html         # Documentação
├── assets/
│   └── examples/         # Exemplos de sites
├── discord-bot/          # Bot Discord
│   ├── bot.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🎨 DSL - Linguagem de Marcação

A DSL do Fire Server é simples e poderosa:

```dsl
PAGE "Início"
BACKGROUND #FF6B35
TEXT "Bem-vindo ao meu site!"
BUTTON "Clique aqui" https://exemplo.com
IMAGE "https://exemplo.com/imagem.jpg"
```

### Comandos Disponíveis

- `PAGE "nome"` - Criar nova página
- `TEXT "conteúdo"` - Adicionar texto
- `BUTTON "texto" [url]` - Criar botão
- `IMAGE "url"` - Adicionar imagem
- `COLOR #hex` - Definir cor do texto
- `BACKGROUND #hex ou "url"` - Definir fundo
- `GRADIENT #cor1 #cor2` - Criar gradiente
- `LINK "texto" "url"` - Criar link

## 🔧 API Lua (Fengari)

### Workspace

```lua
-- Navegação
workspace:Locate("caminho/para/objeto")
workspace:FindFirstChild("nome")
workspace:GetChildren()
workspace:GetDescendants()
```

### Criação de Componentes

```lua
-- Criar elementos
local text = Create.Text(parent)
text.Text = "Olá, mundo!"
text.Color = Color.RGB(255, 107, 53)
text.Position = Vector2.new(10, 10)

local button = Create.Button(parent)
button.Text = "Clique aqui"
button.Action = function()
    print("Botão clicado!")
end
```

### Cores

```lua
-- Diferentes formas de criar cores
Color.RGB(255, 107, 53)
Color.HEX("#FF6B35")
Color.HSV(15, 80, 100)
Color.New(255, 107, 53, 0.8) -- com alpha
Color.locate("Primary") -- do tema
Color.random()
```

### Eventos

```lua
local event = Event.new()

event:Connect(function(msg)
    print("Recebido:", msg)
end)

event:Fire("Olá!")
```

### Tarefas

```lua
-- Aguardar
task.wait(2) -- 2 segundos

-- Executar função
task.spawn(function()
    print("Executando...")
end)

-- Atrasar execução
task.delay(1, function()
    print("Após 1 segundo")
end)
```

## 🔒 Segurança

O Fire Server implementa várias camadas de segurança:

- ✅ Sandbox Lua isolado
- ✅ Validação de URLs (apenas HTTPS)
- ✅ Escape de HTML automático
- ✅ Rate limiting
- ✅ CSP (Content Security Policy)
- ✅ Sem JavaScript do usuário no DOM
- ✅ Limites de recursos

### Limites

- Máx. 200 linhas de DSL
- Máx. 100 elementos renderizados
- Máx. 10 imagens por site
- Máx. 10.000 caracteres de texto

## 📝 Regras de Conta

- **Gmail**: 1 site por conta
- **Discord**: 1 site por conta
- **Ambos**: 2 sites no total

## 🌐 URLs dos Sites

Formato: `/username-0000`

Regras:
- Apenas letras minúsculas, números, `-` e `_`
- Não pode começar ou terminar com `-` ou `_`
- Símbolos duplicados não permitidos
- Mínimo 3 caracteres, máximo 20

Exemplos válidos:
- `/joao-1234`
- `/maria_silva-5678`
- `/dev-fire-9999`

## 🤖 Bot Discord

O Fire Server inclui um bot Discord para facilitar o acesso.

### Configurar o Bot

1. Vá em [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma aplicação
3. Vá em "Bot" e clique em "Add Bot"
4. Copie o token
5. No diretório `discord-bot/`:

```bash
# Instalar dependências
npm install

# Configurar variáveis
cp .env.example .env
# Edite .env e adicione seu token

# Executar bot
node bot.js
```

### Comandos do Bot

- `/login` - Link para fazer login
- `/perfil @user` - Ver perfil do usuário
- `/ajuda` - Mostrar ajuda

## 🎯 Roadmap

- [x] Fase 0: Conceito
- [x] Fase 1: Frontend base
- [x] Fase 2: Editor de código
- [x] Fase 3: Linguagem DSL
- [x] Fase 4: Assistente IA
- [x] Fase 5: Autenticação OAuth2
- [ ] Fase 6: Bot Discord completo
- [ ] Fase 7: Melhorias de segurança
- [ ] Fase 8: Lançamento oficial

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para mais detalhes.

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🔗 Links Úteis

- [Documentação Completa](pages/docs.html)
- [Exemplos](assets/examples/)
- [Fengari Docs](https://fengari.io/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## 💬 Suporte

- Discord: [Link do servidor]
- GitHub Issues: [Reportar problema](https://github.com/catnap11sans/fireserver/issues)
- Email: suporte@fireserver.dev

---

Feito com 🔥 por Fire Server Developments e equipe
