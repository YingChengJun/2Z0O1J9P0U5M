let express = require('express');
let router = express.Router();
//let lmodel = require('../models/loginModel')
let bmodel = require('../models/bookModel.js');
let utils = require('../models/utils.js'); //自定义工具库
let encrypt = require('../models/encrypt.js');  //base64加密核心库
let svgCaptcha = require('svg-captcha');  //动态验证码核心课
let app = express();
const SELLER = 2;
const BUYER = 1;
const MANAGER = 3;
/*
const token = {
	username: '嘤菜鸡',
	uid: '1',
	typeOfUser: 1
}*/

//--------------------------------------------------------
//下面这两条路由后期肯定要改，只是自己组内测试用（徐文祥）
//--------------------------------------------------------
router.get('/', function(req, res, next) {
  res.render('./book/bookhome',{type:1});
});

/*router.post('/login',function(req, res) {
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
                res.send({ status: 1,type: token.typeOfUser}).end();   //验证成功
            } else {
                res.send({ status: 0 }).end();   //验证失败
            }
        }
    });
});
*/
//-----------------------------------------------------

router.get('/bookhome', (req, res) => {
	//for developer to test
	if (!req.session.token) {
        res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
        return;
    }
	//--------------------------
	//code for check session will be put here
	//---------------------------
	if (req.session.token.typeOfUser == BUYER) 
	{  //普通用户页面，管理员的需要整合的自己写一下else路由
		res.render('./book/bookhome',{ type: req.session.token.typeOfUser});
	}
	else if(req.session.token.typeOfUser == MANAGER)
	{
		res.render('./book/bookhome',{ type: req.session.token.typeOfUser});
	}
});

/*router.get('/transaction',(req, res)=>{//历史订单部分
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
*/

router.get('/hotel_hotelsearch', (req, res) => {
	
    if (!req.session.token) {
        res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
        return;
    }
    
    if (req.session.token.typeOfUser == BUYER){
    	res.render('./book/hotel/hotelsearch',{type:req.session.token.typeOfUser});
    }
    else if(req.session.token.typeOfUser == MANAGER){
    	 bmodel.hotel_order_info_manager(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/hotel/hotelinfomanager', {
					username: req.query.user,
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 3) ? req.query.selector : 4,
					type: req.session.token.typeOfUser
				});
			}
		});

    }
});

router.get('/hotel_orderInfo', (req, res) => {
	
    if (!req.session.token) {
        res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
        return;
    }

	if (req.session.token.typeOfUser == BUYER) {  //买家页面
		bmodel.hotel_order_info(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
                console.log(req.query.pos);
				res.render('./book/hotel/hotelinfo', {
					hotel: req.query.pos,
					//username: req.session.token.username,
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 3) ? req.query.selector : 4,
                    type: req.session.token.typeOfUser
				});
			}
		});		
	} else if (req.session.token.typeOfUser == MANAGER) {  //卖家页面
		bmodel.hotel_order_info_manager(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/hotel/hotelinfomanager', {
					
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 3) ? req.query.selector : 4
				});
			}
		});	
	} else res.send("<script>alert('加载失败!');</script>").end();
});

router.post('/hotel_cancelOrder', (req, res) => {
	
	bmodel.hotel_cancel_orders(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('删除失败!'); self.location = document.referrer;</script>").end();
		} else {
			res.send("<script>alert('删除成功!'); self.location = document.referrer;</script>");
		}
	});
});


router.get('/hotel_modifyInfo', (req, res) => {
	
	bmodel.hotel_Info_modify(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('年轻人你的思想很危险!');</script>").end();
		} else {
			res.render('./book/hotel/hotelinfomodify', {
				details: ret[0] == null ? null : ret[0],
				detail_name: ret[0].hotelName,
				detail_price:ret[0].hotelPrice,
			});
		}
	});
	
});

router.get('/hotel_modifyingInfo', (req, res) => {
	
	bmodel.hotel_Info_modifying(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('修改失败!'); self.location = document.referrer;</script>").end();
		} else {
			bmodel.hotel_modify_info_manager(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/hotel/hotelinfomanager', {
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 3) ? req.query.selector : 4,
					
				});
			}
		});	
		}
	});
});

