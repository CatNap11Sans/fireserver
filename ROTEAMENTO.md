# 🔀 Sistema de Roteamento - Fire Server

## Como Funciona

### ✅ Fluxo Correto (GitHub Pages)

```
usuário digita: fireserver.io/joao
              ↓
        GitHub Pages não encontra /joao/index.html
              ↓
          404.html é acionado
              ↓
    Script lê o path: "joao"
              ↓
    Redireciona para: /pages/viewer.html?user=joao
              ↓
       viewer.html lê: params.get('user')
              ↓
    Carrega e exibe o site do usuário "joao"
```

---

## 📁 Arquivos Envolvidos

### 1. `404.html` (Raiz do projeto)
**Função:** Capturar URLs não encontradas e redirecionar

```javascript
const path = location.pathname.slice(1);
if (path) {
    location.replace("/pages/viewer.html?user=" + path);
}
```

**Exemplos:**
- `fireserver.io/joao` → `/pages/viewer.html?user=joao`
- `fireserver.io/maria` → `/pages/viewer.html?user=maria`
- `fireserver.io/teste123` → `/pages/viewer.html?user=teste123`

### 2. `pages/viewer.html`
**Função:** Exibir o site do usuário

```javascript
extractUsername() {
    const params = new URLSearchParams(location.search);
    return params.get('user');
}
```

**Fluxo:**
1. Extrai username da query string
2. Busca código DSL do usuário
3. Parseia o código
4. Renderiza o site

---

## 🧪 Como Testar Localmente

### Teste 1: Simulação do 404
1. Abra o Chrome DevTools (F12)
2. Vá em "Console"
3. Digite:
```javascript
location.href = "/pages/viewer.html?user=teste"
```

### Teste 2: Teste com localStorage
1. Abra `index.html`
2. No console:
```javascript
// Criar um site de teste
localStorage.setItem('fire_site_teste', `
page inicial
title "Meu Site Teste"
text msg ("Olá! Site de teste funcionando! 🔥")
end
`);

// Ir para o viewer
location.href = "/pages/viewer.html?user=teste"
```

### Teste 3: Teste do 404.html
1. Abra `404.html` diretamente
2. Ele deve redirecionar para `/`
3. Adicione um path fictício no final da URL
4. Deve redirecionar para `viewer.html?user=...`

---

## 🌐 Funcionamento no GitHub Pages

### Configuração Necessária

**No repositório GitHub:**
1. Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` ou `master`
4. Folder: `/ (root)`

**Estrutura de arquivos:**
```
fire-server/
├── index.html          ← Página inicial
├── 404.html            ← Roteamento mágico ✨
├── pages/
│   ├── editor.html
│   └── viewer.html     ← Exibe sites dos usuários
└── js/
    ├── dsl-parser.js
    └── dsl-renderer.js
```

### Por que funciona?

GitHub Pages automaticamente serve `404.html` quando:
- Acessa URL que não existe
- Não existe pasta com aquele nome
- Não existe arquivo `index.html` naquela pasta

Então:
- ✅ `/joao` → não existe → `404.html` é servido
- ✅ `/maria` → não existe → `404.html` é servido
- ✅ `/teste` → não existe → `404.html` é servido

---

## 🔧 Customização

### Mudar o formato da URL

**Atual:** `fireserver.io/usuario`

**Para incluir prefixo:**
```javascript
// 404.html
const path = location.pathname.slice(1);
if (path.startsWith('site/')) {
    const username = path.replace('site/', '');
    location.replace("/pages/viewer.html?user=" + username);
}
```

**Resultado:** `fireserver.io/site/usuario`

---

## ⚠️ Limitações e Considerações

### ✅ Funciona
- URLs simples: `/usuario`
- Letras, números, hífen, underscore
- Redirecionamento transparente

### ❌ Não funciona (por enquanto)
- Sub-paths: `/usuario/pagina1` (necessita lógica adicional)
- Parâmetros extras: `/usuario?ref=twitter` (necessita preservar params)
- URLs com caracteres especiais

### 🔐 Segurança
- ✅ Sem XSS: O username é lido da query string segura
- ✅ Sem injeção: O DSL é parseado e sanitizado
- ✅ Sem execução de JS do usuário: Apenas DSL permitida

---

## 📊 Exemplo Completo

### Usuário: `joao`

**1. Código DSL (salvo no servidor):**
```dsl
page inicial
title "João Silva"

text intro ("Olá! Sou desenvolvedor web 👨‍💻")
button contato ("Email" link "mailto:joao@email.com")

end
```

**2. URL pública:**
```
https://fireserver.io/joao
```

**3. Fluxo:**
```
Usuário acessa: fireserver.io/joao
       ↓
404.html redireciona: /pages/viewer.html?user=joao
       ↓
viewer.html busca: localStorage ou API com key "joao"
       ↓
Parser processa o DSL
       ↓
Renderer cria DOM seguro
       ↓
Site é exibido!
```

---

## 🚀 Próximos Passos

### Fase 1: Teste Local ✅
- [x] 404.html configurado
- [x] viewer.html lendo query string
- [x] Teste com localStorage

### Fase 2: Deploy GitHub Pages
- [ ] Push para repositório
- [ ] Ativar GitHub Pages
- [ ] Testar URL: `username.github.io/fire-server/teste`

### Fase 3: Backend (API)
- [ ] Criar endpoint: `GET /api/site/:username`
- [ ] Retornar código DSL
- [ ] Substituir localStorage por fetch()

### Fase 4: Domínio Customizado
- [ ] Registrar domínio (ex: fireserver.io)
- [ ] Configurar DNS
- [ ] Testar: `fireserver.io/usuario`

---

## 📞 Troubleshooting

### Problema: 404 não redireciona
**Solução:**
1. Verifique se `404.html` está na raiz
2. Teste abrindo `404.html` diretamente
3. Veja console para erros JavaScript

### Problema: viewer.html não carrega site
**Solução:**
1. Abra DevTools → Console
2. Verifique se username está sendo extraído:
```javascript
const params = new URLSearchParams(location.search);
console.log(params.get('user')); // deve mostrar o username
```

### Problema: Site não renderiza
**Solução:**
1. Verifique se o código DSL está no localStorage
2. Teste com código DSL simples
3. Veja erros no parser/renderer

---

**Documentação:** v2.1
**Última atualização:** 07/02/2026
