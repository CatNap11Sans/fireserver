# 🔥 Fire Server

**Crie sites gratuitamente usando Lua**

Fire Server é uma plataforma inovadora que permite criar sites profissionais sem custo, usando uma linguagem visual baseada em Lua e uma interface intuitiva.

## ✨ Características

- 🎨 **Editor Visual** - Interface moderna com Monaco Editor
- 📜 **Linguagem Lua** - Use scripts Lua para criar funcionalidades avançadas
- 🔒 **Seguro** - Sandbox protegido e código validado
- 💰 **100% Gratuito** - Sem custos ocultos
- 📱 **Responsivo** - Funciona em qualquer dispositivo
- ⚡ **Preview em Tempo Real** - Veja as mudanças instantaneamente

## 🚀 Como Usar

1. **Acesse o site**: [fireserver.dev](https://catnap11sans.github.io/fireserver/)
2. **Faça login** com Google ou Discord
3. **Use o editor** para criar seu site
4. **Publique** e compartilhe sua URL personalizada

## 📖 Documentação

A documentação completa está disponível em [fireserver.dev/pages/docs.html](https://catnap11sans.github.io/fireserver/pages/docs.html)

### Exemplo Rápido

```lua
-- Acessa a página principal
local page = workspace:Locate("Site/MainMenu/HomePage")

-- Cria um texto
local text = Create.Text(page)
text.Name = "WelcomeText"
text.Text = "Bem-vindo ao Fire Server!"
text.Position = Vector2.new(50, 50)
text.Size = Vector2.new(300, 50)

-- Define a cor
local color = Create.Color(text)
color.Value = Color.RGB(255, 107, 53)

-- Cria um botão
local button = Create.Button(page)
button.Text = "Clique aqui"
button.Position = Vector2.new(50, 150)

-- Ação do botão
button.Action = function()
    print("Botão clicado!")
    text.Text = "Você clicou no botão!"
end
```

## 🏗️ Estrutura do Projeto

```
fire-server/
├── index.html          # Landing page
├── css/
│   ├── main.css       # Estilos principais
│   └── editor.css     # Estilos do editor
├── js/
│   ├── core/
│   │   ├── config.js      # Configuração central
│   │   ├── workspace.js   # Sistema de workspace
│   │   └── editor.js      # Editor principal
│   ├── lua/
│   │   ├── lua-sandbox.js # Sandbox seguro
│   │   └── lua-api.js     # API Lua
│   └── api/               # APIs futuras
├── pages/
│   ├── editor.html    # Página do editor
│   ├── viewer.html    # Visualizador de sites
│   ├── docs.html      # Documentação
│   └── login.html     # Login (a implementar)
├── assets/            # Assets estáticos
└── libs/              # Bibliotecas externas
```

## 🔧 Tecnologias

- **Monaco Editor** - Editor de código VS Code
- **Fengari** - Lua VM em JavaScript
- **GitHub Pages** - Hospedagem gratuita
- **Vanilla JavaScript** - Sem frameworks pesados

## 📝 Limites

- Máximo de **200 linhas** de código
- Máximo de **100 elementos** renderizados
- Máximo de **10 imagens** por site
- Máximo de **10.000 caracteres** de texto total

## 🗺️ Roadmap

### ✅ Fase 0 - Conceito
- [x] Definir regras centrais
- [x] Estruturar hierarquia de componentes

### ✅ Fase 1 - Frontend Base (GitHub Pages)
- [x] Landing page
- [x] Página de editor
- [x] Página de visualização
- [x] Roteamento básico

### 🚧 Fase 2 - Editor de Código (Em Progresso)
- [x] Integração Monaco Editor
- [x] Highlight de sintaxe Lua
- [ ] Preview em tempo real completo
- [ ] Detecção de erros por linha

### 📋 Fase 3 - Linguagem DSL
- [ ] Parser completo
- [ ] Validações
- [ ] Geração de AST
- [ ] Renderização segura

### 🤖 Fase 4 - IA Assistente
- [ ] Sugestões contextuais
- [ ] Explicação de erros
- [ ] Tradução de ideias em código

### 🔐 Fase 5 - Autenticação
- [ ] Login Google
- [ ] Login Discord
- [ ] Gerenciamento de sessões

### 💬 Fase 6 - Bot Discord
- [ ] Comandos básicos
- [ ] Integração com plataforma

### 🛡️ Fase 7 - Segurança
- [ ] Rate limiting
- [ ] CSP headers
- [ ] Monitoramento de abuso

### 🎉 Fase 8 - Lançamento
- [ ] Documentação completa
- [ ] Exemplos oficiais
- [ ] Canal de feedback

## 👥 Equipes

- Fire Server developments
- Sawi Fox Studios
- CnSScSc projects
- CatNap11Sans developments
- Kiwi's Productions

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para mais informações.

## 📞 Contato

- Discord: [discord.gg/fireserver](https://discord.gg/fireserver)
- GitHub: [github.com/catnap11sans/fireserver](https://github.com/catnap11sans/fireserver)
- Site: [fireserver.dev](https://catnap11sans.github.io/fireserver/)

---

Feito com 🔥 por Fire Server Team
