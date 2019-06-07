let express = require('express');
let router = express.Router();
let pmodel = require('../models/paymentModel.js');
let utils = require('../models/utils.js');
let app = express();
const token = {
	username: 'zjuycj',
	uid: '1'
}

router.get('/', (req, res) => {
	//for developer to test
	req.session.token = token;
	//--------------------------
	//code for check session will be put here
	if (!req.session.token) {
		console.log("登录态过期，请重新登录！");
		return;
	}
	//---------------------------
	pmodel.select_orders(req, res, (err, result) => {
		if (err) {
			console.log(err);
			res.send("<script>alert('加载失败!');</script>").end();
			//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
		} else {
			req.session.details = result;
			res.render('transaction', {
				username: req.session.token.username,
				details: result,
				length: result.length == null ? 0 : result.length,
				selector: (req.query.selector >= 0 && req.query.selector <= 5) ? req.query.selector : 6
			});
		}
	});
});

router.post('/cancelOrder', (req, res) => {
	//for developer to test
	req.session.token = token;
	//--------------------------
	if (!req.session.token) {
		console.log("登录态过期，请重新登录！");
		return;
	}
	pmodel.cancel_orders(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('订单取消失败!');window.location.href='/payment/'</script>").end();
		} else {
			res.send("<script>alert('订单取消成功!');window.location.href='/payment/';</script>");
		}
	});
});

router.post('/cancelRefund', (req, res) => {
	//for developer to test
	req.session.token = token;
	//--------------------------
	if (!req.session.token) {
		console.log("登录态过期，请重新登录！");
		return;
	}
	pmodel.cancel_refund(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('订单取消失败!');window.location.href='/payment/'</script>").end();
		} else {
			res.send("<script>alert('订单取消成功!');window.location.href='/payment/';</script>");
		}
	});
});

module.exports = router;
