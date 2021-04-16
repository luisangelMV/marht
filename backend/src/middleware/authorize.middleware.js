const jwt = require('express-jwt');
const { secret } = process.env;
const db = require('../database');

module.exports = authorize;

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        jwt({ secret, algorithms: ['HS256'] }),

        async (req, res, next) => {
            const account = await db.Account.findById(req.user.id);
            const refreshToken = await db.RefreshToken.find({ account: account.id });

            if (!account || (roles.length && !roles.includes(account.role))) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            req.user.role = account.role;
            req.user.ownsToken = token => !!refreshToken.find(x => x.token === token);
            next();
        }
    ];
}