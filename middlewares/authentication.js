const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return failureResp(res, "Token not provided", 401);
    }
    // Verify the token using the secret key
    // This will decode the token and return the payload if valid
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return failureResp(res, "Invalid token", 401);
        }
        req.user = decoded;
        next();
    });
}

module.exports = authenticate;