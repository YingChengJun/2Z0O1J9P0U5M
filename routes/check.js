var express = require('express');
var router = express.Router();
let index = require('../models/checkModels.js');

router.get('/', (req, res) => {
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	index.show_info(req, res, (err, ret) => {
		if (err) {
			// res.render('check',{
			// 	details:err
			// });
			res.send("<script>alert('获取订单信息失败!');</script>").end();
		} else {
			res.render('check', {
				details: ret,
				typeOfUser: req.session.token.typeOfUser
			});
		}
	});	
});

module.exports = router;
