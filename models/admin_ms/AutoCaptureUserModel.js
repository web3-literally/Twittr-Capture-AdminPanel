let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let AutoCaptureUserSchema   = new Schema({
    id: String,
    user_name: String,
});
// event
AutoCaptureUserSchema.pre('save', function (next) {
    this.id = this._id.toString();
    next();
});
module.exports = mongoose.model('auto_capture_users', AutoCaptureUserSchema);
