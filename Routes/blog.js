const express = require('express');
const router = express.Router();
const Blog = require("../models/Blog");//+
const upload = require("../Utils/multer")
const Comment = require("../models/Comment")

// Serve add blog page
router.get('/add', (req, res) => {
    res.render('add-blog');
});

// Serve blog list page
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.render('blog-list', { blogs });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Serve specific blog
router.get('/:id', async (req, res) => {
    try {
        console.log("Fetching blog with ID:", req.params.id);
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            console.log("Blog not found:", req.params.id);
            return res.status(404).send('Blog not found');
        }
        console.log("Fetched blog:", blog);
        const comments = await Comment.find({ blogId: req.params.id }).populate('user');
        console.log("Fetched comments:", comments);
        res.render('blog-view', { blog, comments });
    } catch (error) {
        console.error("Error in GET /:id route:", error); // Detailed error log
        res.status(500).send('Server Error');
    }
});

// Add new blog
router.post('/add', async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(500).send('Error uploading image');
        } else {
            try {
                const { title, description } = req.body;
                const image = req.file ? req.file.path : '';
                const newBlog = new Blog({ title, description, image });
                await newBlog.save();
                res.redirect('/blogs');
            } catch (error) {
                res.status(500).send('Server Error');
            }
        }
    });
});

// Serve the edit blog page
router.get('/edit/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        res.render('edit-blog', { blog });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


// Edit blog
router.post('/edit/:id',upload, async (req, res) => {
    try {
        console.log("this is req body",req.body);
        
        const { title, description } = req.body;
        console.log("what are the title and description", title, description);
        
        const image = req.file ? req.file.path : '';
        await Blog.findByIdAndUpdate(req.params.id, { title, description, image });
        res.redirect('/blogs');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Delete blog
router.post('/delete/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/blogs');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;
