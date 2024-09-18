const express = require("express");
const app = express();
const session = require("express-session");

// Configuração do middleware de sessão
app.use(
    session({
        secret: "sua_chave_secreta_aqui",
        resave: false,
        saveUninitialized: false,
    }),
);

app.use(express.static("./public"));
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Lista de usuários
const users = [
    {
        uid: 1,
        name: "Wellington Wagner",
        email: "well@example.com",
        password: "senha123",
    },
    // ... outros usuários
];

// Função de autenticação
function autenticador(email, password) {
    for (let count = 0; count < users.length; count++) {
        if (
            users[count].email === email &&
            users[count].password === password
        ) {
            return { user: users[count] };
        }
    }
    return null;
}

// Middleware de autenticação
function authMiddleware(req, res, next) {
    if (req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        res.status(401).redirect("/");
    }
}

// Rota principal
app.get("/", (req, res) => {
    res.render("login");
});

// Rota de autenticação
app.post("/authenticated", (req, res) => {
    const { email, password } = req.body;
    const authResult = autenticador(email, password);

    if (authResult) {
        req.session.user = authResult.user;
        console.log(`Autenticated: ${req.session.user} `);
        res.status(200).json({
            message: "Login realizado com sucesso!",
        });
    } else {
        res.status(401).json({ message: "Usuário ou senha inválidos" });
    }
});

// Rota protegida - Home
app.get("/home", authMiddleware, (req, res) => {
    console.log(`HOME: ${req.session.user} `);
    res.render("home", {
        produtos,
        user: req.session.user,
    });
});

// Produtos para exibição
const produtos = [
    {
        id: 1,
        nome: "Notebook",
        descricao:
            "Notebook Dell Inspiron 15, com processador Intel i7, 16GB de RAM, 512GB SSD, tela Full HD de 15.6 polegadas.",
        preco: 2999.99,
    },
    // ... outros produtos
];

//Rota de Listagem de produtos
app.get("/listaprodutos", (req, res) => {
    res.send(produtos);
});

// Rota protegida - Produtos
app.get("/produtos", authMiddleware, (req, res) => {
    res.render("produtos", {
        produtos,
        user: req.session.user,
    });
});

// Rota protegida - Cadastro
app.get("/cadastro", authMiddleware, (req, res) => {
    res.render("cadastro", {
        user: req.session.user,
    });
});

// Iniciar o servidor
const server = app.listen(3000, "0.0.0.0", () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(
        `Aplicação WesleyTech Store está rodando no endereço IP ${host} e na porta ${port}`,
    );
});
