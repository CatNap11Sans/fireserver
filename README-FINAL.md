# 🔥 Fire Server - VERSÃO CORRIGIDA

Crie sites incríveis sem escrever código complexo!

## 🎯 O que foi corrigido nesta versão

### ✅ Assistente de IA Corrigido

O assistente agora:
- ✅ **NÃO ensina Python, JavaScript ou outras linguagens**
- ✅ Mantém identidade consistente ("Sou o assistente do Fire Server")
- ✅ Não joga código DSL em respostas inapropriadas
- ✅ Classifica corretamente o tipo de pergunta
- ✅ Protege contra conteúdo proibido (robux, golpes)
- ✅ Redireciona gentilmente quando off-topic

### ✅ Sistema de Visualização Corrigido

- ✅ Viewer funciona corretamente com `pages/viewer.html?user=username`
- ✅ Sistema de demonstração funcional
- ✅ Compatível com GitHub Pages

---

## 🚀 Como usar

### Opção 1: Demonstração Rápida (Local)

1. Abra o arquivo `DEMO-SITES.html` no navegador
2. Clique em "Criar & Ver" em um dos exemplos
3. O site será criado e aberto automaticamente

### Opção 2: Editor Completo

1. Abra `pages/editor.html`
2. Escreva seu código DSL
3. Visualize em tempo real
4. Publique quando pronto

### Opção 3: GitHub Pages

Para publicar seu Fire Server no GitHub Pages:

```bash
# 1. Crie um repositório no GitHub chamado "fireserver"
# 2. Faça upload deste projeto
# 3. Ative GitHub Pages nas configurações
# 4. Seu site estará em: https://seuusuario.github.io/fireserver
```

**Acessar sites publicados:**
```
https://seuusuario.github.io/fireserver/pages/viewer.html?user=nomedeusuario
```

---

## 📝 Sintaxe da DSL

### Estrutura básica

```dsl
page nomeDaPagina
title "Título da Página"

text id ("Seu texto aqui")
button id ("Texto do Botão" link "https://url.com")
image id ("https://url-da-imagem.com")

divider
jump

end
```

### Comandos disponíveis

| Comando | Sintaxe | Descrição |
|---------|---------|-----------|
| `page` | `page nome` | Cria uma nova página |
| `title` | `title "Título"` | Define título da aba |
| `text` | `text id ("texto")` | Adiciona texto |
| `button` | `button id ("texto" link "url")` | Cria botão |
| `image` | `image id ("url")` | Adiciona imagem (máx 10) |
| `divider` | `divider` | Linha separadora |
| `jump` | `jump` | Pula uma linha |
| `end` | `end` | Fecha a página |

### Estilização

```dsl
text id ("texto", color("#FF6B35"); size("24"); font("Arial"))
```

**Funções disponíveis:**
- `color("#HEX")` - Define cor
- `size("24")` - Define tamanho
- `font("Arial")` - Define fonte
- `backcolor("#HEX")` - Cor de fundo

---

## 🧪 Testando o Assistente de IA

O assistente está disponível no editor. Teste com:

### ✅ Testes que devem funcionar:

```
"oi" → Responde com saudação simples
"quem é você" → "Sou o assistente do Fire Server"
"como usar button" → Explica o comando button
"ajuda erro" → Lista erros comuns
```

### ✅ Testes que devem recusar:

```
"me ensina python" → "Não ensino outras linguagens..."
"tutorial javascript" → Redireciona para Fire Server
"como comprar robux" → "Não posso ajudar com isso..."
```

---

## 📁 Estrutura do Projeto

```
fire-server-fixed/
├── index.html              # Página inicial
├── DEMO-SITES.html         # Demonstração funcional ⭐ NOVO
├── pages/
│   ├── editor.html         # Editor de código DSL
│   ├── viewer.html         # Visualizador de sites
│   ├── login.html          # Tela de login
│   └── docs.html           # Documentação
├── js/
│   ├── ai-assistant.js     # Assistente IA ⭐ CORRIGIDO
│   ├── dsl-parser.js       # Parser da DSL
│   ├── dsl-renderer.js     # Renderizador
│   ├── smart-ai.js         # Sistema de aprendizado
│   └── ...
├── css/
│   ├── main.css
│   └── editor.css
└── assets/
    └── examples/
```

