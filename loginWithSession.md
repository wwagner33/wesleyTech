### 1. **Adição do Middleware `express-session`:**
```javascript
const session = require("express-session");

app.use(session({
    secret: 'sua_chave_secreta', // Chave secreta usada para assinar a sessão
    resave: false, // Não salvar sessão se nada foi modificado
    saveUninitialized: true, // Salvar sessões não inicializadas
    cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));
```

### 2. **Armazenamento do `authToken` na Sessão:**
```javascript
// Rota de autenticação
app.post("/authenticated", (req, res) => {
    const { email, password } = req.body;
    const authResult = autenticador(email, password);

    if (authResult) {
        // Armazena o token na sessão
        req.session.authToken = authResult.authToken;

        res.status(200).json({
            message: "Login realizado com sucesso!",
            authToken: authResult.authToken,
        });
    } else {
        res.status(401).json({ message: "Usuário ou senha inválidos" });
    }
});
```

### 3. **Verificação do `authToken` a partir da Sessão:**
```javascript
// Middleware de autenticação
function authMiddleware(req, res, next) {
    const { authToken } = req.query;
    const sessionToken = req.session.authToken;

    console.log(`authToken: ${authToken} \n sessionToken: ${sessionToken}`);

    const user = users.find(u => sessionToken === authToken);

    if (user) {
        req.user = user;
        next();
    } else {
        res.status(401).redirect("/");
    }
}
```