const UserModel = require('../models/user');
const UserWallet = require('../models/userWallet');
const AdminWallets = require('../models/adminWallets');
const userAccountModel = require('../models/userAccounts');
const { successResp, failureResp } = require('../utils/response');
const Sequelize = require('sequelize'); 
const sequelize = require('../config/database');
const WalletTransactions = require('../models/walletTransactions');

async function getUserProfile(req, res, next) {

    let user = await UserModel.findOne({ where: { id: 2 }, attributes: ['username', 'first_name', 'last_name'] });

    if (!user) {
        return failureResp(res, "User not found.", 404);
    }

    return successResp(res, "User profile data.", 200, user.toJSON());
}

async function getUserBalance(req, res, next) {

    // Assuming you have a User model and a way to get the user's balance
    const userId = req.user.id; // Assuming you have user ID in req.user after authentication

    try {
        const user = await UserWallet.findOne({ where: { user_id: userId, deleted_at: null }, attributes: ['avl_amount'] });
        
        if (!user) {
            return successResp(res, "User balance not found.", 200, { user: userDetails });
        }

        let userDetails = {
            // user_id: userId,
            // user_name: req.user.username,
            // user_email: req.user.email,
            avl_amount: !user ? 0 : user.avl_amount,
        };
        
        return successResp(res, "User balance retrieved successfully.", 200, { user: userDetails });
    } catch (error) {
        // console.error("Error retrieving user balance:", error);
        return failureResp(res, "An error occurred while retrieving the balance.", 500);
    }
}

async function getPaymentQrCode(req, res, next) {
    const adminWalletId = req.body.id;
    
    const adminWallet = await AdminWallets.findOne({
        where:  Sequelize.where(Sequelize.col('ttl_txn_amount'), '<', Sequelize.col('max_trxn_amount')), 
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

async function getUserSpinDetails(req, res, next) {
    try {
        const user_id = req.user.id;
        const { usercouponId } = req.params;

        const spinDetails = await sequelize.query(`
        select uc.id as user_coupon_id, 
        uc.coupon_id as coupon_id,
        c.coupon_name as coupon_name,
        c.price as coupon_price,
        uc.user_id as user_id,
        uc.created_at as coupon_purchase_date,
        s.prize_amount as winning_amount, 
        s.created_at as spin_date,
        DATE_ADD(uc.created_at, INTERVAL c.spin_days DAY) as coupon_expiry_date
        from user_coupons 
        uc join spins s on uc.id=s.user_coupon_id
        join coupons c on c.id=uc.coupon_id
        where uc.user_id=:user_id and uc.id=:usercouponId 
        and uc.deleted_at is null and c.deleted_at is null
        `, 
        {
            replacements: { user_id, usercouponId },
            type: Sequelize.QueryTypes.SELECT,
        })

        if(!spinDetails || spinDetails.length === 0) {
            return failureResp(res, "No spin details found.", 404);
        }
        let couponDetails={
            coupon_id: spinDetails[0].coupon_id,
            coupon_purchase_date: spinDetails[0].coupon_purchase_date,
            coupon_expiry_date: spinDetails[0].coupon_expiry_date,
            coupon_name: spinDetails[0].coupon_name,
            coupon_price: spinDetails[0].coupon_price,
        }
        spinDetails.forEach(spin => {
            delete spin.coupon_id;
            delete spin.coupon_purchase_date;
            delete spin.coupon_expiry_date;
            delete spin.coupon_name;
            delete spin.coupon_price;
        });
        
        return successResp(res, "Success", 200, { spinDetails,couponDetails });



    }
    catch (err) {
        console.error("Login error:", err);
        next(err);
        return failureResp(res, "Something went wrong.", 500, {
            message: err.message,
        });
    }
}

async function updateTransaction(req, res) {
    // Apply authorization check for admin
    const status = req.body.status;
    const adminUser = req.user;
    const customerUserId = req.params.id;
    const walletTransactionId = req.body.wallet_transaction_id;

    if (adminUser.role !== 'admin') {
        return failureResp(res, "Unauthorized access.", 403);
    }

    try {
        // Find the wallet transaction using a join
        const walletTransaction = await WalletTransactions.findOne({
            where: { id: walletTransactionId },
            include: [
                {
                    model: UserWallet,
                    as: 'wallet',
                    where: { user_id: customerUserId, deleted_at: null },
                    attributes: [] // Exclude wallet attributes from the result
                }
            ]
        });

        if (!walletTransaction) {
            return failureResp(res, "Transaction does not belong to the user.", 403);
        }

        // Update the transaction status
        const [updatedRows] = await WalletTransactions.update(
            { status: status },
            { where: { id: walletTransactionId } }
        );

        if (updatedRows === 0) {
            return failureResp(res, "Failed to update transaction.", 500);
        }

        return successResp(res, "Transaction updated successfully.", 200);
    } catch (error) {
        return failureResp(res, "An error occurred while updating the transaction.", 500);
    }
   
}

async function getUserTransactions(req, res, next) {
    const userId = req.user.id;
    const customerUserId = req.body.user_id;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
    const offset = (page - 1) * limit;

    try {
        // Check if the user has a wallet
        const userWallet = await UserWallet.findOne({
            where: { user_id: customerUserId, deleted_at: null },
            attributes: ['id', 'avl_amount'],
            include: [
                {
                    model: WalletTransactions,
                    as: 'transactions',
                    attributes: ['id', 'amount', 'type', 'status', 'created_at'],
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    order: [['created_at', 'DESC']]
                }
            ]
        });

        if (!userWallet) {
            return failureResp(res, "User wallet not found.", 404);
        }

        if (!userWallet.transactions || userWallet.transactions.length === 0) {
            return failureResp(res, "No transactions found for the user.", 404);
        }

        return successResp(res, "User transactions retrieved successfully.", 200, {
            wallet: {
                id: userWallet.id,
                avl_amount: userWallet.avl_amount,
                transactions: userWallet.transactions
            },
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: userWallet.transactions.length,
                totalPages: Math.ceil(userWallet.transactions.length / limit)
            }
        });
    } catch (error) {
        return failureResp(res, "An error occurred while retrieving transactions.", 500);
    }
}

module.exports = {
    getUserProfile, 
    getUserBalance, 
    getPaymentQrCode,
    saveUserAccount, 
    getUserPurchasedCoupons,
    getUserSpinDetails,
    updateTransaction,
    getUserTransactions
}