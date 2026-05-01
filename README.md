
# 🔐 SecureAuth

Sistema de autenticação desenvolvido com **Next.js** e **Supabase**, com foco em login, cadastro, proteção de rotas e boas práticas básicas de segurança web.

## 🌐 Projeto online

https://secureauth-drab.vercel.app/dashboard

## 📌 Sobre o projeto

O SecureAuth foi criado como um projeto prático para estudar autenticação em aplicações web modernas.

A ideia foi sair de uma tela simples de login e criar um fluxo mais próximo de um sistema real, com backend de autenticação, sessão de usuário, dashboard protegido e testes básicos de segurança usando Kali Linux.

## 🚀 Funcionalidades

- Cadastro de usuários
- Login com Supabase Auth
- Proteção de rota no dashboard
- Redirecionamento para login quando não autenticado
- Logout de sessão
- Interface responsiva
- Deploy na Vercel
- Testes básicos de segurança com Kali Linux

## 🛠️ Tecnologias utilizadas

- Next.js
- React
- JavaScript
- Supabase
- Vercel
- Kali Linux
- Nmap
- Nikto
- WhatWeb
- WafW00f

## 🔒 Segurança

Algumas práticas aplicadas ou analisadas no projeto:

- Autenticação gerenciada pelo Supabase
- Variáveis de ambiente protegidas
- Controle de sessão
- Dashboard acessível apenas para usuários autenticados
- Testes de headers HTTP
- Verificação de HTTPS/SSL
- Análise básica com ferramentas de segurança

## 🧪 Script de teste

Foi criado um script simples para fazer verificações iniciais no site publicado:

```bash
#!/bin/bash

TARGET="https://secureauth-drab.vercel.app"
DOMAIN="secureauth-drab.vercel.app"

echo "===================================="
echo " Web Security Check"
echo " Alvo: $TARGET"
echo "===================================="
echo ""

echo "[1] Headers"
curl -s -I "$TARGET" | tee headers.txt
echo ""
grep -Ei "strict-transport-security|content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy" headers.txt || echo "Nenhum header relevante encontrado."

echo ""
echo "[2] SSL/TLS"
nmap --script ssl-cert,ssl-enum-ciphers -p 443 "$DOMAIN" -oN ssl_scan.txt

echo ""
echo "[3] Tecnologias"
whatweb "$TARGET" | tee whatweb.txt

echo ""
echo "[4] WAF/CDN"
wafw00f "$TARGET" | tee waf.txt

echo ""
echo "[5] Nikto"
nikto -h "$TARGET" -o nikto_scan.txt

echo ""
echo "===================================="
echo " RESUMO"
echo "===================================="

grep -Ei "strict-transport-security|content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy" headers.txt || echo "Headers ausentes"

echo ""
echo "Arquivos:"
echo "headers.txt"
echo "ssl_scan.txt"
echo "whatweb.txt"
echo "waf.txt"
echo "nikto_scan.txt"
````

## ⚙️ Como rodar localmente

Clone o repositório:

```bash
git clone https://github.com/augustomigueldev/secureauth.git
```

Entre na pasta:

```bash
cd secureauth
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=SUA_URL_DO_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA_DO_SUPABASE
```

Execute o projeto:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## 📁 Estrutura básica

```text
secureauth/
├── app/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── globals.css
│   └── layout.tsx
├── lib/
│   └── supabase.js
├── public/
├── package.json
└── README.md
```

## 📚 O que aprendi

Durante o desenvolvimento deste projeto, pratiquei:

* Integração do Next.js com Supabase
* Fluxo de autenticação em aplicação web
* Proteção de rotas
* Uso de variáveis de ambiente
* Deploy na Vercel
* Testes básicos de segurança em ambiente próprio
* Análise inicial com ferramentas do Kali Linux

## ⚠️ Observação

Este projeto tem finalidade educacional e foi desenvolvido para estudo de autenticação e segurança web em ambiente controlado.

## 👨‍💻 Autor

Augusto Miguel
GitHub: [https://github.com/augustomigueldev](https://github.com/augustomigueldev)

````

