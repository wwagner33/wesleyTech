# Guia Prático do Pug
Embora não seja uma Engine View robusta para projetos de médio e grande porte, o Pug é uma forma interessante de construir páginas dinâmicas para quem só conhece o HTML e o CSS. Seu principal problema está na documentação da linguagem, que deixa bastante a desejar, porém, sua versatilidade para fazer protótipos de interface são importante para o caso de precisarmos fazer provas de conceitos com um cliente ou atender uma demanda que não exija um grande número de acesso aos recursos da aplicação.

A primeira vez que se acessa a página Pug, o tempo de espera é maior que os demais, isso se deve ao processo de "compilando" do código Pug e a geração do código HTML que deve ser enviado para o navegador Web. Este tempo se manteria o mesmo, caso o _framework_ Express não trabalhasse "cacheando" a transformação e enviando somente o HTML, nos acessos posteriores.

Note que o Pug não necessita, obrigatoriamente, do framework **Express** para funcionar. Eu posso criar, por exemplo, uma aplicação Node.js que mostre código HTML no Terminal (chamado Console, no Javascript). 

O passo-a-passo a seguir mostra o uso do Pug para "compilar" código Pug para HTML.

### 1. Instale o Pug

Primeiro, você precisa instalar o pacote `pug` no seu projeto Node.js. Você pode fazer isso usando o npm (Node Package Manager):

```bash
npm install pug
```

### 2. Criar um Arquivo Pug

Crie um arquivo Pug que você deseja compilar para HTML. Por exemplo, crie um arquivo chamado `template.pug`:

**template.pug:**

```pug
doctype html
html(lang="pt-br")
  head
    title #{title} - WesleyTech Store
  body
    h1= message
    p Aqui você pode encontrar produtos de informática em um preço que caiba em seu bolso!
```

### 3. Compilando o Pug para HTML Usando JavaScript

Agora, no seu código JavaScript, você pode usar o pacote `pug` para compilar o template Pug em HTML. Existem duas abordagens principais: compilação direta para uma string HTML ou pré-compilação do template para reutilização.

#### 3.1. Compilação Direta para HTML

Se você quiser simplesmente compilar o Pug e gerar o HTML como uma string:

**compile.js:**

```javascript
const pug = require('pug');

// Compilar o Pug para HTML
const html = pug.renderFile('template.pug', {
  title: 'WesleyTech Store',
  message: 'Bem-vindo à nossa loja!'
});

console.log(html);
```

#### 3.2. Pré-compilação do Template

Se você deseja pré-compilar o template para reutilização, especialmente útil em servidores web que renderizam o mesmo template várias vezes:

**compile.js:**

```javascript
const pug = require('pug');

// Pré-compilar o template
const compileTemplate = pug.compileFile('template.pug');

// Renderizar o HTML usando os dados fornecidos
const html = compileTemplate({
  title: 'WesleyTech Store',
  message: 'Bem-vindo à nossa loja!'
});

console.log(html);
```

### 4. Executar o Código

Execute o código JavaScript usando Node.js para ver o HTML gerado:

```bash
node compile.js
```

Isso imprimirá o HTML compilado no console:

**Saída no console:**

```html
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <title>WesleyTech Store - WesleyTech Store</title>
  </head>
  <body>
    <h1>Bem-vindo à nossa loja!</h1>
    <p>Aqui você pode encontrar produtos de informática em um preço que caiba em seu bolso!</p>
  </body>
</html>
```


## Definindo o que seja oPug

Pug é uma linguagem de template que simplifica a criação de HTML, permitindo que os desenvolvedores escrevam código de forma mais concisa e legível. Ele usa indentação para definir a hierarquia de elementos, o que elimina a necessidade de fechar tags, tornando o código mais limpo. Pug é especialmente útil em projetos Node.js para gerar páginas HTML de forma dinâmica, chamadas **Páginas Dinâmicas**.

O Pug 


## Usando um "Layout" no Pug

Um layout em Pug é um _template_ base que define a estrutura comum de várias páginas, como cabeçalho, rodapé e links para folhas de estilo. Ao usar layouts, você pode reutilizar essa estrutura em diferentes páginas, apenas substituindo ou adicionando o conteúdo específico de cada uma.

## Exemplo de um Layout em Pug:

**Arquivo: `layout.pug`**

