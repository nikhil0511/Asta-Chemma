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

router.get('/chat', function(req, res){
    console.log("Get for chat");
    res.sendFile(path.join(__dirname + './../public/chat.html'));
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
            } else { //send mail for successful signup
                var to = req.body.email;
                console.log(to);
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'astachemma06@gmail.com',
                        pass: 'ac123123'
                    }
                });
                var mailOptions = {
                    to: to,
                    from: 'astachemma06@gmail.com',
                    subject: 'Astachemma sign up Notification',
                    text: 'Thank you for registering for ASTA-CHEMMA Game\n'+
                    'Start playing the game by clicking on following link http://localhost:3000/game \n\n\n'+
                    'FROM \n' + 'ASTACHEMMA TEAM'
                };
                smtpTransport.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.sendFile(path.join(__dirname + './../public/index.html'));
                    }
                });
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

router.get('/profile/picture/:username', function(req,res,next) {
    User.findOne({username:req.params.username}).exec(function (err, user) {
console.log(user);
        if (err) return next(err);
        else {
            res.contentType('image/png'); //user.img.contentType
            res.send(user.img.data);
        }});
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

router.get('/game', function (req, res, next) {
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
                    res.sendFile(path.join(__dirname+'./../public/game.html'));
                }
            }
        });
});

router.get('/profile/gameplay/', function (req, res, next) {
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
                    res.send((user.game_played).toString());
                }
            }
        });
});

router.get('/profile/gamewin/', function (req, res, next) {
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
                    res.send((user.game_win).toString());
                }
            }
        });
});


// GET for logout logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        console.log('Session exist' +req.session);
        // delete session object
        req.session.destroy(function (err) {
                console.log('logout successful');
            res.redirect('/')

        });
    }
});
router.get('/user/gameplay', function (req, res) {
    var user1;
        User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return (error);
            } else {
                    user.game_played++;
                    user1 = user;
         User.update({_id: req.session.userId}, {$set: user1} ,
                    function (err, res) {
                        if (err) return console.log(err);
                        
                    });
                }

        });
   

});



module.exports = router;
