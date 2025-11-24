import express from "express";
import { Sequelize, DataTypes } from "sequelize";

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.listen(3000, () => console.log('server started')); 

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "public/contentDB.sqlite",
});

const UserDB = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {  
        type: DataTypes.STRING,
        allowNull: false,

    },
    userId:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    }
});

async function testConnection() {
    try {
        await sequelize.authenticate(); 
        console.log('Соединение установлено успешно');
        await UserDB.sync();
        console.log('База данных синхронизирована');
    } catch (e) {
        console.log('Ошибка:', e.message); 
    }
}

app.post('/submit', async (req, res) => {
    const userData = req.body;
    console.log('Получены данные: ', userData);
    
    try {
        const newUser = await UserDB.create({
            name: userData.name,
            number: userData.number,
            email: userData.email,
            password: userData.password
        });
        
        console.log('Пользователь сохранен в базу:', newUser.userId);
        
        res.json({ message: `Ваши данные, ${userData.name}` });
        
    } catch (error) {
        console.log('Ошибка сохранения:', error);
        res.status(500).json({ error: 'Не удалось сохранить данные' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await UserDB.findOne({
            where: { email: email }
        });
        
        if (!user) {
            return res.status(401).json({ 
                active: false,
                message: 'Пользователь с таким email не найден' 
            });
        }
        
        if (user.password !== password) {
            return res.status(401).json({ 
                active: false,
                message: 'Неверный пароль' 
            });
        }
        
        const userData = {
            userId: user.userId,
            name: user.name,
            email: user.email,
            number: user.number
        };
        
        res.json({
            active: true,
            userData: userData,
            message: 'Авторизация успешна'
        });
        
    } catch (error) {
        console.log('Ошибка авторизации:', error);
        res.status(500).json({ 
            active: false,
            message: 'Ошибка сервера при авторизации' 
        });
    }
});

app.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const user = await UserDB.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        const userData = {
            userId: user.userId,
            name: user.name,
            email: user.email,
            number: user.number
        };
        
        res.json(userData);
        
    } catch (error) {
        console.log('Ошибка получения профиля:', error);
        res.status(500).json({ error: 'Ошибка сервера при получении профиля' });
    }
});

testConnection();