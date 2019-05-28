var express = require('express');
var router = express.Router();
var ex = require('../models/exampleModel.js');

/* GET home page. */
router.get('/', (req, res) => {
    console.log("用户名:" + req.query.user);
    console.log("用户是嘤菜鸡吗:" + ex.check(req.query.user));
    if (req.query.user) {
        res.render('example', {username: req.query.user});
    } else {
        res.render('example', {username: "嘤菜鸡"});
    }
});

/*使用回调函数异步执行*/
router.get('/login', (req, res) => {
    ex.login(req,(err,ret)=>{
    	if (err) {
    		console.log(err);
    	} else {
    		console.log(ret);
    	}
    });
});

module.exports = router;
