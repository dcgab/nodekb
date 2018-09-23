const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

// Article model
let Article = require('../models/article');
// User model
let User = require('../models/user');

// Add route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add_article', {
    title: 'Add article'
  });
});

// Add submit POST route
router.post('/add', ensureAuthenticated,
  [
    check('title').trim().isLength({min:1}).withMessage('Title required'),
    check('body').trim().isLength({min:1}).withMessage('Body required')
  ],
  (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    res.render('add_article', {
      title: 'Add Article',
      errors: errors.mapped()
    });
  } else {
    let article = new Article({
      title: req.body.title,
      author: req.user.id,
      body: req.body.body
    });
    article.save(err => {
      if(err) {
        console.log(err);
      } else {
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });
  }
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if(err) throw err;
    if(article.author !== req.user.id) {
      req.flash('danger', 'Not authorized');
      return res.redirect('/');
    }
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    })
  });
});

// Update submit POST route
router.post('/edit/:id', ensureAuthenticated, (req, res) => {
  let article = {
    title: req.body.title,
    author: req.user.id,
    body: req.body.body
  };

  let query = {_id:req.params.id};
  
  Article.update(query, article, err => {
    if(err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

router.delete('/:id', (req, res) => {
  if(!req.user._id) {
    res.status(401).end();
  }

  let query = {_id: req.params.id};

  Article.findById(req.params.id, (err, article) => {
    if(err) throw err;
    if(article.author !== req.user.id) {
      res.status(401).end();
    } else {
      Article.deleteOne(query, err => {
        if(err) {
          console.log(err);
        } else {
          res.send('Success');
        }
      });
    }
  });
});

// Get single article
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if(err) throw err;
    User.findById(article.author, (err, user) => {
      if(err) throw err;
      res.render('article', {
        article: article,
        author: user.name
      });
    });
  });
});

// Access control
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;