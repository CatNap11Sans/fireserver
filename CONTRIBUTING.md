# 🤝 Contribuindo para o Fire Server

Obrigado por considerar contribuir com o Fire Server! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## 🚀 Como Contribuir

### Reportando Bugs

1. **Verifique** se o bug já foi reportado
2. **Crie uma issue** com:
   - Título descritivo
   - Passos para reproduzir
   - Comportamento esperado vs. atual
   - Screenshots (se aplicável)
   - Versão do navegador

### Sugerindo Melhorias

1. **Abra uma issue** descrevendo:
   - O problema atual
   - Sua solução proposta
   - Benefícios da mudança
   - Possíveis desvantagens

### Pull Requests

1. **Fork** o repositório
2. **Crie uma branch** (`git checkout -b feature/MinhaFeature`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push para a branch** (`git push origin feature/MinhaFeature`)
5. **Abra um Pull Request**

#### Checklist para PRs

- [ ] Código segue o estilo do projeto
- [ ] Comentários adicionados onde necessário
- [ ] Documentação atualizada
- [ ] Nenhum warning no console
- [ ] Testado em diferentes navegadores

## 📁 Estrutura do Código

```
fire-server/
├── css/           # Estilos
├── js/
│   ├── core/     # Código principal
│   ├── lua/      # Integração Lua
│   └── api/      # APIs
├── pages/        # Páginas HTML
└── assets/       # Assets estáticos
```

## 🎨 Estilo de Código

### JavaScript

```javascript
// Use camelCase para variáveis
const myVariable = 'valor';

// Use PascalCase para classes
class MyClass {
    constructor() {
        // ...
    }
}

// Comentários claros
// Isso faz X porque Y
const result = doSomething();

// Arrow functions quando apropriado
const myFunction = (param) => {
    return param * 2;
};
```

### CSS

```css
/* Use BEM para nomenclatura */
.block {}
.block__element {}
.block--modifier {}

/* Organize por seções */
/* ========== Layout ========== */
/* ========== Components ====== */
/* ========== Utilities ======= */
```

### HTML

```html
<!-- Indentação de 4 espaços -->
<div class="container">
    <div class="content">
        <p>Texto</p>
    </div>
</div>

<!-- Atributos em ordem: class, id, data-*, outros -->
<button class="btn" id="myBtn" data-action="submit" type="button">
```

## 🧪 Testando

Antes de submeter um PR:

1. Teste em Chrome, Firefox, Safari e Edge
2. Teste em mobile (responsividade)
3. Verifique o console para erros
4. Teste com diferentes tamanhos de tela

## 📝 Commit Messages

Use mensagens descritivas:

```
Adiciona feature X
Corrige bug Y
Atualiza documentação de Z
Refatora componente W
```

Formato:
```
<tipo>: <descrição curta>

<corpo opcional com mais detalhes>
```

Tipos:
- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

## 🔒 Segurança

Se você encontrar uma vulnerabilidade de segurança:

1. **NÃO** abra uma issue pública
2. Envie email para security@fireserver.dev
3. Descreva a vulnerabilidade em detalhes

## 📞 Dúvidas?

- Discord: [discord.gg/fireserver](https://discord.gg/fireserver)
- Issues: [GitHub Issues](https://github.com/catnap11sans/fireserver/issues)

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a Licença MIT do projeto.

---

Obrigado por contribuir! 🔥
