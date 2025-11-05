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
    } catch (e) {
        console.log('Ошибка:', e.message); 
    }
}

app.post('/regist', async (req, res) => {
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

app.post('/login', async (req, res) =>{
    const userData = req.body;

    UserDB.findOne({ where: { name: userData.name } }),
    UserDB.findOne({ where: { email: userData.email } }),
    

    console.log('Добро пожаловать: ', userData.name);

})

testConnection();