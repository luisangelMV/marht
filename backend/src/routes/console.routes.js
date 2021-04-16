const router = require('express').Router();
const authorize = require('../middleware/authorize.middleware');
const consoleService = require("../controllers/console.service");
const Role = require('../models/role')

// routes 
router.get('/:id', console);
router.post('/create-group', createGroup);
router.post('/add-device', addDevice);
router.post('/delete-device', deleteDevice);
router.get('/device/:id', getDevices);

module.exports = router;

function deleteDevice(req,res,next) {
    consoleService.deleteDevice(req.body)
    .then(()=> res.json({message: 'device deleted'}))
    .catch(next);
}
function console(req, res, next) {
    consoleService.getById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next)
}

function createGroup(req, res, next) {
    consoleService.createGroup(req.body)
        .then(() => res.json({ message: 'group created' }))
        .catch(next);
}

function addDevice(req, res, next) {
    consoleService.addDevice(req.body)
        .then(() => res.json({ message: 'device add' }))
        .catch(next);
}

function getDevices(req,res,next) {
    consoleService.getDevices(req.params.id)
    .then(devices => devices ? res.json(devices): res.sendStatus(404))
    .catch(next);
}