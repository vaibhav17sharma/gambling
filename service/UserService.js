const bcrypt = require('bcrypt');
const UserService = require('../service/UserService');
const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
const UserModel = require('../models/user');
const { successResp, failureResp } = require('../utils/response');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


async function login(req, res) {
    try {
        const{username,password}=req.body;
        const user = await UserModel.findOne({ where: { username },attributes: ['id', 'email', 'password','username'] });    
        if (!user) {
            return failureResp(res, "User does not exist.", 200);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return failureResp(res, "Invalid password.", 200);
        }

        const token = generateToken(user);
        return {
            user: { id: user.id, email: user.email, username: user.username },
            token
        };
    } catch (error) {
        console.error("Error during login:", error);
        return failureResp(res, "An error occurred during login.", 500);
    }
}


function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}

module.exports = {
    login,
    generateToken
};