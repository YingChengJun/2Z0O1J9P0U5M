const pool = require('../models/conn_pool');
const utils = require('../models/utils');
const randomName = require("chinese-random-name");
const MAX = 10000;
const MIN = 100;

//随机生成用户数据插入到数据库中。
let generate_buyer = async (num) => {
	try {
		const conn = await pool.getConnection();
		for (let i=0;i<num;i++) {  //生成10个买家
			let username = utils.randomString(6);
			let password = utils.randomString(3);
			let realName = randomName.generate();
			let payPassword = utils.randomString(5);
			let balance = parseInt(Math.random()*(MAX-MIN+1)+MIN,10);
			let sql = "insert into user(username,password,realName,typeOfUser,balance,payPassword)\
					values(?,?,?,1,?,?)";
			await conn.query(sql, [username,password,realName,balance,payPassword]);
		}
		conn.release();
		console.log("Query Ok!");
		return;
	} catch (err) {
		console.log(err);
	}
}
generate_buyer(30);