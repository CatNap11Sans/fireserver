# 🔥 Fire Server

**Crie sites incríveis sem escrever código complexo!**

Fire Server é uma plataforma que permite criar sites usando uma linguagem simples (DSL) ao invés de HTML, CSS e JavaScript. Perfeito para iniciantes que querem ter presença online sem complicação.

![Fire Server](https://img.shields.io/badge/Fire-Server-FF6B35?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-beta-yellow?style=for-the-badge)

## 🌟 Características

- ✨ **Linguagem Simples**: DSL intuitiva que qualquer um pode aprender
- 🎨 **Editor Visual**: Editor com preview em tempo real
- 🤖 **Assistente IA**: Ajuda com erros e sugestões
- 🔒 **100% Seguro**: Nenhum código malicioso permitido
- ⚡ **Super Rápido**: Sites leves que carregam instantaneamente
- 📱 **Responsivo**: Funciona em qualquer dispositivo
- 🆓 **Totalmente Grátis**: Sem taxas escondidas

## 🚀 Início Rápido

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/fire-server.git
cd fire-server
```

### 2. Estrutura do Projeto

```
fire-server/
├── index.html              # Landing page
├── 404.html               # Roteamento
├── css/
│   ├── main.css           # Estilos principais
│   └── editor.css         # Estilos do editor
├── js/
│   ├── main.js            # JavaScript principal
│   ├── dsl-parser.js      # Parser da DSL
│   ├── dsl-renderer.js    # Renderizador
│   ├── editor.js          # Lógica do editor
│   └── ai-assistant.js    # Assistente IA
├── pages/
│   ├── login.html         # Página de login
│   ├── editor.html        # Editor de código
│   ├── viewer.html        # Visualizador de sites
│   └── docs.html          # Documentação
└── README.md
```

### 3. Hospede no GitHub Pages

1. Faça push para o GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Ative GitHub Pages:
   - Vá em Settings > Pages
   - Source: Deploy from branch
   - Branch: main / (root)
   - Save

3. Seu site estará em: `https://seu-usuario.github.io/fire-server/`

## 📝 Como Usar

### Exemplo Básico

```dsl
# Comentários começam com #

page inicial
title "Meu Primeiro Site"

text bemvindo ("Olá! Bem-vindo ao meu site 👋")
jump

text sobre ("Aqui você pode criar sites incríveis sem código!")

button contato ("Entre em Contato" link "mailto:seu@email.com")

end
```

### Comandos Disponíveis

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `page` | Cria uma página | `page inicio` |
| `title` | Define título | `title "Meu Site"` |
| `text` | Adiciona texto | `text t1 ("Olá!")` |
| `image` | Adiciona imagem | `image img1 ("url")` |
| `button` | Cria botão | `button btn1 ("Clique" link "url")` |
| `divider` | Linha separadora | `divider` |
| `jump` | Quebra de linha | `jump` |
| `end` | Finaliza página | `end` |

### Estilos (Loads)

Personalize seus elementos com funções de estilo:

```dsl
text destaque ("Texto importante", color("#FF0000"); size("24"))

button cta ("Começar" link "url", backcolor("#FF6B35"))

image foto ("url", animation("fadeIn"))
```

**Funções disponíveis:**
- `color("#hex")` - Cor do texto
- `backcolor("#hex")` - Cor de fundo
- `size("px")` - Tamanho da fonte
- `font("nome")` - Família da fonte
- `animation("nome")` - Animação de entrada

## 🎯 Limites e Regras

| Limite | Valor |
|--------|-------|
| Linhas de código | 200 |
| Elementos totais | 100 |
| Imagens | 10 |
| Caracteres | 10.000 |
| Nome de usuário | 2-20 caracteres |

**Restrições de Segurança:**
- ❌ JavaScript do usuário
- ❌ HTML cru
- ❌ Código malicioso
- ✅ Apenas DSL segura

## 🛠️ Desenvolvimento

### Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Editor**: CodeMirror
- **Parser**: JavaScript custom
- **Hospedagem**: GitHub Pages
- **Backend (Futuro)**: Node.js + Oracle Cloud

### Roadmap

#### ✅ Fase 0-3 (Concluídas)
- [x] Conceito e planejamento
- [x] Frontend base
- [x] Editor com CodeMirror
- [x] Parser e Renderer da DSL

#### 🚧 Fase 4-6 (Em Andamento)
- [ ] Assistente IA avançado
- [ ] Backend com API REST
- [ ] Sistema de autenticação (Google/Discord)

#### 📋 Fase 7-9 (Planejadas)
- [ ] Bot Discord
- [ ] Melhorias de segurança
- [ ] Lançamento público

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 💬 Suporte

- 📧 Email: suporte@fireserver.io
- 💬 Discord: [Fire Server Community](#)
- 📚 Documentação: [docs.fireserver.io](#)

## 🙏 Agradecimentos

- CodeMirror pela excelente biblioteca de editor
- Comunidade open source
- Todos os beta testers

---

**Feito com 🔥 por criadores, para criadores.**

[Site](https://fireserver.io) • [Documentação](#) • [Discord](#) • [Twitter](#)
