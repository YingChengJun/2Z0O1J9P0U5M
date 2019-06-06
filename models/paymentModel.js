const pool = require('./conn_pool');
let exported = {};

exported.select_orders = async (req, res, callback) => {
	try {
		const conn = await pool.getConnection();
		let param = [];
		let selector = req.query.selector; //GET方式获取参数
		let buyer_id = req.session.token.uid;  //之后可能会修改
		let sql = "select order_id, S.username as seller_name, seller_id, buyer_id, goods_name, price, \
				current_status, created_time from order_form, user as S, user as T \
				where S.id = order_form.seller_id and T.id = order_form.buyer_id and buyer_id = ? ";
		console.log("selector = " + selector);
		if (selector >= 0 && selector <= 5) {
			sql = sql + "and current_status = ?; ";
			param = [buyer_id, selector];
		} else {
			sql = sql + ";";
			param = [buyer_id];
		}
		let ret = await conn.query(sql, param); 
		callback(undefined, ret[0]);
		conn.release();
	} catch (err) {
		callback(err, undefined);
	}
}

//随机生成订单数据插入数据库中
exported.test = async (req, res, callback) => {
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
		callback(err, undefined);
	}
}
//exported.test();

module.exports = exported;