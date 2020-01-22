let express = require('express');
let router = express.Router();

let MiddlewareController = require('../controllers/MiddlewareController');
let AdminController = require('../controllers/AdminController');


router.get('/account-settings', MiddlewareController.m_checkLogin, function (req, res, next) {
    AdminController.account_settings(req, res, next);
});
router.post('/account-settings/edit-profile', MiddlewareController.m_checkLoginPost, function (req, res, next) {
    AdminController.editProfile(req, res, next);
});
router.post('/account-settings/change-avatar', MiddlewareController.m_checkLoginPost, function (req, res, next) {
    AdminController.changeAvatar(req, res, next);
});

router.get('/dashboard', MiddlewareController.m_checkLogin, MiddlewareController.m_checkAdmin, function (req, res, next) {
    AdminController.dashboard(req, res, next);
});
router.get('/', MiddlewareController.m_checkLogin, MiddlewareController.m_checkAdmin, function (req, res, next) {
    AdminController.dashboard(req, res, next);
});
router.get('/auto-capture', MiddlewareController.m_checkLogin, MiddlewareController.m_checkAdmin, function (req, res, next) {
    AdminController.autoCapture(req, res, next);
});



router.post('/start_twitter_capture', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.startTwitterCapture(req, res, next);
});
router.post('/delete_twitter_capture', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.deleteTwitterCapture(req, res, next);
});
router.post('/add_auto_capture_user', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.addAutoCaptureUser(req, res, next);
});
router.post('/delete_auto_capture_user', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.deleteAutoCaptureUser(req, res, next);
});
module.exports = router;
