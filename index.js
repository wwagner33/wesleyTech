const express = require("express");
const app = express();
const session = require("express-session");
const env = require("dotenv").config();

// Configuração do middleware de sessão
app.use(session({
    secret: `${process.env.SECRETKEY}`, // Chave secreta usada para criptografar (assinar) a sessão
    resave: false, // Não salvar sessão se nada foi modificado
    saveUninitialized: true, // Salvar sessões não inicializadas
    cookie: {secure: false }, // Defina como true se estiver usando HTTPS // Tempo de expiração da sessão (1 hora)
}));

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
    {
        uid: 2,
        name: "Maria Clara",
        email: "maria.clara@example.com",
        password: "senha456",
    },
    {
        uid: 3,
        name: "João Gabriel",
        email: "joao.gabriel@example.com",
        password: "senha789",
    },
    {
        uid: 4,
        name: "Ana Luiza",
        email: "ana.luiza@example.com",
        password: "senha321",
    },
    {
        uid: 5,
        name: "Carlos Eduardo",
        email: "carlos.eduardo@example.com",
        password: "senha654",
    },
    {
        uid: 6,
        name: "Beatriz Santos",
        email: "beatriz.santos@example.com",
        password: "senha987",
    },
    {
        uid: 7,
        name: "Fernando Oliveira",
        email: "fernando.oliveira@example.com",
        password: "senha123",
    },
    {
        uid: 8,
        name: "Lúcia Mendes",
        email: "lucia.mendes@example.com",
        password: "senha123",
    },
    {
        uid: 9,
        name: "Pedro Santos",
        email: "pedro.santos@example.com",
        password: "senha123",
    }
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
    if (req.session.user) {//testa se o Request feito esta na sessao do usuario autenticado
        req.user = req.session.user;
        next(); //passa para o proximo middleware ou callback rota
    } else {
        res.status(401).redirect("/"); //Caso a pessoa não seja autorizada, gera-se um erro para o cliente, erro 401 (UnAuthozed) e o cliente é redirecionado para a página de Login
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
        res.status(200).json({
            message: "Login realizado com sucesso!",
        });
    } else {
        res.status(401).json({ message: "Usuário ou senha inválidos" });
    }
});

// Rota protegida - Home
app.get("/home", authMiddleware, (req, res) => {
    
    res.render("home", {
        produtos,
        user: req.user,
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
    {
        id: 2,
        nome: "Mouse",
        descricao:
            "Mouse sem fio Logitech MX Master 3, ergonômico, com sensor de alta precisão e bateria recarregável.",
        preco: 99.99,
    },
    {
        id: 3,
        nome: "Teclado",
        descricao:
            "Teclado mecânico sem fio Keychron K2, com switches Red, retroiluminação RGB, compatível com Windows e macOS.",
        preco: 199.99,
    },
    {
        id: 4,
        nome: "Monitor",
        descricao:
            "Monitor LG UltraWide 34'', resolução 2560x1080, tecnologia IPS, ideal para multitarefa e edição de vídeo.",
        preco: 1499.99,
    },
    {
        id: 5,
        nome: "Headset",
        descricao:
            "Headset Gamer HyperX Cloud II, som surround 7.1, microfone removível, estrutura em alumínio.",
        preco: 499.99,
    },
    {
        id: 6,
        nome: "Impressora",
        descricao:
            "Impressora Multifuncional HP DeskJet 3776, com Wi-Fi, impressão, cópia e digitalização, compatível com smartphones e tablets.",
        preco: 399.99,
    },
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
