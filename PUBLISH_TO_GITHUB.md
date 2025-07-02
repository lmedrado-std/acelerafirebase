# Como Publicar seu Projeto no GitHub (Guia para Iniciantes)

Publicar seu projeto no GitHub é uma ótima maneira de guardar uma cópia segura do seu código e acompanhar todas as alterações que você faz.

Siga estes passos com calma. Você só precisa copiar os comandos e colá-los no terminal.

---

### **Onde fica o Terminal?**

No ambiente do Studio, olhe para a **parte de baixo da sua tela**. Você verá um painel com algumas abas. Clique na que diz **"Terminal"**.

```
+---------------------------------------------+
|                                             |
|          (Área do seu código)               |
|                                             |
+---------------------------------------------+
| [Problemas] [Saída] [TERMINAL] [Console]    |  <-- Clique aqui!
+---------------------------------------------+
```

É nesse espaço que abrirá (o terminal) que você vai digitar (ou colar) os comandos abaixo.

---

## Passo a Passo

### Passo 1: Iniciar o Controle de Versão
Este comando prepara sua pasta para o controle de versão. É como dizer "Quero começar a salvar o histórico deste projeto".

Copie e cole o comando abaixo no terminal e aperte Enter:
```bash
git init -b main
```

### Passo 2: Adicionar Todos os Arquivos
Este comando adiciona todos os seus arquivos de código ao "pacote" que será salvo. O `.` significa "tudo nesta pasta".

Copie e cole o próximo comando e aperte Enter:
```bash
git add .
```

### Passo 3: Salvar seu Progresso (Fazer um "Commit")
Isso cria um "ponto de salvamento" na história do seu projeto. A mensagem dentro das aspas é uma descrição do que você fez.

Copie e cole o comando abaixo e aperte Enter:
```bash
git commit -m "Primeira versão do meu app Acelera GT"
```

### Passo 4: Conectar com seu Repositório no GitHub
Este comando diz ao seu projeto local onde ele deve ser salvo na internet (no repositório que você criou no GitHub). Eu já coloquei a URL correta para você.

Copie e cole o comando abaixo e aperte Enter:
```bash
git remote add origin https://github.com/lmedrado-std/acelerafirebase.git
```

### Passo 5: Enviar para o GitHub
Este é o comando final! Ele "empurra" (push) todo o seu progresso salvo para o GitHub.

Copie e cole o último comando e aperte Enter:
```bash
git push -u origin main
```

---

**Pronto!** Se tudo correu bem, ao recarregar a página do seu repositório no GitHub, você verá todos os seus arquivos lá. Se aparecer alguma mensagem pedindo para você fazer login no GitHub, basta seguir as instruções.