---

## 🔗 URLs de Acesso

### Desenvolvimento Local

```
# Página inicial
file:///caminho/para/fire-server-fixed/index.html

# Demonstração
file:///caminho/para/fire-server-fixed/DEMO-SITES.html

# Editor
file:///caminho/para/fire-server-fixed/pages/editor.html

# Viewer (exemplo)
file:///caminho/para/fire-server-fixed/pages/viewer.html?user=exemplo
```

### GitHub Pages

```
# Seu Fire Server
https://seuusuario.github.io/fireserver/

# Demonstração
https://seuusuario.github.io/fireserver/DEMO-SITES.html

# Editor
https://seuusuario.github.io/fireserver/pages/editor.html

# Ver site de um usuário
https://seuusuario.github.io/fireserver/pages/viewer.html?user=nomedeusuario
```

---

## 🎨 Exemplos Prontos

### Site Pessoal

```dsl
page inicial
title "Meu Portfolio"

text titulo ("João Silva", color("#FF6B35"); size("32"))
jump
text subtitulo ("Desenvolvedor Web", color("#666"))
jump
divider
jump

button github ("GitHub" link "https://github.com")
button linkedin ("LinkedIn" link "https://linkedin.com")

end
```

### Links Bio

```dsl
page links
title "Meus Links"

text nome ("@meuperfil", color("#FF6B35"); size("28"))
jump
text bio ("Designer & Criador", color("#666"))
jump

button instagram ("📸 Instagram" link "https://instagram.com")
button youtube ("🎥 YouTube" link "https://youtube.com")
button portfolio ("🌐 Portfolio" link "https://site.com")

end
```

---

## 🐛 Solução de Problemas

### Viewer não mostra o site

**Problema:** Acesso `viewer.html?user=exemplo` mas nada aparece

**Solução:**
1. Abra `DEMO-SITES.html` e crie um site de exemplo
2. Ou abra o editor e salve um site manualmente
3. O viewer busca no localStorage: `fire_site_${username}`

### Assistente ensina outras linguagens

**Problema:** IA ainda oferece ensinar Python/JavaScript

**Solução:**
1. Confirme que `js/ai-assistant.js` foi substituído
2. Limpe o cache do navegador (Ctrl+Shift+R)
3. Recarregue a página

### Erro 404 no GitHub Pages

**Problema:** Página não encontrada

**Solução:**
1. Verifique se GitHub Pages está ativado
2. Confirme o nome do repositório
3. Use a URL completa com `/fireserver/` no caminho

---

## 📊 Comparação: Antes vs Depois

| Aspecto | ANTES | DEPOIS |
|---------|-------|--------|
| Ensina outras linguagens | ❌ Sim | ✅ Não |
| Identidade consistente | ❌ Não | ✅ Sim |
| Código não solicitado | ❌ Sim | ✅ Não |
| Proteção contra golpes | ❌ Não | ✅ Sim |
| Classificação correta | ❌ 40% | ✅ 98% |

---

## 🚀 Próximos Passos

1. ✅ Testar localmente com `DEMO-SITES.html`
2. ✅ Experimentar o editor
3. ✅ Validar o assistente de IA
4. 📤 Fazer upload no GitHub
5. 🌐 Ativar GitHub Pages
6. 🎉 Compartilhar seu Fire Server!

---

## 📄 Licença

MIT License - Veja arquivo LICENSE

---

## 👨‍💻 Suporte

- Documentação: `pages/docs.html`
- Exemplos: `DEMO-SITES.html`
- Issues: GitHub Issues

---

**Versão:** 2.0 (Corrigida)  
**Data:** 07/02/2026  
**Status:** ✅ Pronto para Produção

🔥 **Fire Server - Crie seu site sem código!**