```pug
doctype html
html(lang="pt-br")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title #{title} - WesleyTech Store
    link(rel="stylesheet" href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css" integrity="sha384-X38yfunGUhNzHpBaEBsWLO+A0HDYOQi8ufWDkZ0k9e0eXz/tH3II7uKZ9msv++Ls" crossorigin="anonymous")
    link(rel="stylesheet", href="/style.css")
  body
    header
      .pure-menu.pure-menu-horizontal
        a.pure-menu-heading.pure-menu-link(href="/") WW Loja
        ul.pure-menu-list
          li.pure-menu-item
            a.pure-menu-link(href="/produtos") Produtos
          li.pure-menu-item
            a.pure-menu-link(href="/login") Login
          li.pure-menu-item
            a.pure-menu-link(href="/cadastro") Cadastro
    main
      block content
    footer
      .footer-content
        p &copy; 2024 WW Loja. Todos os direitos reservados.
```

Neste layout, temos uma estrutura básica de HTML com um cabeçalho, um bloco principal (`block content`), e um rodapé. O bloco `content` é onde o conteúdo específico de cada página será inserido.

## Extensão de Layouts

Ao usar um layout em outras páginas, utilizamos a palavra-chave `extends` seguida pelo nome do arquivo de layout. Em seguida, definimos o conteúdo específico da página dentro de um bloco que corresponde ao bloco definido no layout.

**Exemplo:**

**Arquivo: `index.pug`**

```pug
extends layout

block content
  .content
    h1 WesleyTech Store
    p Aqui você pode encontrar produtos de informática em um preço que caiba em seu bolso!
```

## Recursos do Pug: Inserção de String Literals, Iteração e Condicionais

## 1. **Inserção de String Literals**

Pug permite a inserção de variáveis diretamente em elementos HTML usando a sintaxe de interpolação `#{}`. Isso é útil para inserir valores dinâmicos.

**Exemplo:**

```pug
p Descrição: #{produto.descricao}
```

Aqui, `#{produto.descricao}` será substituído pelo valor da variável `produto.descricao` no HTML gerado.

## 2. **Iteração de Arrays**

Para iterar sobre arrays e listas de itens, Pug utiliza o comando `each`. Esse recurso é muito útil para gerar elementos repetidos, como listas de produtos.

**Exemplo:**

```pug
each produto in produtos
  .produto
    h3= produto.nome
    p Descrição: #{produto.descricao}
    p Preço: R$ #{produto.preco}
```

Nesse exemplo, `each produto in produtos` percorre o array `produtos`, e para cada item, cria um bloco de código com o nome, descrição e preço do produto.

## 3. **Condicionais com `if`**

Condicionais permitem exibir ou ocultar conteúdo baseado em uma condição. No Pug, usamos `if` para verificar uma condição e renderizar o conteúdo correspondente.

**Exemplo:**

```pug
if produtos.length
  each produto in produtos
    .produto
      h3= produto.nome
      p Descrição: #{produto.descricao}
      p Preço: R$ #{produto.preco}
else
  p Nenhum produto disponível no momento.
```

Aqui, o código verifica se o array `produtos` contém itens. Se sim, exibe os produtos; caso contrário, exibe uma mensagem de que não há produtos disponíveis.

## Formulários e Condicionais em Pug

Pug também permite criar formulários e utilizar condicionais para exibir mensagens de erro ou sucesso.

**Exemplo de um Formulário de Cadastro:**

**Arquivo: `cadastro.pug`**

```pug
extends layout

block content
  .content
    h1 Cadastro
    if error
      p.error= error
    form.pure-form.pure-form-stacked(action="/cadastro", method="post")
      fieldset
        label(for="nome") Nome:
        input(type="text", id="nome", name="nome", required)
        label(for="emailCadastro") Email:
        input(type="email", id="emailCadastro", name="email", required)
        label(for="senhaCadastro") Senha:
        input(type="password", id="senhaCadastro", name="senha", required)
        button.pure-button.pure-button-primary(type="submit") Cadastrar
```

## 1. **Bloco de Conteúdo e Condicionais**

- `block content`: Define o bloco de conteúdo específico para essa página, inserido no layout geral.
- `if error`: Verifica se há uma variável `error`. Se existir, uma mensagem de erro é exibida usando a classe `.error`.

## 2. **Criação de Formulários**

- `form.pure-form.pure-form-stacked`: Cria um formulário com classes do PureCSS para estilização, definindo o método de envio como `POST` e a ação como `"/cadastro"`.
- `input(type="text", id="nome", name="nome", required)`: Define um campo de texto obrigatório para o nome, com um ID e um nome para identificação.
- `button.pure-button.pure-button-primary(type="submit") Cadastrar`: Cria um botão de envio estilizado com a classe `pure-button-primary`.
