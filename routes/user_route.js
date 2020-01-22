let express = require('express');
let router = express.Router();

let MiddlewareController = require('../controllers/MiddlewareController');
let AdminController = require('../controllers/AdminController');

/**
 * Multi-language Support
 * */
router.get('/lang/en', function (req, res) {
    res.cookie('i18n', 'EN');
    res.redirect(req.headers.referer)
});
router.get('/lang/pl', function (req, res) {
    res.cookie('i18n', 'PL');
    res.redirect(req.headers.referer)
});

router.get('/', MiddlewareController.m_checkLogin, function (req, res, next) {
        AdminController.dashboard(req, res, next);
});

module.exports = router;
