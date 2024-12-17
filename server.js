
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

const corsOptions = {
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true, 
};

app.use(express.json());
app.use(cors(corsOptions));

mongoose.connect('mongodb://127.0.0.1:27017/site')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB', err));

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
};

// Rota de Registro
app.post('/register', async (req, res) => {
    console.log('Dados recebidos pelo servidor:', req.body);

    const { firstName, email, password } = req.body;

    if (!firstName || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error('Usuário já registrado:', email);
            return res.status(400).json({ message: 'Usuário já cadastrado.' });
        }

        if (password.length < 6) {
            console.error('Senha muito curta:', password);
            return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        console.log('Usuário registrado com sucesso:', newUser);

        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
        console.error('Erro no servidor ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
});


// Rota de Login
app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas, Email incorreto.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas, Senha Incorreta.' });
        }
        const token = jwt.sign({ id: user._id, firstName: user.firstName }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            firstName: user.firstName,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

