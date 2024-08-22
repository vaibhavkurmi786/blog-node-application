const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    replies: [{ content: String, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }]
});
module.exports = mongoose.model('Comment', CommentSchema);
