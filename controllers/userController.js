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
        attributes: ['id', 'upi_id']
    });

    if(!adminWallet) {
        return failureResp(res, "Admin wallet not found.");
    }

    return successResp(res, "Payment QR Code.", 200, {admin_wallet : adminWallet});
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

async function addWalletTopup(req, res) {
    // Apply authorization check for admin
    
    const adminUser = req.user;
    const customerUserId = req.body.user_id;
    // const walletTransactionId = req.body.wallet_transaction_id;
    // const adminWalletId = req.body.admin_wallets_id;

    const {
        transaction_amount,
        admin_wallets_id,
        utr_no,
        admin_wallet_id : adminWalletId
    } = req.body;

    if (adminUser.role !== 'admin') {
        return failureResp(res, "Unauthorized access.", 403);
    }

    try {
        // Find the user's wallet and include wallet transactions
        const userWallet = await UserWallet.findOne({
            where: { user_id: customerUserId, deleted_at: null },
            // include: [
            //     {
            //         model: WalletTransactions,
            //         as: 'transactions',
            //         where: { id: walletTransactionId },
            //         attributes: ['id', 'amount', 'type', 'status', 'created_at']
            //     }
            // ]
        });

        if (!userWallet || !userWallet.length === 0) {
            return failureResp(res, "User Wallet Not Found.", 403);
        }

        if(Number(transaction_amount) <= 0 ) {
            return failureResp(res, "Transaction amount should be greater than 0.", 403);
        } 

        let walletTransaction = await WalletTransactions.create({
            transaction_amount: transaction_amount,
            user_wallet_id: userWallet.id,
            admin_wallets_id: adminWalletId,
            utr_no,
            type: "credit",
            status: "approved",
            transaction_purpose: "wallet_topup",
            description: "wallet topup",
        });
 
        if(!walletTransaction) {
            return failureResp(res, "Failed to create wallet transaction.", 500);
        }

        // const adminWalletUpdate = await AdminWallets.increment(
        //     { ttl_txn_amount: transaction_amount },
        //     { where: { id: adminWalletId } }
        // );

        // if (!adminWalletUpdate || adminWalletUpdate[0][1] === 0) {
        //     return failureResp(res, "Failed to update admin wallet.", 500);
        // }

        const userWalletUpdate = await UserWallet.increment(
            { avl_amount: transaction_amount },
            { where: { id: userWallet.id } }
        );

        if (!userWalletUpdate || userWalletUpdate[0][1] === 0) {
            return failureResp(res, "Failed to update user wallet.", 500);
        }

        return successResp(res, "Transaction created successfully.", 201);
    } catch (error) {
        console.log(error);
        return failureResp(res, "An error occurred while creating the transaction.", 500);
    }
}

async function getUserTransactions(req, res, next) {
    const customerUserId = req.params.userId;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
    const offset = (page - 1) * limit;

    try {
        const baseQuery = `
            FROM user_wallet uw
            LEFT JOIN wallet_transactions wt ON uw.id = wt.user_wallet_id
            WHERE uw.user_id = :customerUserId AND uw.deleted_at IS NULL AND wt.deleted_at IS NULL
        `;

        // Query to get the total count of transactions
        const totalCountResult = await sequelize.query(`
            SELECT COUNT(*) AS total
            ${baseQuery}
        `, {
            replacements: { customerUserId },
            type: Sequelize.QueryTypes.SELECT
        });

        const totalCount = totalCountResult[0]?.total || 0;

        if (totalCount === 0) {
            return failureResp(res, "No transactions found for the user.", 404);
        }

        // Query to get the paginated transactions
        const transactionsData = await sequelize.query(`
            SELECT 
                uw.id AS wallet_id,
                uw.avl_amount,
                wt.id AS wallet_transaction_id,
                wt.transaction_amount,
                wt.type,
                wt.status,
                wt.transaction_purpose,
                wt.created_at
            ${baseQuery}
            ORDER BY wt.created_at DESC
            LIMIT :limit OFFSET :offset
        `, {
            replacements: { customerUserId, limit: parseInt(limit), offset: parseInt(offset) },
            type: Sequelize.QueryTypes.SELECT
        });

        const wallet = {
            id: transactionsData[0]?.wallet_id || null,
            avl_amount: transactionsData[0]?.avl_amount || 0,
            transactions: transactionsData.map(txn => ({
                id: txn.wallet_transaction_id,
                amount: txn.transaction_amount,
                type: txn.type,
                status: txn.status,
                transaction_purpose: txn.transaction_purpose,
                created_at: txn.created_at
            })).filter(txn => txn.id) // Filter out null transactions
        };

        return successResp(res, "User transactions retrieved successfully.", 200, {
            wallet,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        return failureResp(res, "An error occurred while retrieving transactions.", 500);
    }
}

async function getAllUser(req, res) {
    const adminUser = req.user;

    console.log(adminUser);
    if (adminUser.role !== 'admin') {
        return failureResp(res, "Unauthorized access.", 403);
    }

    try {
        const users = await UserModel.findAll({
            where: { role: { [Sequelize.Op.ne]: 'admin' } },
            attributes: ['id', 'username', 'first_name', 'last_name', 'email']
        });

        if (!users || users.length === 0) {
            return failureResp(res, "No non-admin users found.", 404);
        }

        return successResp(res, "Non-admin users retrieved successfully.", 200, { users });
    } catch (error) {
        return failureResp(res, "An error occurred while retrieving users.", 500);
    }

}

async function addOrUpdateAdminWallet(req, res) {
    const adminUser = req.user;
    if (adminUser.role !== 'admin') {
        return failureResp(res, "Unauthorized access.", 403);
    }

    const { upi_id, max_trxn_amount, account_number } = req.body;

    try {
        const existingAdminWallet = await AdminWallets.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { account_number },
                    { upi_id }
                ],
                deleted_at: null
            }
        });

        
        if (existingAdminWallet) {
            await existingAdminWallet.update({ upi_id, max_trxn_amount, account_number });
            const { qr_image, ...walletWithoutQrImage } = existingAdminWallet.toJSON();
            return successResp(res, "Admin wallet updated successfully.", 200, { admin_wallet: walletWithoutQrImage });
        } else {
            const newAdminWallet = await AdminWallets.create({ upi_id, max_trxn_amount, account_number });
            const { qr_image, ...walletWithoutQrImage } = newAdminWallet.toJSON();
            return successResp(res, "Admin wallet created successfully.", 201, { admin_wallet: walletWithoutQrImage });
        }
    } catch (error) {
        return failureResp(res, "An error occurred while processing the admin wallet.", 500);
    }
}

async function deleteAdminWallet(req, res) {
    const adminUser = req.user;
    if (adminUser.role !== 'admin') {
        return failureResp(res, "Unauthorized access.", 403);
    }

    const { admin_wallet_id } = req.body;

    try {
        const deletedWallet = await AdminWallets.destroy({ where: { id:admin_wallet_id } });
        if (!deletedWallet) {
            return failureResp(res, "Admin wallet not found.", 404);
        }
        return successResp(res, "Admin wallet deleted successfully.", 200);
    } catch (error) {
        return failureResp(res, "An error occurred while deleting the admin wallet.", 500);
    }
}

module.exports = {
    getUserProfile, 
    getUserBalance, 
    getPaymentQrCode,
    saveUserAccount, 
    getUserPurchasedCoupons,
    getUserSpinDetails,
    addWalletTopup,
    getUserTransactions,
    getAllUser,
    addOrUpdateAdminWallet,
    deleteAdminWallet
}