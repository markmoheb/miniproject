var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('../config/database');
 var uniqueValidator = require('mongoose-unique-validator');     

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: { unique: true }
	},
	password: {
		type: String
	},
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
	email: {
		type: String,		
		index: {unique:true}
	},
	birthdate: {
        type: Date
    },
    gender: {
		type: String
	},
    profile_photo: {
		type: Date
	},
});

UserSchema.plugin(uniqueValidator); 
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) => {
	User.findById(id, callback);
	console.log('looking for user by id '+id +' (•_•)');
}

module.exports.getUserByUsername = (username, callback) => {
	var query = {username: username};
	User.findOne(query, callback);

	console.log('looking for user by username '+username+' (•_•)');
}

module.exports.createUser = (newUser, callback) => {
	bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB. 
            newUser.password = hash;
            newUser.save(callback, (err)=>{
				if(err)  req.flash('error',err)
			});
     
        });
    });
    console.log('creating user: '+newUser.username+' ( •_•)');
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}