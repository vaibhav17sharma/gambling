const bcrypt = require('bcrypt');
const UserService = require('../service/UserService');
const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
const UserModel = require('../models/user');
const { successResp, failureResp } = require('../utils/response');
const jwt = require('jsonwebtoken');
const AuthError = require('../exceptions/AppException');
const JWT_SECRET = process.env.JWT_SECRET;


async function login(req, res) {
        const{username,password}=req.body;
        const user = await UserModel.findOne({ where: { username },attributes: ['id','first_name','last_name','role','email', 'password','username'] });    
        if (!user) {
            throw new AuthError("User does not exist.", 404);  // Custom error for user not found
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AuthError("Invalid password.", 401);  // Custom error for wrong password
        }

        const token = generateToken(user);
        return {
            user: { id: user.id, email: user.email, username: user.username,role:user.role,first_name:user.first_name,last_name:user.last_name },
            message: "User logged in successfully.",
            token
        };
    
}


function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}

module.exports = {
    login,
    generateToken
};