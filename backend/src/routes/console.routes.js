const router = require('express').Router();
const authorize = require('../middleware/authorize.middleware');
const consoleService = require("../controllers/console.service");
const Role = require('../models/role')

// routes 
router.get('/:id', getDevices);
router.get('/record/:id', getRecord);
// router.post('/create-group', createGroup);
router.post('/add-device', addDevice);
router.post('/delete-device', deleteDevice);
router.post('/update-device', updateDevice)

module.exports = router;

function getRecord(req,res,next) {
    consoleService.getRecord(req.params.id)
    .then(devices => devices ? res.json(devices): res.sendStatus(404))
    .catch(next);
}
function deleteDevice(req,res,next) {
    consoleService.deleteDevice(req.body)
    .then(()=> res.json({message: 'device deleted'}))
    .catch(next);
}

function updateDevice(req,res,next) { 
    consoleService.updateDevice(req.body)
    .then(() => res.json({message: 'device updated'}))
    .catch(next);
}
// function createGroup(req, res, next) {
//     consoleService.createGroup(req.body)
//         .then(() => res.json({ message: 'group created' }))
//         .catch(next);
// }

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