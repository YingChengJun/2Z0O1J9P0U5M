let mysql = require('mysql2/promise');

module.exports = (function() {
	var pool = mysql.createPool({
		host: '47.101.41.23',
		user: 'ycj',
		password: 'ycj',
		database: 'opmsystem',
		port: '3306',
		charset: 'utf8mb4'
	});
	pool.on('connection', function(connection) {
		connection.query('SET SESSION auto_increment_increment=1');
	});
	return pool;
})();