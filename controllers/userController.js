const UserModel = require('../models/user');
const UserWallet = require('../models/userWallet');
const { successResp, failureResp } = require('../utils/response');

async function getUserProfile(req, res, next) {

    let user = await UserModel.findOne({ where: { id: 2 }, attributes: ['username', 'first_name', 'last_name'] });

    if (!user) {
        return failureResp(res, "User not found.", 200);
    }

    return successResp(res, "User profile data.", 200, user.toJSON());
}

async function getUserBalance(req, res, next) {

    // Assuming you have a User model and a way to get the user's balance
    const userId = req.user.id; // Assuming you have user ID in req.user after authentication
    console.log(req.user.id); // Log the user ID for debugging


    try {
        const user = await UserWallet.findOne({ where: { id: userId, deleted_at: null }, attributes: ['avl_amount'] });
        var userDetails = {
            user_id: userId,
            user_name: req.user.username,
            user_email: req.user.email,
            avl_amount: !user ? 0 : user.avl_amount,
        };
        if (!user) {
            return successResp(res, "User balance not found.", 200, { user: userDetails });
        }
        return successResp(res, "User balance retrieved successfully.", 200, { user: userDetails });
    } catch (error) {
        console.error("Error retrieving user balance:", error);
        return failureResp(res, "An error occurred while retrieving the balance.", 500);
    }
}


module.exports = {
    getUserProfile, getUserBalance
};