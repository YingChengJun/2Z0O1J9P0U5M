const pool = require('./conn_pool');
const utils = require('./utils');
const randomName = require("chinese-random-name");
const encrypt = require('../models/encrypt.js');
let exported = {};

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

//卖家订单查询
exported.select_seller_orders = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let selector = req.query.selector; //GET方式获取参数
		let timer = req.query.timerange;  //GET方式获取参数
		let seller_id = req.session.token.uid;  //之后可能会修改
		let sql = "select order_id, S.username as seller_name, seller_id, buyer_id, goods_name, price, current_status,\
				created_time, refund_reason, refund_time, refund_status, complain, complain_time from order_form, user as S,\
				user as T where S.id = order_form.seller_id and T.id = order_form.buyer_id and seller_id = ? ";
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
			param = [seller_id, selector];
		} else {
			sql = sql + "order by created_time desc;";
			param = [seller_id];
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

//订单详细信息
exported.order_info = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let buyer_id = req.session.token.uid;  //之后可能会修改
		let sql = "select order_id, S.username as seller_name, seller_id, buyer_id, goods_name, price, current_status,\
				created_time, refund_reason, refund_time, refund_status, complain, complain_time from order_form, user as S,\
				user as T where S.id = order_form.seller_id and T.id = order_form.buyer_id and buyer_id = ? and order_id = ?;";
		let ret = await conn.query(sql, [buyer_id, req.query.oid]); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//卖家订单信息
exported.seller_order_info = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let seller_id = req.session.token.uid;  //之后可能会修改
		let sql = "select order_id, S.username as seller_name, seller_id, buyer_id, goods_name, price, current_status,\
				created_time, refund_reason, refund_time, refund_status, complain, complain_time from order_form, user as S,\
				user as T where S.id = order_form.seller_id and T.id = order_form.buyer_id and seller_id = ? and order_id = ?;";
		let ret = await conn.query(sql, [seller_id, req.query.oid]); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//买家支付订单
exported.payfor_orders = async(req, res, callback) => {
	const conn = await pool.getConnection();
	//Step0: 交易安全认证
	

	//Step1: 转账到中间账户
	//Step2: 生成交易流水
	await conn.beginTransaction();  //事务
	try {


		await conn.commit();
	} catch (err) {
		await conn.rollback();  //数据库回滚
	} finally {
		if (conn) conn.release();
	}
	
}

//取消订单
exported.cancel_orders = async(req, res, callback) => {
	if (req.session.details[req.body.pos].current_status != 0) {
		callback("invalid position!", undefined);
		return;
	}
	const conn = await pool.getConnection();
	try {
		let order_id = req.session.details[req.body.pos].order_id;
		await conn.query("update order_form set current_status = 5 where order_id = ?", [order_id]);
		callback(undefined, "cancel_ok");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//申请退款
exported.apply_refund = async(req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		if (req.session.details[req.body.pos].current_status != 3) {
			callback("invalid position!", undefined);
			return;
		}
		let {order_id, buyer_id} = req.session.details[req.body.pos];
		let reason = req.body.refund_reason;
		//refund_status = 1 & current_status = 5: 退款正在受理中
		//refund_status = 2 & current_status = 5: 退款完成
		//refund_status = 3 : 退款被拒绝
		//每次申请退款时需要重置订单的状态以及退款的状态
		let sql = "update order_form set current_status = 4, refund_reason = ?, refund_status = 1 \
				where order_id = ? and buyer_id = ?";   //double check	
		await conn.query(sql, [reason, order_id, buyer_id]);
		callback(undefined, "apply_refund_ok");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//取消退款
exported.cancel_refund = async(req, res, callback) => {
	if (req.session.details[req.body.pos].current_status != 4 || req.session.details[req.body.pos].refund_status != 1) {
		callback("invalid position!", undefined);
		return;
	}
	const conn = await pool.getConnection();
	try {
		let {order_id, buyer_id} = req.session.details[req.body.pos];
		let sql = "update order_form set current_status = 3, refund_status = 0, refund_reason = NULL \
			where order_id = ? and buyer_id = ?";
		await conn.query(sql, [order_id, buyer_id]);
		callback(undefined, "cancel_ok");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//卖家确认退款,需要再修改
exported.confirm_refund = async(req, res, callback) => {
	let obj = req.session.details[req.body.pos];
	if ((obj.current_status != 4 && obj.current_status != 5) || obj.refund_status == 0) {
		callback("invalid position!", undefined);
		return;
	}
	const conn = await pool.getConnection();
	try {
		let {order_id, seller_id} = req.session.details[req.body.pos];
		let sql;
		if (req.body.check == 1) {
			sql = "update order_form set current_status = 5, refund_status = 2, refund_time = CURRENT_TIMESTAMP \
			where order_id = ? and seller_id = ?";
		} else if (req.body.check == 0) {
			sql = "update order_form set current_status = 3, refund_status = 3 where order_id = ? and seller_id = ?";
		} else {
			callback("invalid check status!", undefined);
			return;
		}
		await conn.query(sql, [order_id, seller_id]);
		callback(undefined, "confirm_ok");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//卖家确认发货


//投诉
exported.complain = async(req, res, callback) => {
	if (req.session.details[req.body.pos].current_status < 1 | req.session.details[req.body.pos].current_status > 5) {
		callback("invalid position!", undefined);
		return;
	}
	const conn = await pool.getConnection();
	try {
		let {order_id, buyer_id} = req.session.details[req.body.pos];
		let complain = req.body.complain;
		let sql = "update order_form set complain = ?, complain_time = CURRENT_TIMESTAMP where order_id = ? and buyer_id = ?"; //double check	
		await conn.query(sql, [complain, order_id, buyer_id]);
		callback(undefined, "complain_ok");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//撤销投诉
exported.cancel_complain = async(req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let {order_id, buyer_id} = req.session.details[req.body.pos];
		let sql = "update order_form set complain = null , complain_time = null where order_id = ? and buyer_id = ?"; //double check	
		await conn.query(sql, [complain, order_id, buyer_id]);
		callback(undefined, "complain_ok");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}



//随机生成订单数据插入数据库中
exported.generate_order = async () => {
	try {
		const conn = await pool.getConnection();
		let price = 200;
		let k;
		for (let i=0;i<30;i++) {
			if (i<7) k="0"+(3+i);
			else k=(3+i);
			let sql = "insert into order_form values(2019060680" + k + ",2,1,\"商务大床房7." + (i+1) + "~7." + (i+2) + "\",";
			sql = sql + (price+i) + ",\"\"," + (i%6) +",CURRENT_TIMESTAMP,null,null,0,null,null);";
			let ret = await conn.query(sql, []); 
		}
		conn.release();
	} catch (err) {
		console.log(err);
	}
}
//exported.generate_order();

//随机生成用户数据插入到数据库中。
exported.generate_buyer = async (num) => {
	try {
		const conn = await pool.getConnection();
		for (let i=0;i<num;i++) {  //生成10个买家
			let username = utils.randomString(6);
			let password = utils.randomString(3);
			let realName = randomName.generate();
			let payPassword = utils.randomString(5);
			let sql = "insert into user(username,password,realName,typeOfUser,balance,payPassword)\
					values(?,?,?,1,0,?)";
			await conn.query(sql, [username,password,realName,payPassword]);
		}
		conn.release();
	} catch (err) {
		console.log(err);
	}
}
//exported.generate_buyer(10);

module.exports = exported;