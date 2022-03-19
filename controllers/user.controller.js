const UserService = require("../services/user.service");
const UserModel = require("../models/User");

const UserApi = new UserService();

class UserController {
    async create(req, res) {
        try {
            const { login, name, secondName, lastName, photo, password } = req.body;
            const newUser = new UserModel({
                login,
                password,
                name,
                secondName,
                lastName,
                photo
            });

            const user = await UserApi.findOne(login);
            if(user) {
                res.json({error: 'Пользователь с таким именем уже есть в системе'});
            } else {
                const savedUser = await newUser.save();
                res.json({user: savedUser, error: null});
            }
        } catch (error) {
            res.status(500).json({error});
        }
    }

    async auth(req, res) {
        try{
            const {login, password} = req.body;
            const user = await UserApi.findOne(login);
            if(user) {
                if(user.password === password) {
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
    }
}

module.exports = UserController;