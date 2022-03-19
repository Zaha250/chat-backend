const UserModel = require("../models/User");

class UserService {
    async findOne(login) {
        try{
            const user = await UserModel.findOne({login}).exec();
            return user;
        } catch (e) {
            throw Error(e);
        }
    }
}

module.exports = UserService;