const UserModel = require('../models/user');
const {successResp , failureResp} = require('../utils/response');

async function getUserProfile(req, res, next) {
   
    let user = await UserModel.findOne({where : {id : 2}, attributes : ['username', 'first_name', 'last_name']});

    if(!user) {
        return failureResp(res, "User not found.", 200);  
    }

    return successResp(res, "User profile data.", 200, user.toJSON());
}

module.exports = {
    getUserProfile
};