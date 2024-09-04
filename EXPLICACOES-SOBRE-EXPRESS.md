# Guia Prático do Express.js para Node.js

O **Express.js** é um framework minimalista e flexível para o Node.js, que fornece um conjunto robusto de recursos para desenvolver aplicações web e APIs. Ele facilita a criação de servidores HTTP, gerenciamento de rotas, manipulação de requisições e respostas, entre outras funcionalidades.

## Instalação do Express

Para começar a usar o Express, você precisa instalá-lo no seu projeto Node.js. Primeiro, crie um novo diretório para o projeto, inicialize o `npm` e instale o Express:

```bash
mkdir my-express-app
cd my-express-app
npm init -y
npm install express
```

## Criando um Servidor Básico com Express

Após instalar o Express, vamos criar um servidor básico que responde "Hello World!" quando acessamos a raiz (`/`) do servidor.

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

### Como Funciona:

- **`express()`**: Cria uma instância da aplicação Express.
- **`app.get('/', callback)`**: Define uma rota que responde às requisições GET na raiz (`/`) do servidor.
- **`res.send()`**: Envia uma resposta ao cliente.
- **`app.listen(port, callback)`**: Inicia o servidor na porta especificada.

## Trabalhando com Rotas

Express facilita o gerenciamento de rotas, que são as URLs que sua aplicação pode responder.

### Rotas Simples

```javascript
app.get('/about', (req, res) => {
    res.send('Sobre nós');
});

app.get('/contact', (req, res) => {
    res.send('Contato');
});
```

### Rotas com Parâmetros

Você pode definir rotas dinâmicas que aceitam parâmetros na URL:

```javascript
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Usuário ID: ${userId}`);
});
```

### Rotas com Query Parameters

Express também permite capturar query parameters na URL:

```javascript
app.get('/search', (req, res) => {
    const query = req.query.q;
    res.send(`Busca por: ${query}`);
});
```

## Middleware no Express

Middlewares são funções que têm acesso ao objeto de requisição (`req`), resposta (`res`) e ao próximo middleware na pilha de execução.

### Exemplo de Middleware:

```javascript
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Chama o próximo middleware ou rota
};

app.use(logger);
```

### Middlewares Incorporados

O Express vem com alguns middlewares incorporados, como `express.json()` para analisar o corpo das requisições JSON:

```javascript
app.use(express.json());

app.post('/data', (req, res) => {
    const data = req.body;
    res.send(`Dados recebidos: ${JSON.stringify(data)}`);
});
```

## Gerenciamento de Erros

Express permite capturar e gerenciar erros de maneira centralizada:

```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});
```

## Servindo Arquivos Estáticos

Você pode usar o Express para servir arquivos estáticos, como HTML, CSS e JavaScript, usando o middleware `express.static()`:

```javascript
app.use(express.static('public'));
```

Neste exemplo, todos os arquivos na pasta `public` serão servidos diretamente pelo servidor.

## Exemplo Completo: CRUD Simples

Aqui está um exemplo básico de uma API RESTful para gerenciar uma lista de tarefas:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = req.body;
    tasks.push(task);
    res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const updatedTask = req.body;
    tasks = tasks.map(task => task.id === id ? updatedTask : task);
    res.json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    tasks = tasks.filter(task => task.id !== id);
    res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### Explicação:

- **GET `/tasks`**: Retorna a lista de tarefas.
- **POST `/tasks`**: Adiciona uma nova tarefa.
- **PUT `/tasks/:id`**: Atualiza uma tarefa existente.
- **DELETE `/tasks/:id`**: Remove uma tarefa pelo ID.

## View Engines no Express

Uma **View Engine** é uma ferramenta que permite a renderização de templates (ou views) no servidor, transformando dados dinâmicos em HTML antes de enviar a resposta ao cliente. Isso é especialmente útil em aplicações onde o conteúdo da página varia de acordo com os dados, como em páginas de perfil de usuário, listas de produtos, etc.

### Como Funciona uma View Engine

- **Template**: Um arquivo que contém HTML misturado com código de template que pode ser substituído por dados dinâmicos.
- **Dados Dinâmicos**: Variáveis e objetos que contêm as informações que você deseja exibir na página.
- **Renderização**: O processo de substituir as variáveis no template pelos dados dinâmicos e gerar HTML.

O Express suporta várias view engines populares, como Pug, EJS, Handlebars, entre outras. A seguir, veremos como configurar e usar algumas delas.

### Configurando uma View Engine no Express

Para usar uma view engine no Express, você precisa instalá-la, configurá-la no seu aplicativo, e então criar templates que possam ser renderizados.

### Exemplo com Pug

**Pug** (anteriormente conhecido como Jade) é uma view engine que permite escrever HTML de maneira mais concisa e com uma sintaxe simplificada.

#### Instalação:

```bash
npm install pug
```

#### Configuração:

```javascript
const express = require('express');
const app = express();

