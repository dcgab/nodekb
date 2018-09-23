const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User model
let User = require('../models/user');

// Register form
router.get('/register', (req, res) => {
  res.render('register');
});

// Register process
router.post('/register', [
  check('name').trim().isLength({min:1}).withMessage('Name is required'),
  check('email').trim().isLength({min:1}).withMessage('Email is required'),
  check('email').trim().isEmail().withMessage('Email is not valid'),
  check('username').trim().isLength({min:1}).withMessage('Username is required'),
  check('password').trim().isLength({min:1}).withMessage('Password is required'),
  check('password2').trim().custom((value, {req}) => {
    return value === req.body.password
  }).withMessage('Passwords do not match')
], (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    res.render('register', {
      errors: errors.mapped()
    });
  } else {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      if(err) {
        console.log(err);
        return;
      } else {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if(err) {
            console.log(err);
            return
          } else {
            user.password = hash;
            user.save(err => {
              if(err) {
                console.log(err);
                return;
              } else {
                req.flash('success', 'You are now registered and can log in');
                res.redirect('/users/login');
              }
            });
          }
        });
      }
    });
  }
});

// Login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Login process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
    successFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

router.get('/edit/:id', (req, res) => {
  
});

// Update submit POST route
router.post('/edit/:id', (req, res) => {
  
});

router.delete('/:id', (req, res) => {
  
});

// Get single article
router.get('/:id', (req, res) => {
  
});

module.exports = router;