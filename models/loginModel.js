const pool = require('./conn_pool');

module.exports = {

	check_login: async function(req, callback) {
		try {
			const conn = await pool.getConnection();
			let sql = "select * from admin where admin_id = ? and password = ?";
			let param = [req.body.username, req.body.password];
			let ret = await conn.query(sql, param); 
			callback(undefined, ret[0]);
			conn.release();
		} catch (err) {
			callback(err, undefined);
		}
	}

}