// Configura o Express para usar Pug como view engine
app.set('view engine', 'pug');
app.set('views', './views'); // Diretório onde os templates Pug estão localizados

app.get('/', (req, res) => {
    res.render('index', { title: 'WesleyTech Store', message: 'Bem-vindo à nossa loja!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

#### Criando o Template `index.pug`:

```pug
doctype html
html(lang="pt-br")
  head
    title= title
  body
    h1= message
    p Aqui você pode encontrar produtos de informática em um preço que caiba em seu bolso!
```

### Exemplo com EJS

**EJS** (Embedded JavaScript) é uma view engine que usa a sintaxe JavaScript dentro de arquivos HTML para gerar conteúdo dinâmico.

#### Instalação:

```bash
npm install ejs
```

#### Configuração:

```javascript
const express = require('express');
const app = express();

// Configura o Express para usar EJS como view engine
app.set('view engine', 'ejs');
app.set('views', './views'); // Diretório onde os templates EJS estão localizados

app.get('/', (req, res) => {
    res.render('index', { title: 'WesleyTech Store', message: 'Bem-vindo à nossa loja!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

#### Criando o Template `index.ejs`:

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
</head>
<body>
    <h1><%= message %></h1>
    <p>Aqui você pode encontrar produtos de informática em um preço que caiba em seu bolso!</p>
</body>
</html>
```

### Exemplo com Handlebars

**Handlebars** é uma view engine que permite a criação de templates utilizando uma sintaxe simples e intuitiva.

#### Instalação:

```bash
npm install express-handlebars
```

#### Configuração:

```javascript
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

// Configura o Express para usar Handlebars como view engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views'); // Diretório onde os templates Handlebars estão localizados

app.get('/', (req, res) => {
    res.render('index', { title: 'WesleyTech Store', message: 'Bem-vindo à nossa loja!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

#### Criando o Template `index.handlebars`:

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
</head>
<body>
    <h1>{{message}}</h1>
    <p>Aqui você pode encontrar produtos de informática em um preço que caiba em seu bolso!</p>
</body>
</html>
```

### Escolhendo a View Engine Certa

A escolha da view engine depende das necessidades do seu projeto e das preferências pessoais. Aqui estão alguns fatores a considerar:

- **Pug**: Sintaxe minimalista e concisa, ideal para quem prefere um código mais limpo e legível.
- **EJS**: Fácil de aprender, especialmente para quem já está familiarizado com JavaScript, e permite a inclusão de lógica simples dentro dos templates.
- **Handlebars**: Sintaxe intuitiva, suporta layouts e partials (sub-templates), ideal para projetos que precisam de uma estrutura de templates mais complexa.

> **Observação:** Para ver um comparativo entre as Template Engines abordadas aqui e outras que são mutilizadas pela comunidade de Javascript, acesse: 
> [ejs vs handlebars vs mustache vs pug vs vue](https://npmtrends.com/ejs-vs-handlebars-vs-mustache-vs-pug-vs-vue "Comparativo entre Template Engines").