var express = require('express');
var router = express.Router();
var User = require('../models/user');
var fs = require('fs');
var path = require('path');
var templatesjs = require('templatesjs');

// GET route for reading data
router.get('/', function (req, res, next) {
    return res.sendFile(path.join(__dirname + '/public/index.html'));
});

var userNumber = Math.floor(Math.random() * 4) + 1;
var imgPath = 'public/images/user'+userNumber+'.png';

var userImage = fs.readFileSync(imgPath);
var imageType = 'image/png';

//POST route for updating data
router.post('/', function (req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
            img:{data: fs.readFileSync(imgPath), contentType: 'image/png'}

        }
        //userData.img.data=fs.readFileSync(imgPath);
        //userData.img.contentType='image/png';


        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });

    } else if (req.body.logemail && req.body.logpassword) {
        console.log(req.body.logemail + req.body.logpassword);
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.' +error + user);
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})

router.get('/profile/alluser', function (req, res, next) {
    User.find()
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    res.send(user);
                }
            }
        });
});


router.get('/profile/picture', function(req,res,next) {
    User.findById( req.session.userId).exec(function(err,user) {
        if (err) return next(err);
        else {
            res.contentType('image/png'); //user.img.contentType
            res.send(user.img.data);
        }});
});

// GET route after registering
router.get('/profile/username/', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    res.send(user.username);
                }
            }
        });
});

router.get('/profile/email', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    res.send(user.email);
                }
            }
        });
});

router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    res.sendFile(path.join(__dirname+'./../public/profile.html'));
                }
            }
        });
});

// GET for logout logout
router.post('/logout', function (req, res, next) {
    if (req.session) {
        console.log('Session exist' +req.session);
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.sendFile(path.join(__dirname + '/public/index.html'));
            }
        });
    }
});

module.exports = router;
