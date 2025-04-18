const UserModel = require('../models/user');
const UserWallet = require('../models/userWallet');
const AdminWallets = require('../models/adminWallets');
const userAccountModel = require('../models/userAccounts');
const { successResp, failureResp } = require('../utils/response');
const Sequelize = require('sequelize'); 

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
        // console.error("Error retrieving user balance:", error);
        return failureResp(res, "An error occurred while retrieving the balance.", 500);
    }
}

async function getPaymentQrCode(req, res, next) {
    const adminWalletId = req.body.id;
    
    const adminWallet = await AdminWallets.findOne({
        where:  Sequelize.where(Sequelize.col('ttl_trxn_amount'), '<', Sequelize.col('max_txn_amount')), 
        order: Sequelize.literal('RAND()'),
        attributes: ['qr_image']
    });

    if(!adminWallet) {
        return failureResp(res, "Admin wallet not found.");
    }

    return successResp(res, "Payment QR Code.", 200, {qr_image : adminWallet['qr_image']});
}

async function saveUserAccount(req, res, next) {
    const userId = req.user.id;
    const{ account_number, ifsc_code,bank_name } = req.body;
    const userAccount = await userAccountModel.findOne({ where: { user_id: userId ,account_number:account_number} });
    if (userAccount) {
        return failureResp(res, "User account already exists.", 200);
    }
    const newUserAccount = await userAccountModel.create({ user_id: userId, account_number, ifsc_code, bank_name });
    if (!newUserAccount) {
        return failureResp(res, "Failed to save user account.", 200);
    }
    return successResp(res, "User account saved successfully.", 200, { userAccount: newUserAccount });
}

async function getUserPurchasedCoupons(req, res, next) {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
    const offset = (page - 1) * limit;

    const transaction = await sequelize.transaction();
    try {
        const baseQuery = `
            FROM coupons c
            JOIN user_coupons uc ON c.id = uc.coupon_id
            WHERE uc.user_id = :userId AND uc.deleted_at IS NULL AND c.deleted_at IS NULL
        `;

        const [coupons, total] = await Promise.all([
            sequelize.query(`
                SELECT c.id, 
                c.coupon_name, 
                c.price, 
                uc.id as user_coupon_id, 
                uc.created_at AS purchase_date,
                IF(DATE_ADD(uc.created_at, INTERVAL c.spin_days DAY) < NOW(), 'expired', 'valid') as coupon_status
                ${baseQuery}
                ORDER BY uc.created_at DESC
                LIMIT :limit OFFSET :offset
            `, {
                replacements: { userId, limit: parseInt(limit), offset: parseInt(offset) },
                type: Sequelize.QueryTypes.SELECT,
                transaction
            }),
            sequelize.query(`
                SELECT COUNT(*) as total
                ${baseQuery}
            `, {
                replacements: { userId },
                type: Sequelize.QueryTypes.SELECT,
                transaction
            })
        ]);

        const totalCount = total[0]?.total || 0;

        if (!coupons || coupons.length === 0) {
            await transaction.rollback();
            return failureResp(res, "No purchased coupons found.", 404);
        }

        await transaction.commit();
        return successResp(res, "Purchased coupons retrieved successfully.", 200, { 
            coupons, 
            pagination: { 
                page: parseInt(page), 
                limit: parseInt(limit), 
                // total: totalCount, 
                totalPages: Math.ceil(totalCount / limit) 
            } 
        });
    } catch (error) {
        await transaction.rollback();
        return failureResp(res, "Something went wrong please try again later.", 500);
    }
}

module.exports = {
    getUserProfile, 
    getUserBalance, 
    getPaymentQrCode,
    saveUserAccount, 
    getUserPurchasedCoupons,
};