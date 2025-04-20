
class AppException extends Error {
    constructor(message, statusCode = 401,data=[]) {
        super(message);  // Call parent class constructor
        this.name = "AuthError";
        this.statusCode = statusCode;
        this.stack = (new Error()).stack;  // optional: to capture stack trace
        this.data = data;  // optional: to capture additional data
    }
}

module.exports = AppException;