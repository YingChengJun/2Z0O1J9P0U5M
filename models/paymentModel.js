const pool = require('./conn_pool');
const utils = require('./utils');
const randomName = require("chinese-random-name");
let exported = {};

exported.select_orders = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let selector = req.query.selector; //GET方式获取参数
		let buyer_id = req.session.token.uid;  //之后可能会修改
		let sql = "select order_id, S.username as seller_name, seller_id, buyer_id, goods_name, price, \
				current_status, created_time from order_form, user as S, user as T \
				where S.id = order_form.seller_id and T.id = order_form.buyer_id and buyer_id = ? ";
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

exported.cancel_orders = async(req, res, callback) => {
	if (req.session.details[req.body.pos].current_status != 0) callback("invalid position!", undefined);
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

exported.cancel_refund = async(req, res, callback) => {
	if (req.session.details[req.body.pos].current_status != 4) callback("invalid position!", undefined);
	const conn = await pool.getConnection();
	try {
		let order_id = req.session.details[req.body.pos].order_id;
		await conn.query("update order_form set current_status = 3 where order_id = ?", [order_id]);
		callback(undefined, "cancel_ok");
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
			sql = sql + (price+i) + ",\"\"," + (i%6) +",CURRENT_TIMESTAMP,null);";
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