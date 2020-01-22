let View = require('../views/base');
let path = require('path');
let fs = require('fs');
let crypto = require('crypto');
let nodemailer = require('nodemailer');
let moment = require('moment');
let cron = require("node-cron");
let config = require('../config/index')();
let transporter = nodemailer.createTransport({
    host: config.mail_info.host,
    port: 587,
    secure: false,
    auth: {
        user: config.mail_info.user,
        pass: config.mail_info.password
    }
});
let ejs = require('ejs');
let speakeasy = require('speakeasy');

let BaseController = require('./BaseController');
let UserModel = require('../models/admin_ms/UserModel');
let TwitterCaptureModel = require('../models/admin_ms/TwitterCaptureModel');
let AutoCaptureUserModel = require('../models/admin_ms/AutoCaptureUserModel');

module.exports = BaseController.extend({
    name: 'UserController',

    account_settings: async function (req, res, next) {
        let user = await UserModel.findOne({id: req.session.user.id});
        let v = new View(res, 'settings/account_settings');
        v.render({
            title: 'Twitter-Capture|Profile',
            session: req.session,
            i18n: res,
            tab_text: 'settings',
            sub_text: 'settings_profile',
            user: user,
        })
    },
    editProfile: async function (req, res, next) {
        let username = req.body.username, email = req.body.email,
            old_password = req.body.old_password, new_password = req.body.new_password;
        let user = await UserModel.findOne({id: req.session.user.id});
        if (user.email !== email) return res.send({status: 'error', message: res.cookie().__('Undefined user')});
        if (!user.verifyPassword(old_password)) return res.send({status: 'error', message: res.cookie().__('Old password is not correct')});
        user.username = username;
        user.password = new_password;
        await user.save();
        req.session.user = user;
        return res.send({status: 'success', message: res.cookie().__('Updated user profile successfully')});
    },
    changeAvatar: async function (req, res, next) {
        let user = await UserModel.findOne({id: req.session.user.id});
        let avatarPath = user.avatar;
        if (req.body.avatarImg.length > 1000) {
            let avatarData = req.body.avatarImg.replace(/^data:image\/\w+;base64,/, "");
            let file_extension = '.png';
            if (avatarData.charAt(0) === '/') file_extension = '.jpg';
            else if (avatarData.charAt(0) === 'R') file_extension = '.gif';
            let public_path = path.resolve('public');
            avatarPath = '/avatars/avatar_' + user.id + file_extension;
            let avatarUploadPath = path.resolve('public') + avatarPath;
            fs.writeFileSync(avatarUploadPath, avatarData, 'base64');
        }
        await user.updateOne({avatar: avatarPath});
        req.session.user.avatar = avatarPath;
        return res.send({status: 'success', message: res.cookie().__('Changed avatar successfully'), avatarPath: avatarPath});
    },
    error: function (req, res, next) {
        let v = new View(res, 'partials/error');
        v.render({
            title: 'Twitter-Capture|Error',
            session: req.session,
            i18n: res,
        })
    },

    dashboard: async function (req, res, next) {
        let user = req.session.user;
        let twitter_captures = await TwitterCaptureModel.find({});
        let v = new View(res, 'admin_vs/twitter_capture');
        v.render({
            title: 'Twitter-Capture|TwitterCapture',
            session: req.session,
            i18n: res,
            tab_text: 'twitter_capture',
            sub_text: '',
            user: user,
            twitter_captures: twitter_captures
        })
    },
    autoCapture: async function (req, res, next) {
        let user = req.session.user;
        let auto_users = await AutoCaptureUserModel.find({});
        let v = new View(res, 'admin_vs/auto_capture');
        v.render({
            title: 'Twitter-Capture|AutoCaptureUser',
            session: req.session,
            i18n: res,
            tab_text: 'auto_capture',
            sub_text: '',
            user: user,
            auto_users: auto_users
        })
    },
    startTwitterCapture: async function (req, res, next) {
        let user_name = req.body.user_name;
        let from_date = req.body.from_date;
        let to_date = req.body.to_date;
        let new_capture = new TwitterCaptureModel({
            capture_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            user_name: user_name,
            from_date: from_date,
            to_date: to_date,
        });
        await new_capture.save();
        return res.send({status: 'success', new_capture: new_capture, message: res.cookie().__('Started Capture Successfully! Please wait until finish!')});
    },
    deleteTwitterCapture: async function (req, res, next) {
        let id = req.body.id;
        await TwitterCaptureModel.deleteMany({id: id});
        return res.send({status: 'success', message: res.cookie().__('Deleted Capture data successfully!')});
    },
    addAutoCaptureUser: async function (req, res, next) {
        let user_name = req.body.user_name;
        let new_user = new AutoCaptureUserModel({
            user_name: user_name,
        });
        await new_user.save();
        return res.send({status: 'success', new_user: new_user, message: res.cookie().__('Created New User Successfully!')});
    },
    deleteAutoCaptureUser: async function (req, res, next) {
        let id = req.body.id;
        await AutoCaptureUserModel.deleteMany({id: id});
        return res.send({status: 'success', message: res.cookie().__('Deleted User data successfully!')});
    },
});

cron.schedule("00 05 * * *", async function () {
    console.log("*** Start Cron Job! ***")
    let auto_users = await AutoCaptureUserModel.find({});
    for (let i=0;i<auto_users.length;i++){
        let user_name = auto_users[i].user_name;
        let from_date = new Date();
        let to_date = new Date();
        from_date.setDate(from_date.getDate() - 1);
        let new_capture = new TwitterCaptureModel({
            capture_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            user_name: user_name,
            from_date: moment(from_date).format('YYYY-MM-DD'),
            to_date: moment(to_date).format('YYYY-MM-DD'),
            auto_mode: true
        });
        await new_capture.save();
    }
});
