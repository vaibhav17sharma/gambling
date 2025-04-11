const UserModel = require('../models/user');
const {sucessResp , failureResp, successResp} = require('../utils/response');
const bcrypt = require('bcrypt');
const saltRounds =  parseInt(process.env.SALT_ROUNDS || '10', 10);

async function login(req, res, next) {
 
}

async function signup(req, res, next) {
    const {username, password, first_name, last_name, email} = req.body;
    
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    //TODO : check for email as well
    let user = await UserModel.findOne({where : {username : username}});

    console.log(user);
    if(user) {
        return failureResp(res, "User already exists.", 200);  
    }


    const passHash = await bcrypt.hash(password, saltRounds);
    user = await UserModel.create({ username , password, first_name, last_name,  email});
    
   return successResp(res, "User created successfuly.", 201);
}

module.exports = {signup, login};