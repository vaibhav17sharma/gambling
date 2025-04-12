function successResp(res, message, statusCode = 200, data = {}) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
      });
}

/**
 * Sends a failure response to the client.
 *
 * @param {Object} res - The response object from the Express framework.
 * @param {number} [statusCode=500] - The HTTP status code to send (default is 500).
 * @param {string} [message="Something went wrong"] - A message describing the error (default is "Something went wrong").
 * @param {Array} [errors=[]] - An array of error details (default is an empty array).
 * @returns {Object} The JSON response containing the success status, message, and errors.
 */
function failureResp(res, message = "Something went wrong", statusCode = 500, errors = []) {
    return res.status(statusCode).json({
        success: false,
        message,
        errors: Array.isArray(errors) ? errors : [errors], // ensure it's always an array
    });
}

module.exports = {successResp, failureResp};