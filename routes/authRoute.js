const router = require('express').Router();
const UserModel = require('../models/User');

router.post('/', async (req, res) => {
    try{
        const user = await UserModel.findOne({login: req.body.login}).exec();
        if(user) {
            if(user.password === req.body.password) {
                res.json({user, error: null});
            } else {
                res.json({user: null, error: 'Введен неверный логин или пароль'});
            }
        } else {
            res.json({user: null, error: 'Введен неверный логин или пароль'});
        }
    } catch (error) {
        res.status(500).json({error});
    }
});

router.post('/reg', async (req, res) => {
    const { login, name, secondName, lastName, photo, password } = req.body;
    const newUser = new UserModel({
        login,
        password,
        name,
        secondName,
        lastName,
        photo
    });

    try{
        const user = await UserModel.findOne({login}).exec();
        if(user) {
            res.json({error: 'Пользователь с таким именем уже есть в системе'});
        } else {
            const savedUser = await newUser.save();
            res.json({user: savedUser, error: null});
        }
    } catch (error) {
        res.status(500).json({error});
    }
});

module.exports = router;