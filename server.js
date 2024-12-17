
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const MONGO_URI = process.env.MONGO_URI;
const FRONT_URL = process.env.FRONTEND_URL;

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
    const { firstName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já cadastrado' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso' });

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});





// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});