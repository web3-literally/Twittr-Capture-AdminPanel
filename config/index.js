let config = {
    mode: 'local',
    port: 7770,
    cron_port: 7771,
    base_url: 'http://52.197.23.134:7770',
    mongo: {
        host: '127.0.0.1',
        port: 27017,
        db_name:'twitter_capture'
    },
    redis: {
        host: '127.0.0.1',
        port: 6379
    },
    dev_info: {
        name: 'Technical Manager',
        email: 'dev@dev.com',
        password: 'dev'
    },
    admin_info: {
        name: 'Administrator',
        email: 'admin@admin.com',
        password: 'admin'
    },
    mail_info: {
        host: 'smtp.gmail.com',
        user: '',
        password: '',
    },
    sms_info: {
        username: '',
        password: '',
        access_token: ''
    },
};

module.exports = function() {
    return config;
};
