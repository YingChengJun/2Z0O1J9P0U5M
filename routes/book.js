let express = require('express');
let router = express.Router();
let lmodel = require('../models/loginModel')
let bmodel = require('../models/bookModel.js');
let utils = require('../models/utils.js'); //自定义工具库
let encrypt = require('../models/encrypt.js');  //base64加密核心库
let svgCaptcha = require('svg-captcha');  //动态验证码核心课
let app = express();
const MANAGER = 2;
const BUYER = 1;
const token = {
	username: '嘤菜鸡',
	uid: '1',
	typeOfUser: 1
}

//--------------------------------------------------------
//下面这两条路由后期肯定要改，只是自己组内测试用（徐文祥）
//--------------------------------------------------------
router.get('/', function(req, res, next) {
  res.render('./book/login');
});

router.post('/login',function(req, res) {
    lmodel.check_login(req, function (err, ret) {
        if (err) {
            console.log(err);
            res.send({ status: -1 }).end();   //服务器异常
        } else {
            console.log(ret);
            var token = {
                username: null,
                uid: null,
                typeOfUser:null
            };

            if (ret.length > 0) {
                token.username = ret[0].username;
                token.uid = ret[0].id;
                token.typeOfUser =ret[0].typeOfUser;
                req.session.token = token;
                console.log(req.session.token);
                res.send({ status: 1 }).end();   //验证成功
            } else {
                res.send({ status: 0 }).end();   //验证失败
            }
        }
    });
});

//-----------------------------------------------------

router.get('/bookhome', (req, res) => {
	//for developer to test
	req.session.token = token;
	//--------------------------
	//code for check session will be put here
	if (!req.session.token) 
	{
		console.log("登录态过期，请重新登录！");
		return;
	}
	//---------------------------
	if (req.session.token.typeOfUser == BUYER) 
	{  //普通用户页面
		res.render('./book/bookhome');
	}
});

router.get('/transaction',(req, res)=>{
	//for developer to test
	req.session.token = token;
	//--------------------------
	//code for check session will be put here
	if (!req.session.token) {
		console.log("登录态过期，请重新登录！");
		return;
	}
	//---------------------------
	if (req.session.token.typeOfUser == BUYER) {  //普通用户页面
		bmodel.select_orders(req, res, (err, result) => {//调用查询订单函数
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/transaction', {
					username: req.session.token.username,
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 5) ? req.query.selector : 6
				});
			}
		});		
	} 
});


//------------------------------
//下面这句话一定要加，血的教训
//------------------------------
module.exports = router;