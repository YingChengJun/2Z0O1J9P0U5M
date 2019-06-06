let express = require('express');
let router = express.Router();
let pmodel = require('../models/paymentModel.js');
let utils = require('../models/utils.js');
let app = express();

router.get('/', (req, res) => {
	//code for check session will be put here

	//---------------------------
	//for developer to test
	req.session.token = {
		username: 'zjuycj',
		uid: '1'
	};
	//--------------------------
	pmodel.select_orders(req, res, (err, result) => {
		if (err) {
			console.log(err);
			res.send("<script>alert('加载失败!');</script>").end();
			//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
		} else {
			console.log(result);
			//if (result.length)
			res.render('transaction', {
				username: req.session.token.username,
				details: result,
				length: result.length == null ? 0 : result.length,
				selector: (req.query.selector >= 0 && req.query.selector <= 5) ? req.query.selector : 6
			});
		}
	});
});

module.exports = router;
