var express = require('express');
var router = express.Router();

/* GET users listing. */
/*router.get('/login', function(req, res, next) {
    res.send('users/login');
});*/

router.get('/login', function(req, res, next) {
    res.render('login_page', {});
});
router.get('/signup', function(req, res, next) {
    res.render('signup', {});
});
router.get('/index', function(req, res, next) {
    res.render('index', {});
});
module.exports = router;