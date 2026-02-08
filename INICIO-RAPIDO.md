# 🚀 INÍCIO RÁPIDO - Fire Server v2.1

## 📦 Você acabou de baixar o Fire Server corrigido!

### ✅ O que foi corrigido?
1. Erro de sintaxe JavaScript
2. Problema de carregamento de classes
3. Sistema de roteamento simplificado

---

## 🎯 3 Passos para Começar

### 🔹 PASSO 1: Testar se Funciona (2 minutos)
```
1. Extraia o ZIP
2. Abra: TEST-EDITOR.html
3. Veja se tudo está "✓ Carregado"
```

✅ **Passou?** Ótimo! Vá para o passo 2.  
❌ **Falhou?** Veja a seção "Socorro!" abaixo.

---

### 🔹 PASSO 2: Testar o Roteamento (5 minutos)
```
1. Abra: TESTE-ROTEAMENTO.html
2. No Passo 1, digite "teste" e clique "Criar Site de Teste"
3. No Passo 3, clique "Abrir em Nova Aba"
```

✅ **Site apareceu?** Perfeito! Vá para o passo 3.  
❌ **Erro?** Veja a seção "Socorro!" abaixo.

---

### 🔹 PASSO 3: Usar o Editor (10 minutos)
```
1. Abra: pages/editor.html
2. Modifique o código DSL
3. Clique na aba "Preview" para ver o resultado
```

✅ **Editor funcionando?** Você está pronto! 🎉

---

## 📚 Arquivos de Ajuda

| Arquivo | Para quê serve? | Quando usar? |
|---------|----------------|--------------|
| `TEST-EDITOR.html` | Teste rápido | Sempre primeiro! |
| `TESTE-ROTEAMENTO.html` | Teste interativo | Para entender o fluxo |
| `DIAGRAMA-ROTEAMENTO.html` | Visual do fluxo | Para estudar |
| `pages/editor.html` | Editor principal | Para criar sites |
| `README-CORRIGIDO.md` | Resumo geral | Visão geral |
| `CORRECOES.md` | Detalhes técnicos | Desenvolvedores |
| `ROTEAMENTO.md` | Docs do roteamento | Entender sistema |

---

## 🌐 Deploy no GitHub Pages

### Pronto para publicar?

**1. Crie um repositório no GitHub**
```bash
# No terminal/CMD
cd pasta-do-projeto
git init
git add .
git commit -m "Fire Server v2.1"
git remote add origin https://github.com/seu-usuario/fire-server.git
git push -u origin main
```

**2. Ative GitHub Pages**
```
1. Vá em: Settings → Pages
2. Source: main branch
3. Folder: / (root)
4. Save
```

**3. Teste sua URL**
```
https://seu-usuario.github.io/fire-server/teste
```

Substitua "teste" por qualquer username!

---

## 🎨 Exemplo de Código DSL

Copie e cole no editor para testar:

```dsl
# Meu primeiro site!
page inicial
title "João Silva"

text intro ("Olá! 👋 Bem-vindo ao meu site!")
jump

text sobre ("Sou desenvolvedor e adoro criar coisas legais.")
jump

button contato ("📧 Email" link "mailto:joao@email.com")
button github ("💻 GitHub" link "https://github.com/joao")

divider

text rodape ("Feito com 🔥 Fire Server")
end
```

---

## 🆘 Socorro! Algo deu errado...

### Problema: TEST-EDITOR.html mostra erros
**Solução:**
1. Feche TODAS as abas do navegador
2. Abra novamente
3. Tente de novo
4. Se persistir, veja o console (F12)

### Problema: Editor não aparece
**Solução:**
1. Você tem internet? (CodeMirror vem do CDN)
2. Abra o console (F12)
3. Procure por erros em vermelho
4. Copie a mensagem e pesquise

### Problema: Site não aparece no viewer
**Solução:**
1. Use TESTE-ROTEAMENTO.html
2. Verifique se criou o site no Passo 1
3. No console (F12), digite: `localStorage`
4. Veja se existe `fire_site_...`

