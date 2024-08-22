const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const User = require('../models/User');

// Add comment to blog
router.post('/add/:blogId', async (req, res) => {
    try {
        const { content } = req.body;
        const blog = await Blog.findById(req.params.blogId);
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        const newComment = new Comment({ content, blogId: req.params.blogId, user: user._id });
        await newComment.save();
        res.redirect(`/blogs/${req.params.blogId}`);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Reply to comment
router.post('/reply/:commentId', async (req, res) => {
    try {
        const { content } = req.body;
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        const comment = await Comment.findById(req.params.commentId);
        comment.replies.push({ content, user: user._id });
        await comment.save();
        res.redirect(`/blogs/${comment.blogId}`);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