router.get('/hotel_New', (req, res) => {
	
	res.render('./book/hotel/infoNew');
	
});

router.get('/hotel_infoNew', (req, res) => {
	
	bmodel.hotel_Info_new(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('修改失败!'); self.location = document.referrer;</script>").end();
		} else {
			res.send("<script>alert('新建成功!'); self.location = document.referrer;</script>").end();
		}
	});
});

router.get('/flight_search', (req, res) => {
	
    if (!req.session.token) {
        res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
        return;
    }
    
    if (req.session.token.typeOfUser == BUYER){
    	res.render('./book/flight/flightsearch',{type: req.session.token.typeOfUser});
    }
    else if(req.session.token.typeOfUser == MANAGER){
    	 bmodel.flight_order_info_manager(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/flight/flightinfomanager', {
					//username: req.query.user,
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 2) ? req.query.selector : 4,
					type: req.session.token.typeOfUser
				});
			}
		});

    }
});

router.get('/flight_orderInfo', (req, res) => {
	
    if (!req.session.token) {
        res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
        return;
    }
    
    
	if (req.session.token.typeOfUser == BUYER) {  //买家页面
		bmodel.flight_order_info(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/flight/flightinfo', {
					flight: req.query.pos,//起飞地
					flight1:req.query.pos1,//将落地
					flight2:req.query.pos2,//飞行日期
					//username: req.session.token.username,
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 2) ? req.query.selector : 4
				});
			}
		});		
	} else if (req.session.token.typeOfUser == MANAGER) {  //卖家页面
		bmodel.flight_order_info_manager(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/flight/flightinfomanager', {
					//username: req.session.token.username,
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 2) ? req.query.selector : 4
				});
			}
		});	
	} else res.send("<script>alert('加载失败!');</script>").end();
});

router.post('/flight_cancelOrder', (req, res) => {
	
	bmodel.flight_cancel_orders(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('删除失败!'); self.location = document.referrer;</script>").end();
		} else {
			res.send("<script>alert('删除成功!'); self.location = document.referrer;</script>").end();
		}
	});
});


router.get('/flight_modifyInfo', (req, res) => {
	
	bmodel.flight_Info_modify(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('年轻人你的思想很危险!');</script>").end();
		} else {
			res.render('./book/flight/flightinfomodify', {

				details: ret[0] == null ? null : ret[0],
				detail_name: ret[0].flightName,
				detail_price:ret[0].flightPrice

			});
		}
	});
	
});

router.get('/flight_modifyingInfo', (req, res) => {
	
	bmodel.flight_Info_modifying(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('修改失败!'); self.location = document.referrer;</script>").end();
		} else {
			bmodel.flight_modify_info_manager(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/flight/flightinfomanager', {
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 2) ? req.query.selector : 4
				});
			}
		});	
		}
	});
});

router.get('/flight_New', (req, res) => {
	
	res.render('./book/flight/infoNew');
	
});

router.get('/flight_infoNew', (req, res) => {
	
	bmodel.flight_Info_new(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('修改失败!'); self.location = document.referrer;</script>").end();
		} else {
			
            res.send("<script>alert('新建成功!'); self.location = document.referrer;</script>").end();
		}
	});
});

router.get('/roombooking', (req,res)=> {
	
    	bmodel.bookRoom(req,res, (err, result) => {
    		if (err) {
				console.log(err);
				res.send("<script>alert('预订失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				//res.send("<script>alert('预订成功!');</script>").end();
					bmodel.hotel_show_info(req,res, (err, result) => {
	    		if (err) {
					console.log(err);
					res.send("<script>alert('加载失败!');</script>").end();
					//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
				} else {
					req.session.details = result;
					res.render('./book/hotel/main_hotel1', {
						//username: req.query.user,
						details: result,
						name:req.query.Name
					});
				}
	    	})
			}
    	})
    	
    
    
})


router.get('/hotel_message', (req, res) => {
	
	bmodel.hotel_comments(req, res, (err, result) => {
		if (err) {
			res.send("<script>alert('评论失败!'); self.location = document.referrer;</script>").end();
		} else {
			bmodel.hotel_show_com(req,res, (err, result) => {
    		if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/hotel/hotelcomment', {
					//username: req.query.user,
					details: result,
					length: result.length == null ? 0 : result.length,
					name:req.query.hotelName,
					price:req.query.hotelPrice
				});
				//res.send("<script>alert('评论成功!'); self.location = document.referrer;</script>").end();
			}
    	})
			}
	});
})