### Problema: GitHub Pages não funciona
**Solução:**
1. Aguarde 5-10 minutos (propagação)
2. Certifique-se que 404.html está na raiz
3. Verifique se Pages está ativado
4. Tente: `seu-site.github.io/fire-server/404.html`

---

## 💡 Dicas Importantes

### ✅ Faça
- Sempre teste localmente primeiro
- Use TEST-EDITOR.html antes de tudo
- Leia o console quando houver erros
- Mantenha backups do seu código DSL

### ❌ Não faça
- Não modifique os arquivos JS sem saber
- Não ignore erros no console
- Não publique sem testar localmente
- Não use caracteres especiais no username

---

## 🎓 Aprendendo DSL

### Comandos Básicos
```dsl
page nome          # Cria uma página
title "Título"     # Título da página (nas abas)
text id ("...")    # Texto simples
image id ("url")   # Imagem
button id ("..." link "url")  # Botão com link
divider            # Linha separadora
jump               # Pula uma linha
end                # Termina a página
```

### Funções (Loads)
```dsl
text id ("texto", color("#FF0000"))           # Cor do texto
text id ("texto", font("Arial"))              # Fonte
text id ("texto", size("20"))                 # Tamanho
button id ("...", backcolor("#0000FF"))       # Cor de fundo do botão
```

Mais exemplos em: `assets/examples.md`

---

## 📊 Estrutura do Projeto

```
fire-server/
│
├── 📄 index.html              # Página inicial
├── 🔴 404.html                # Roteamento mágico
│
├── 🧪 Arquivos de Teste
│   ├── TEST-EDITOR.html
│   ├── TESTE-ROTEAMENTO.html
│   └── DIAGRAMA-ROTEAMENTO.html
│
├── 📚 Documentação
│   ├── README-CORRIGIDO.md
│   ├── CORRECOES.md
│   ├── ROTEAMENTO.md
│   └── GUIA-DE-TESTE.md
│
├── 📂 pages/
│   ├── editor.html            # ⚙️ Editor principal
│   ├── viewer.html            # 👁️ Visualizador
│   └── ...
│
├── 📂 js/
│   ├── dsl-parser.js          # 🔍 Parser da DSL
│   ├── dsl-renderer.js        # 🎨 Renderizador
│   ├── editor.js              # ⚙️ Lógica do editor
│   └── ...
│
└── 📂 css/
    ├── main.css
    └── editor.css
```

---

## 🎯 Checklist Final

Antes de considerar "pronto", verifique:

- [ ] TEST-EDITOR.html → Tudo verde
- [ ] TESTE-ROTEAMENTO.html → Consegue criar e ver site
- [ ] pages/editor.html → Caixa de código aparece
- [ ] Console (F12) → Zero erros
- [ ] Código DSL de exemplo funciona
- [ ] Preview atualiza ao digitar
- [ ] Navegação entre abas funciona

**Todos marcados?** 🎉 Você está PRONTO!

---

## 🚀 Próximos Passos

Agora que está funcionando:

1. ✅ **Teste localmente** (você está aqui!)
2. ⏳ **Deploy no GitHub Pages**
3. ⏳ **Implementar backend** (salvar sites)
4. ⏳ **Adicionar autenticação** (login)
5. ⏳ **Domínio customizado** (fireserver.io)

---

## 📞 Precisa de Ajuda?

1. **Leia a documentação:**
   - README-CORRIGIDO.md
   - CORRECOES.md
   - ROTEAMENTO.md

2. **Use as ferramentas de teste:**
   - TEST-EDITOR.html
   - TESTE-ROTEAMENTO.html

3. **Veja o console do navegador (F12)**
   - Ele mostra exatamente o que deu errado

4. **Pesquise o erro**
   - Copie a mensagem de erro
   - Pesquise no Google

---

**Versão:** Fire Server v2.1  
**Status:** ✅ Pronto para usar  
**Data:** 07/02/2026

**Boa sorte! 🔥**
