# Site Pessoal - Exemplo Fire Server
# Copie este código e personalize com suas informações!

page inicio
title "Seu Nome - Designer & Criador"

# Header com nome
text nome ("João Silva", size("42"); color("#FF6B35"))
text subtitulo ("Designer • Desenvolvedor • Criador de Conteúdo", color("#A0A8C5"))

jump
divider
jump

# Foto de perfil
image perfil ("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400")

jump

# Sobre mim
text sobre_titulo ("Sobre Mim", size("28"); color("#FF6B35"))
text sobre_descricao ("Olá! Sou apaixonado por criar experiências digitais incríveis. Com mais de 5 anos de experiência, transformo ideias em realidade através do design e código.")

jump
divider
jump

# O que eu faço
text trabalho_titulo ("O Que Eu Faço", size("28"); color("#FF6B35"))

text design ("🎨 Design UI/UX - Interfaces bonitas e funcionais")
text dev ("💻 Desenvolvimento Web - Sites e aplicações modernas")
text conteudo ("📱 Criação de Conteúdo - Educando e inspirando")

jump
divider
jump

# Contato e redes sociais
text contato_titulo ("Entre em Contato", size("28"); color("#FF6B35"))

button email ("📧 Email" link "mailto:joao@exemplo.com", backcolor("#FF6B35"))
button linkedin ("💼 LinkedIn" link "https://linkedin.com/in/joaosilva")
button instagram ("📸 Instagram" link "https://instagram.com/joaosilva")
button github ("💻 GitHub" link "https://github.com/joaosilva")

jump
jump

# Footer
text footer ("Feito com 🔥 Fire Server", color("#A0A8C5"); size("14"))

end
