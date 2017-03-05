var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var homepage = require('./homepage');

// Copied from PassportJS documentation ========================================
// http://passportjs.org/docs
// {
passport.use(new LocalStrategy(
	(username, password, done) => {

		User.getUserByUsername(username, (err, user) => {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}
			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.getUserById(id, (err, user) => {
		done(err, user);
	});
});
// }

//register
router.get('/register', (req, res, next) => {
	res.render('register');
});

router.post('/register', function (req, res) {
	req.checkBody('email', 'Email required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password required').notEmpty();
	req.checkBody('password2', 'Password required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	var email = req.body.email;
	var password = req.body.password;
	var username = req.body.username;
	var birthdate = req.body.birthdate;
	var gender = req.body.gender;
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;


	if (errors) {
		req.flash('error', errors[0].msg)
		res.redirect('/users/register');
		console.log(errors);
	} else {
		var newUser = new User({
			first_name: first_name,
			last_name: last_name,
			email: email,
			password: password,
			username: username,
			birthdate: birthdate,
			gender: gender
		});

		console.log('FORM SUBMITTED');
		console.log(email);

		User.createUser(newUser, function (err, user) {
			if (err) {
				console.log(err)
				req.flash('error', 'The Email or Username has already been used');
				res.redirect('/users/register');
				console.log('Duplicate Username or email')
			}
			else {
				req.flash('success_msg', 'you are registered and can now log in');
				res.redirect('/users/login');
				console.log('FORM SUBMITTED');
				console.log(email);
				console.log(user);
			}
		});

		req.flash('success_msg', 'you are registered and can now log in');

		res.redirect('/users/login');

	}


});

//login
router.get('/login', (req, res, next) => {
	res.render('login');
});

router.post('/login',
	passport.authenticate('local', {/* successRedirect:'/',*/ failureRedirect: '/users/login', failureFlash: true }),
	(req, res) => {
		req.flash('success_msg', 'You have been successfuly logged in')
		res.redirect('/');
	});

//profile
router.get('/profile', (req, res, next) => {
	res.send('Demo profile');
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You have been successfuly logged out');
	res.redirect('/users/login');
});

module.exports = router;