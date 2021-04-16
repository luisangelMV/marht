// Models 

const db = require('../database');

// Modules

const Role = require('../models/role');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function _delete(id) {
    const account = await getAccount(id);
    await account.remove();
}

async function getAll() {
    const accounts = await db.Account.find();
    return accounts.map(x => basicDetails(x));
}

async function create(params) {
    // validate
    if (await db.Account.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = new db.Account(params);
    account.verified = Date.now();

    // hash password
    account.password = account.encryptPassword(params.password);

    // save account
    await account.save();

    return basicDetails(account);
}

async function update(id, params) {
    const account = await getAccount(id);

    // validate (if email was changed)
    if (params.email && account.email !== params.email && await db.Account.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = account.encryptPassword(params.password);
    }

    // copy params to account and save
    Object.assign(account, params);
    account.updated = Date.now();
    await account.save();

    return basicDetails(account);
}

async function getById(id) {
    const account = await getAccount(id);
    return basicDetails(account);
}


// helpers

async function getAccount(id) {
    if (!db.isValidId(id)) throw 'Account not found';
    const account = await db.Account.findById(id);
    if (!account) throw 'Account not found';
    return account;
}

function basicDetails(account) {
    const { id, name, lastName, email, role, createdAt, updatedAt, isVerified, phone, state, company } = account;
    return { id, name, lastName, email, role, createdAt, updatedAt, isVerified, phone, state, company };
}