router.get('/hotel_comment', (req, res) => {
	
        	bmodel.hotel_show_com(req,res, (err, result) => {
    		if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/hotel/hotelcomment', {
					//username: req.query.user,
					details: result,
					length: result.length == null ? 0 : result.length,
					name:req.query.hotelName,
					price:req.query.hotelPrice
				});
			}
    	})
    	      
});

router.get('/main_hotel1', (req,res) => {

    	bmodel.hotel_show_info(req,res, (err, result) => {
    		if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/hotel/main_hotel1', {
					//username: req.query.user,
					details: result,
                    name: req.query.pos
				});
			}
    	})
});

router.get('/hotel_booking', (req,res) => {
	res.render('./book/hotel/booking',{
		name:req.query.hotelName,
		price:req.query.hotelPrice,
		pos:req.query.pos

	});
});


let valid_check = (str) => {
	if (!str) return null;
	let checkregex = /^\d+$/;
	let deCode = encrypt.base64decode(str).replace(/^YCJ20190608/,"");
	//console.log("DEBUG1:", deCode);
	if (isNaN(deCode) || !checkregex.test(deCode)) return null;
	return deCode;
}

router.get('/main_flight1', (req,res) => {

    	bmodel.flight_show_info(req,res, (err, result) => {
    		if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/flight/main_flight1', {
					//username: req.query.user,
					details: result,
					flight:req.query.flight,
					flight1:req.query.flight1,
					flight2:req.query.flight2
				});
			}
    	})
});

router.get('/flight_comment', (req, res) => {
	
        	bmodel.flight_show_com(req,res, (err, result) => {
    		if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/flight/flightcomment', {
					//username: req.query.user,
					details: result,
					length: result.length == null ? 0 : result.length,
					name:req.query.flightName,
					flight:req.query.flight,
					flight1:req.query.flight1,
					flight2:req.query.flight2
				});
			}
    	})
    	      
});

router.get('/flight_message', (req, res) => {
	
	bmodel.flight_comments(req, res, (err, result) => {
		if (err) {
			res.send("<script>alert('评论失败!'); self.location = document.referrer;</script>").end();
		} else {
			bmodel.flight_show_com(req,res, (err, result) => {
    		if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./book/flight/flightcomment', {
					//username: req.query.user,
					details: result,
					length: result.length == null ? 0 : result.length,
					name:req.query.flightName,
					flight:req.query.flight,
					flight1:req.query.flight1,
					flight2:req.query.flight
				});
				//res.send("<script>alert('评论成功!'); self.location = document.referrer;</script>").end();
			}
    	})
			}
	});
})

router.get('/flight_book', (req,res) => {
	res.render('./book/flight/flight_book',{
		name:req.query.flightName,
		price:req.query.flightPrice,
		flight:req.query.flight,
		flight1:req.query.flight1,
		flight2:req.query.flight2
	});

});

router.get('/flight_booking', (req,res) => {
	bmodel.flight_booking(req, res, (err, result) => {
		if (err) {
				console.log(err);
				res.send("<script>alert('预定失败!');self.location = document.referrer;</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				bmodel.flight_show_info(req,res, (err, result) => {
	    		if (err) {
					console.log(err);
					res.send("<script>alert('加载失败!');</script>").end();
					//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
				} else {
					req.session.details = result;
					res.render('./book/flight/main_flight1', {
						//username: req.query.user,
						details: result,
						name:req.query.Name,
						flight:req.query.flight,
						flight1:req.query.flight1,
						flight2:req.query.flight2
					});
				}
	    	})
				};
			
	});

});



module.exports = router;

//------------------------------
//下面这句话一定要加，血的教训
//------------------------------
module.exports = router;