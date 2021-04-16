const router = require('express').Router();
const Joi = require('joi');
const adminService = require('../controllers/admin.service');
const deviceService = require('../controllers/device.service')
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize.middleware');
const Role = require('../models/role')

//routes

router.get('/accounts', authorize(Role.Admin), getAll);
router.post('/accounts', authorize(Role.Admin), createSchema, create)
router.put('/accounts/:id', authorize(), updateSchema, update);
router.get('/accounts/:id', authorize(), getById);
router.delete('/accounts/:id', authorize(Role.Admin), _delete);
router.post('/create', createDevice);

module.exports = router;

function createDevice(req,res,next) {  
    deviceService.createDevice(req.body, req.ip)
    .then((device) => {
        res.json(device);
    })
    .catch(next);
}

function getAll(req, res, next) {
    adminService.getAll()
        .then(accounts => res.json(accounts))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        company: Joi.string().required(),
        state: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        role: Joi.string().valid(Role.Admin, Role.User).required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        company: Joi.string().required(),
        state: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    }

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // users can update their own account and admins can update any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    adminService.update(req.params.id, req.body)
        .then(account => res.json(account))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own account and admins can delete any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    adminService.delete(req.params.id)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}

function create(req, res, next) {
    adminService.create(req.body)
        .then(account => res.json(account))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own account and admins can get any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    adminService.getById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}