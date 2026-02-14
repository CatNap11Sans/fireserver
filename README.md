# 🔥 Fire Server - Plataforma de Criação de Sites

Fire Server é uma plataforma completa para criação de sites gratuita e poderosa, desenvolvida pelas equipes:
- Fire Server developments
- Sawi Fox Studios
- CnSScSc projects
- CatNap11Sans developments
- Kiwi's Productions

## 📋 Características Principais

- ✅ **Editor Visual**: Interface intuitiva com Monaco Editor
- ✅ **DSL Customizada**: Linguagem própria para criação de sites
- ✅ **Preview em Tempo Real**: Veja as mudanças instantaneamente
- ✅ **Autenticação Segura**: Login com Email, Google e Discord
- ✅ **IA Assistente**: Ajuda inteligente durante a criação
- ✅ **Workspace Hierárquico**: Sistema organizado de componentes
- ✅ **Scripts Lua**: Execute código com Fengari
- ✅ **GitHub Pages**: Hospedagem gratuita
- ✅ **100% Seguro**: Proteção contra injeção de código

## 🚀 Como Começar

### Requisitos

- Conta Google ou Discord (opcional)
- Email e senha
- Navegador moderno (Chrome, Firefox, Edge, Safari)

### Instalação Local

1. Clone este repositório:
```bash
git clone https://github.com/catnap11sans/fireserver.git
cd fireserver
```

2. Configure o Firebase:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative Authentication (Email/Password e Google)
   - Ative Firestore Database
   - Copie suas credenciais para `js/firebase-config.js`

3. Hospede no GitHub Pages:
   - Crie um repositório no GitHub
   - Faça upload dos arquivos
   - Ative GitHub Pages nas configurações do repositório
   - Seu site estará disponível em `https://seu-usuario.github.io/fireserver`

### Configuração do Firebase

Edite o arquivo `js/firebase-config.js` e substitua as configurações:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

## 📚 Estrutura do Projeto

```
fireserver/
├── index.html          # Página inicial
├── login.html          # Autenticação
├── menu.html           # Dashboard do usuário
├── editor.html         # Editor de código
├── viewer.html         # Visualizador de sites
├── 404.html            # Redirecionamento
├── css/
│   ├── main.css        # Estilos principais
│   ├── menu.css        # Estilos do dashboard
│   ├── editor.css      # Estilos do editor
│   └── viewer.css      # Estilos do visualizador
└── js/
    ├── firebase-config.js  # Configuração do Firebase
    ├── auth.js             # Lógica de autenticação
    ├── menu.js             # Lógica do dashboard
    ├── workspace.js        # Sistema de workspace
    ├── main.js             # Script principal
    └── ... (outros arquivos JS)
```

## 🎨 Como Usar

### 1. Criar Conta

1. Acesse a página de login
2. Clique em "Cadastro"
3. Preencha: Email, Nome de usuário e Senha
4. Ou use "Entrar com Google"

### 2. Criar Seu Primeiro Site

1. No dashboard, clique em "Criar Novo Site"
2. Digite o nome e descrição
3. Clique em "Criar Site"
4. Você será redirecionado para o editor

### 3. Usar o Editor

O editor possui várias áreas:

- **Sidebar**: Acesso rápido a IA, Discord e Menu
- **Toolbar**: Ferramentas de seleção, teste e salvamento
- **Preview**: Visualização ao vivo do site
- **Explorer**: Árvore de componentes
- **Properties**: Propriedades do item selecionado
- **Output**: Console e erros

### 4. Componentes Disponíveis

- 📄 **Page**: Páginas do site
- 🏡 **Home**: Página inicial (obrigatória)
- 🔤 **Text**: Elementos de texto
- 🔘 **Button**: Botões interativos
- 🖼️ **Image**: Imagens
- 💬 **TextArea**: Áreas de texto editáveis
- 🎨 **ThemeColor**: Cores do tema
- ✨ **UIGradient**: Gradientes
- 🔄️ **UICorner**: Bordas arredondadas

## 🔐 Segurança

Fire Server implementa múltiplas camadas de segurança:

- ❌ Bloqueio de JavaScript do usuário
- ❌ Bloqueio de HTML cru
- ❌ Proteção contra injeção de código
- ✅ Sandbox Lua seguro
- ✅ Validação de entrada
- ✅ Escape de HTML
- ✅ Rate limiting
- ✅ CSP (Content Security Policy)

## 📏 Limites

Para garantir qualidade e performance:

- Máximo 150-200 linhas de código
- Máximo 100 elementos renderizados
- Máximo 10 imagens por site
- Máximo 10.000 caracteres de texto
- 1 site por conta Google
- 1 site por conta Discord
- 2 sites se ambas contas estiverem vinculadas

## 🤝 Contribuindo

Este é um projeto das equipes mencionadas. Para contribuir:

1. Entre no [Discord](https://discord.gg/6MWH9Gyyv3)
2. Discuta suas ideias
3. Faça um fork do repositório
4. Crie uma branch para sua feature
5. Envie um Pull Request

## 📝 Licença

Copyright © 2025 Fire Server Development Teams

Todos os direitos reservados.

## 🔗 Links Úteis

- Website: [https://catnap11sans.github.io/fireserver/](https://catnap11sans.github.io/fireserver/)
- Discord: [https://discord.gg/6MWH9Gyyv3](https://discord.gg/6MWH9Gyyv3)
- Documentação: Em breve
- Tutorial: Em breve

## 💡 Suporte

Precisa de ajuda? Entre em contato:

- Discord: [Servidor oficial](https://discord.gg/6MWH9Gyyv3)
- Issues: Abra uma issue no GitHub
- IA Assistente: Use o botão 🤖 no editor

---

**Fire Server** - A plataforma de criação de sites livre e poderosa 🔥
