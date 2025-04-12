const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel=require('../models/user');


async function authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return failureResp(res, "Token not provided", 401);
    }
    // Verify the token using the secret key
    // This will decode the token and return the payload if valid
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return failureResp(res, "Invalid token", 401);
        }

        try {
            req.user = await UserModel.findOne({ where: { id: decoded.id }, attributes: ['id','username','email','first_name','last_name','created_at'] });
            next();
        } catch (error) {
            return failureResp(res, "Failed to fetch user data", 500);
        }
    });
}

module.exports = authenticate;