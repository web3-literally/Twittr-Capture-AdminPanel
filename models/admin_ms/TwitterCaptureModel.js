let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let TwitterCaptureSchema   = new Schema({
    id: String,
    capture_date: String,
    user_name: String,
    from_date: String,
    to_date: String,
    pdf_name: String,
    auto_mode: {
        type: Boolean,
        default: false
    }
});
// event
TwitterCaptureSchema.pre('save', function (next) {
    this.id = this._id.toString();
    next();
});
module.exports = mongoose.model('twitter_captures', TwitterCaptureSchema);
