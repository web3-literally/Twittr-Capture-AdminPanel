let express = require('express');
let router = express.Router();

let ApiController = require('../controllers/ApiController');

//////////////////////////////////////////// MT Bot License ///////////////////////////////////////////////
router.get('/check-verify', function (req, res, next) {
    ApiController.checkVerify(req, res, next);
});
router.get('/disconnect-license', function (req, res, next) {
    ApiController.disconnectLicense(req, res, next);
});
router.get('/ping-license', function (req, res, next) {
    ApiController.pingLicense(req, res, next);
});



//////////////////////////////////////////// Twitter Capture ///////////////////////////////////////////////
router.get('/get-todo-list', function (req, res, next) {
    ApiController.getTodoList(req, res, next);
});
router.get('/capture-done', function (req, res, next) {
    ApiController.captureDone(req, res, next);
});
router.post('/check_finished_capture', function (req, res, next) {
    ApiController.checkFinishedCapture(req, res, next);
});
module.exports = router;
