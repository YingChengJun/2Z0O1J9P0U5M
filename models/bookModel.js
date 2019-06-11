const pool = require('./conn_pool');
const utils = require('./utils');
const randomName = require("chinese-random-name");
const encrypt = require('../models/encrypt.js');
const middle_id = "10086";  //交易中间账户
let exported = {};


//检查登录状态
/*
exported.check_login = async (req, callback) =>{
	try {
		const conn = await pool.getConnection();
		let sql = "select * from admin where admin_id = ? and password = ?";
		let param = [req.body.username, req.body.password];
		let ret = await conn.query(sql, param); 
		callback(undefined, ret[0]);
		conn.release();
	} 
	catch (err) {
		callback(err, undefined);
	}
}
 */



//买家订单查询
exported.select_orders = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let selector = req.query.selector; //GET方式获取参数
		let timer = req.query.timerange;  //GET方式获取参数
		let buyer_id = req.session.token.uid;  //之后可能会修改
		let sql = "select order_id, S.username as seller_name, seller_id, buyer_id, goods_name, price, current_status,\
				created_time, refund_reason, refund_time, refund_status, complain, complain_time from order_form, user as S,\
				user as T where S.id = order_form.seller_id and T.id = order_form.buyer_id and buyer_id = ? ";
		switch (timer) {
			case '1': sql = sql + "and DATEDIFF(created_time,NOW())=0 "; break;
			case '2': sql = sql + "and DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(created_time) "; break;
			case '3': sql = sql + "and DATE_FORMAT(created_time, '%Y%m') = DATE_FORMAT(CURDATE(),'%Y%m') "; break;
			case '4': sql = sql + "and DATE_SUB(CURDATE(), INTERVAL 3 MONTH) <= date(created_time) "; break;
			case '5': sql = sql + "and YEAR(created_time)=YEAR(NOW()) "; break;
			case '6': sql = sql + "and YEAR(created_time)<>YEAR(NOW()) "; break;
			default: break;
		}
		if (selector >= 0 && selector <= 5) {
			sql = sql + "and current_status = ? order by created_time desc; ";
			param = [buyer_id, selector];
		} else {
			sql = sql + "order by created_time desc;";
			param = [buyer_id];
		}
		let ret = await conn.query(sql, param); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}



//------------------------------
//下面这句话也一定要加，血的教训
//------------------------------
module.exports = exported;