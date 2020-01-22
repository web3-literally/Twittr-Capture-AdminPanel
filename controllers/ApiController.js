let View = require('../views/base');
let path = require('path');
let request = require('request');
let fs = require('fs');
let crypto = require('crypto');
let ejs = require('ejs');
let config = require('../config/index')();
let config_limit = 500000;
let nodemailer = require('nodemailer');

let BaseController = require('./BaseController');
let LicenseModel = require('../models/admin_ms/LicenseModel');
let TwitterCaptureModel = require('../models/admin_ms/TwitterCaptureModel');

let ping_dump = {};
setInterval(async function () {
    let all_license = await LicenseModel.find({});
    for (let i = 0; i < all_license.length; i++) {
        let license = all_license[i];
        let key = license.key;
        if (!ping_dump[key]) {
            license.connection_status = "disconnected";
            await license.save();
        }
    }
    ping_dump = {};
}, 30000);
module.exports = BaseController.extend({
    name: 'ApiController',

    error: function (req, res, next) {
        let v = new View(res, 'partials/error');
        v.render({
            title: 'Twitter-Capture|Error',
            session: req.session,
            i18n: res,
        })
    },

    //////////////////////////////////////////// Twitter Capture ///////////////////////////////////////////////
    getTodoList: async function (req, res, next) {
        let todolist = [];
        let captures = await TwitterCaptureModel.find({});
        for (let i = -0; i < captures.length; i++) {
            if (!captures[i].pdf_name)
                todolist.push({
                    id:captures[i].id,
                    user_name:captures[i].user_name,
                    from_date:captures[i].from_date,
                    to_date:captures[i].to_date,
                });
        }
        return res.send(todolist);
    },
    captureDone: async function (req, res, next) {
        let id = req.query.id;
        let pdf_name = req.query.pdf_name;

        let capture = await TwitterCaptureModel.findOne({id: id});
        if (!capture)
            return res.send({status: 'success'});
        capture.pdf_name = pdf_name;
        await capture.save();
        return res.send({status: 'success'});
    },
    checkFinishedCapture: async function (req, res, next) {
        let list_pendding_ids = req.body.list_pendding_ids;
        if (!list_pendding_ids){
            return res.send({status: 'failed'});
        }
        let finshed_captures = {};
        for (let i = 0; i < list_pendding_ids.length; i++) {
            let id = list_pendding_ids[i];
            let capture = await TwitterCaptureModel.findOne({id: id});
            if (capture && capture.pdf_name)
                finshed_captures[id] = capture.pdf_name
        }
        return res.send({status: 'success', finshed_captures: finshed_captures});
    },
});
