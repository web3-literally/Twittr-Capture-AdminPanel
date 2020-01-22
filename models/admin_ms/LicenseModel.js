let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let LicenseSchema   = new Schema({
    id: String,
    user_name: String,
    key: String,
    expire_date: Date,
    connection_status: {
        type: String,
        default: "disconnected"
    }
});
// event
LicenseSchema.pre('save', function (next) {
    this.id = this._id.toString();
    next();
});
module.exports = mongoose.model('licenses', LicenseSchema);
