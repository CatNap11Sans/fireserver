# 📦 Guia de Instalação - Fire Server

Este guia irá ajudá-lo a configurar o Fire Server do zero.

## 🔧 Requisitos

- Conta no GitHub
- Conta no Firebase (gratuita)
- Editor de código (VS Code recomendado)
- Git instalado

## 📝 Passo a Passo

### 1. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nomeie seu projeto (ex: "fire-server")
4. Desative Google Analytics (opcional)
5. Clique em "Criar projeto"

#### Ativar Authentication

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Ative os seguintes provedores:
   - **Email/Senha**: Obrigatório
   - **Google**: Recomendado
   - **Discord**: Opcional (requer configuração OAuth)

#### Ativar Firestore

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Selecione "Iniciar no modo de teste" (depois configure regras)
4. Escolha uma localização (ex: southamerica-east1)

#### Configurar Regras de Segurança do Firestore

Após criar o banco, vá em "Regras" e substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Usernames collection
    match /usernames/{username} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.username == username;
    }
    
    // Sites collection
    match /sites/{siteId} {
      allow read: if resource.data.visibility == 'public' || 
                    (request.auth != null && request.auth.uid == resource.data.userId);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

#### Obter Credenciais do Firebase

1. Clique no ícone de engrenagem (⚙️) e vá em "Configurações do projeto"
2. Role até "Seus apps"
3. Clique no ícone da web (</>)
4. Registre o app (nome: "Fire Server Web")
5. Copie o código de configuração

### 2. Configurar o Projeto

1. Clone ou baixe este repositório
2. Abra `js/firebase-config.js`
3. Substitua as credenciais do Firebase pelas suas:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### 3. Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Clique em "New repository"
3. Nome: `fireserver` (ou outro de sua escolha)
4. Deixe público
5. NÃO adicione README, .gitignore ou license
6. Clique em "Create repository"

### 4. Fazer Upload dos Arquivos

#### Opção A: Via Git (Recomendado)

```bash
cd /caminho/para/fireserver
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/fireserver.git
git push -u origin main
```

#### Opção B: Via Interface Web

1. No repositório, clique em "uploading an existing file"
2. Arraste todos os arquivos do projeto
3. Clique em "Commit changes"

### 5. Ativar GitHub Pages

1. No repositório, vá em "Settings" (Configurações)
2. No menu lateral, clique em "Pages"
3. Em "Source", selecione:
   - Branch: `main`
   - Folder: `/ (root)`
4. Clique em "Save"
5. Aguarde alguns minutos
6. Seu site estará disponível em: `https://SEU-USUARIO.github.io/fireserver`

### 6. Verificação Google Search Console (Opcional)

Para seu site aparecer no Google:

1. Acesse [Google Search Console](https://search.google.com/search-console)
2. Adicione sua propriedade: `https://SEU-USUARIO.github.io/fireserver`
3. Escolha "Upload de arquivo HTML" para verificação
4. Baixe o arquivo fornecido
5. Faça upload do arquivo na raiz do seu repositório
6. Volte ao Search Console e clique em "Verificar"

## 🎨 Personalização

### Alterar Cores

Edite `css/main.css` e modifique as variáveis CSS:

```css
:root {
    --primary-color: #ff6b35;    /* Cor principal */
    --secondary-color: #f7931e;  /* Cor secundária */
    /* ... */
}
```

### Alterar Logo e Textos

Edite `index.html` e modifique:
- Título da página
- Descrição
- Textos de apresentação
- Links do rodapé

## 🔐 Configurar Discord OAuth (Opcional)

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação
3. Em "OAuth2", adicione redirect URL:
   - `https://SEU-PROJETO.firebaseapp.com/__/auth/handler`
4. Copie Client ID e Client Secret
5. No Firebase Console:
   - Vá em Authentication > Sign-in method
   - Ative "Discord"
   - Cole as credenciais

## 🤖 Bot Discord (Futuro)

O bot Discord será desenvolvido separadamente em Python 3.11.9 e hospedado em https://fps.ms. Instruções serão adicionadas quando disponível.

## 🐛 Problemas Comuns

### "Site não carrega"
- Verifique se GitHub Pages está ativado
- Aguarde alguns minutos após fazer push
- Limpe o cache do navegador

### "Erro ao fazer login"
- Verifique se as credenciais do Firebase estão corretas
- Confirme que Authentication está ativado
- Verifique as regras do Firestore

### "Erro ao criar site"
- Verifique permissões do Firestore
- Confirme que o usuário está logado
- Veja o console do navegador (F12) para detalhes

## 📚 Próximos Passos

Após a instalação:

1. ✅ Teste criar uma conta
2. ✅ Teste criar um site
3. ✅ Explore o editor
4. ✅ Publique seu primeiro site
5. ✅ Entre no [Discord](https://discord.gg/6MWH9Gyyv3) para suporte

## 💬 Suporte

Precisa de ajuda? Entre em contato:

- Discord: https://discord.gg/6MWH9Gyyv3
- Issues no GitHub
- IA Assistente no próprio editor

---

**Fire Server** - Instalação completa! 🎉
