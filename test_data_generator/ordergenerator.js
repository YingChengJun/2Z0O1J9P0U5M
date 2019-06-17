const pool = require('../models/conn_pool');
const utils = require('../models/utils');
const randomName = require("chinese-random-name");

//随机生成用户数据插入到数据库中。
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