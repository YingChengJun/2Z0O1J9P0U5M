const pool = require('./conn_pool');
const utils = require('./utils');
const randomName = require("chinese-random-name");
const encrypt = require('../models/encrypt.js');
const middle_id = "10086";  //交易中间账户
let exported = {};

//买家订单查询,xwc
/*
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
}*/

exported.hotel_order_info = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let selector = req.query.selector; //GET方式获取参数
		let timer = req.query.timerange;  //GET方式获取参数
		//let buyer_id = req.session.token.uid;  //之后可能会修改
		const hotel=req.query.pos;
		console.log(hotel);
		let sql = "select hotelName,hotelLocation,hotelScore,hotelStar,min(hotelPrice) as hotelPrice from hotel_info\
				where hotelLocation like '%";
		sql = sql + hotel + "%'";
		sql = sql + "group by hotelName";
		switch (selector) {
			case '0': sql = "create table new_table select hotelName,hotelLocation,hotelScore,hotelStar,min(hotelPrice) as hotelPrice from hotel_info\
								where hotelLocation like '%"+hotel+"%'group by hotelName"; break;
			case '1': sql = sql + ",hotelStar order by hotelStar "; break;
			case '2': sql = sql + ",roomAllowance order by roomAllowance "; break;
			case '3': sql = sql + ",hotelScore order by hotelScore "; break;
			default:  break;
		}
		if(selector==0){
			conn.query(sql);
			sql="select hotelName,hotelLocation,hotelScore,hotelStar,hotelPrice as hotelPrice from new_table order by hotelPrice ";
		}
		if (timer == 1) {
			if(selector == 2 || selector == 4) sql = sql + ";";
			else sql = sql + "desc;";
		} else {
			if(selector == 2) sql = sql + "desc;";
			else sql = sql + ";";
		}
		
		let ret = await conn.query(sql); 
		callback(undefined, ret[0]);
		if(selector==0){
			conn.query("drop table new_table;");
		}
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.hotel_order_info_manager = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let selector = req.query.selector; //GET方式获取参数
		let timer = req.query.timerange;  //GET方式获取参数
		//let buyer_id = req.session.token.uid;  //之后可能会修改
		
		let sql = "select hotelName,hotelLocation,hotelScore,hotelStar,hotelPrice from hotel_info ";
		switch (selector) {
			case '0': sql = sql + "order by hotelPrice "; break;
			case '1': sql = sql + "order by hotelStar "; break;
			case '2': sql = sql + "order by roomAllowance "; break;
			case '3': sql = sql + "order by hotelScore "; break;
			default:  break;
		}
		if (timer == 1) {
			if(selector == 2 || selector == 4) sql = sql + ";";
			else sql = sql + "desc;";
		} else {
			if(selector == 2) sql = sql + "desc;";
			else sql = sql + ";";
		}
		let ret = await conn.query(sql); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.hotel_cancel_orders = async(req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let order_Name = req.session.details[req.body.delete_mes].hotelName;
		let order_price=req.session.details[req.body.delete_mes].hotelPrice;
		console.log(order_Name);
		await conn.query("delete from hotel_info where hotelName = ? and hotelPrice= ?", [order_Name,order_price]);

		callback(undefined, "cancel_ok");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.hotel_Info_modify = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let sql = "select hotelName,hotelLocation,hotelScore,hotelStar,hotelPrice,hotelInstr,type from hotel_info where hotelName=? and hotelPrice=?;";
		let order_Name = req.session.details[req.query.detail].hotelName;
		let order_price=req.session.details[req.query.detail].hotelPrice;
		let ret = await conn.query(sql, [order_Name, order_price]); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.hotel_Info_modifying = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let sql = "update hotel_info set hotelName=?,hotelLocation=?,hotelScore=?,hotelStar=?,hotelPrice=?,type=?,hotelInstr=? where hotelName=? and hotelPrice=?;";
		let order_Name = req.query.hotelName;
		let order_location=req.query.hotelLocation;
		let order_score=req.query.hotelScore;
		let order_star=req.query.hotelStar;
		let order_price=req.query.hotelPrice;
		let order_type=req.query.type;
		let order_instr=req.query.hotelInstr;
		console.log(req.query.Name);
		let ret = await conn.query(sql, [order_Name, order_location,order_score,order_star,order_price,order_type,order_instr,req.query.Name,req.query.Price,]); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.hotel_modify_info_manager = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let selector = 4;
		let timer = 2;  
		
		let sql = "select hotelName,hotelLocation,hotelScore,hotelStar,hotelPrice from hotel_info ";
		switch (selector) {
			case '0': sql = sql + "order by hotelPrice "; break;
			case '1': sql = sql + "order by hotelStar "; break;
			case '2': sql = sql + "order by roomAllowance "; break;
			case '3': sql = sql + "order by hotelScore "; break;
			default:  break;
		}
		if (timer == 1) {
			if(selector == 2) sql = sql + ";";
			else sql = sql + "desc;";
		} else {
			if(selector == 2) sql = sql + "desc;";
			else sql = sql + ";";
		}
		let ret = await conn.query(sql); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.hotel_Info_new = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let sql = "insert into hotel_info (hotelName,hotelLocation,hotelScore,hotelStar,hotelPrice,roomAllowance,type,hotelInstr) values (?,?,?,?,?,?,?,?);";
		let order_Name = req.query.hotelName;
		let order_location=req.query.hotelLocation;
		let order_score=req.query.hotelScore;
		let order_star=req.query.hotelStar;
		let order_price=req.query.hotelPrice;
		let order_room=req.query.room;
		let order_type=req.query.type;
		let order_instr=req.query.instr;
		console.log(req.query.hotelName);
		let ret = await conn.query(sql, [order_Name, order_location,order_score,order_star,order_price,order_room,order_type,order_instr]); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.hotel_show_info = async(req, res, callback) => {
	const conn = await pool.getConnection();
	let name=req.query.hotelName;
	try {
		let sql = "select hotelName,hotelInstr, hotelLocation, hotelScore, hotelImg1, hotelImg2, hotelPrice from hotel_info\
		where hotelName = ?";
		sql = sql + "order by hotelPrice "; 
		let ret = await conn.query(sql,[name]);
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}


//用户评价
exported.hotel_comments = async(req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let name=req.query.hotelName;
		let id=req.session.token.username;
		console.log(name);
		let sql = "insert into hotel_com values (?,?,?)";
		let mycomments = req.query.mycomments;
		await conn.query(sql,[name,id,mycomments]);
		callback(undefined, "ok!");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
 }

 //显示评价
 exported.hotel_show_com = async(req, res, callback) => {
 	const conn = await pool.getConnection();
 	try {
 		let name=req.query.hotelName;
 		let sql = "select userID, hotelEvaluete from hotel_com where hotelName = ?";
 		let ret = await conn.query(sql,[name]);
 		callback(undefined, ret[0]);
 	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
 }

//房间预订
exported.bookRoom = async function(req,res, callback) {
		const conn = await pool.getConnection();
		try {
			let name=req.query.hotelName;
			let price=req.query.hotelPrice;
			let double = req.query.double;
			let single = req.query.single;
			let lux = req.query.lux;
			let checkin = req.query.checkin;
			let checkout = req.query.checkout;
			let address=req.query.address;
			let buyerid=req.session.token.uid;
			var date = new Date();
			date.toLocaleString( );
			let sql1 = "update hotel_info set roomAllowance = roomAllowance - ?\
			where hotelName = ? and type=1";
			await conn.query(sql1,[single,name]);
			let sql2 = "update hotel_info set roomAllowance = roomAllowance - ?\
			where hotelName = ? and type=3";
			await conn.query(sql2,[lux,name]);
			let sql3 = "update hotel_info set roomAllowance = roomAllowance - ?\
			where hotelName = ? and type=2 ";
			await conn.query(sql3,[double,name]);
			
			let sql5 = "insert into order_form values (?,2,?,?,?,?,0,?,null,null,0,null,null)";
			await conn.query(sql5,[utils.createDealRecord(),buyerid,name,price,address,date]);
			
			//let sql4 = "insert into order_form values( ,2,1,)"
			callback(undefined, "ok");
		} catch (err) {
			console.log(err);
			callback(err, undefined);
		} finally {
			if (conn) conn.release();
		}
 	}




exported.flight_order_info = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let selector = req.query.selector; //GET方式获取参数
		let timer = req.query.timerange;  //GET方式获取参数
		//let buyer_id = req.session.token.uid;  //之后可能会修改
		const flight=req.query.pos;
		const flight1=req.query.pos1;
		const flight2=req.query.pos2;
		console.log(flight);
		console.log(flight1);
		console.log(flight2);
		let sql = "select flightName,flightCompany,landingPlace,departurePlace,landingTime,departureTime,min(flightPrice) as flightPrice from flight_info\
				where departurePlace like '%"+flight+"%' and landingPlace like '%"+flight1+"%' and departureTime like '%"+flight2+"%'";
		sql = sql + "group by flightName";
		switch (selector) {
			case '0': sql = "create table new_table select flightName,flightCompany,landingPlace,departurePlace,landingTime,departureTime,min(flightPrice) as flightPrice from flight_info\
								where departurePlace like '%"+flight+"%' and landingPlace like '%"+flight1+"%'and departureTime like '%"+flight2+"%' group by flightName"; break;
			case '1': sql = sql + ",departureTime order by departureTime "; break;
			case '2': sql = sql + ",flightCompany order by flightCompany "; break;
			default:  break;
		}
		if(selector==0){
			conn.query(sql);
			sql="select flightName,flightCompany,landingPlace,departurePlace,landingTime,departureTime,flightPrice as flightPrice from new_table order by flightPrice ";
		}
		if (timer == 1) {
			if(selector == 2) sql = sql + ";";
			else sql = sql + "desc;";
		} else {
			if(selector == 2) sql = sql + "desc;";
			else sql = sql + ";";
		}
		
		let ret = await conn.query(sql); 
		callback(undefined, ret[0]);
		if(selector==0){
			conn.query("drop table new_table;");
		}
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.flight_order_info_manager = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let selector = req.query.selector; //GET方式获取参数
		let timer = req.query.timerange;  //GET方式获取参数
		//let buyer_id = req.session.token.uid;  //之后可能会修改
		
		let sql = "select flightName,flightCompany,landingPlace,departurePlace,landingTime,departureTime,flightPrice from flight_info ";
		switch (selector) {
			case '0': sql = sql + "order by flightPrice "; break;
			case '1': sql = sql + "order by departureTime "; break;
			case '2': sql = sql + "order by flightCompany "; break;
			default:  break;
		}
		if (timer == 1) {
			if(selector == 2) sql = sql + ";";
			else sql = sql + "desc;";
		} else {
			if(selector == 2) sql = sql + "desc;";
			else sql = sql + ";";
		}
		let ret = await conn.query(sql); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.flight_cancel_orders = async(req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let order_Name = req.session.details[req.body.delete_mes].flightName;
		let order_price=req.session.details[req.body.delete_mes].flightPrice;
		console.log(req.body.delete_mes);
		await conn.query("delete from flight_info where flightName = ? and flightPrice= ?", [order_Name,order_price]);

		callback(undefined, "cancel_ok");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.flight_Info_modify = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let sql = "select flightName,flightCompany,landingPlace,departurePlace,landingTime,departureTime,flightPrice from flight_info where flightName=? and flightPrice=?;";
		let order_Name = req.session.details[req.query.detail].flightName;
		let order_price=req.session.details[req.query.detail].flightPrice;
		let ret = await conn.query(sql, [order_Name, order_price]); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.flight_Info_modifying = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let sql = "update flight_info set flightName=?,flightCompany=?,departureTime=?,departurePlace=?,landingTime=?,landingPlace=?,flightPrice=?,ticketAllowance=? where flightName=? and flightPrice=?;";
		let order_Name = req.query.flightName;
		let order_Company=req.query.flightCompany;
		let order_departurePlace=req.query.departurePlace;
		let order_departureTime=req.query.departureTime;
		let order_landingPlace=req.query.landingPlace;
		let order_landingTime=req.query.landingTime;
		let order_price=req.query.flightPrice;
		let order_ticket=req.query.ticketAllowance;
		console.log(req.query.Name);
		let ret = await conn.query(sql, [order_Name, order_Company,order_departureTime,order_departurePlace,order_landingTime,order_landingPlace,order_price,order_ticket,req.
		query.Name,req.query.Price]); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.flight_modify_info_manager = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let selector = 4;
		let timer = 2;  
		
		let sql = "select flightName,flightClass,flightCompany,landingPlace,departurePlace,landingTime,departureTime,flightPrice from flight_info";
		switch (selector) {
			case '0': sql = sql + "order by flightPrice "; break;
			case '1': sql = sql + "order by departureTime "; break;
			case '2': sql = sql + "order by flightCompany "; break;
			default:  break;
		}
		if (timer == 1) {
			if(selector == 2) sql = sql + ";";
			else sql = sql + "desc;";
		} else {
			if(selector == 2) sql = sql + "desc;";
			else sql = sql + ";";
		}
		let ret = await conn.query(sql); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.flight_Info_new = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let sql = "insert into flight_info (flightName,flightCompany,departureTime,departurePlace,landingTime,landingPlace,flightPrice,ticketAllowance) values (?,?,?,?,?,?,?,?);";
		let order_Name = req.query.flightName;
		let order_Company=req.query.flightCompany;
		let order_departurePlace=req.query.departurePlace;
		let order_departureTime=req.query.departureTime;
		let order_landingPlace=req.query.landingPlace;
		let order_landingTime=req.query.landingTime;
		let order_price=req.query.flightPrice;
		let order_ticket=req.query.ticketAllowance;
		console.log(req.query.Name);
		let ret = await conn.query(sql, [order_Name, order_Company,order_departureTime,order_departurePlace,order_landingTime,order_landingPlace, order_price,order_ticket]); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.flight_show_info = async(req, res, callback) => {
	const conn = await pool.getConnection();
	let name=req.query.flightName;
	try {
		let sql = "select flightName,flightCompany, flightPrice from flight_info\
		where flightName = ?";
		
		let ret = await conn.query(sql,[name]);
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

exported.flight_comments = async(req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let name=req.query.flightName;
		let id=req.session.token.username;
		console.log(name);
		console.log(id);
		let sql = "insert into flight_com values (?,?,?)";
		let mycomments = req.query.mycomments;
		await conn.query(sql,[name,id,mycomments]);
		callback(undefined, "ok!");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
 }

 //显示评价
 exported.flight_show_com = async(req, res, callback) => {
 	const conn = await pool.getConnection();
 	try {
 		let name=req.query.flightName;
 		let sql = "select userID, flightEvaluete from flight_com where flightName = ?";
 		let ret = await conn.query(sql,[name]);
 		callback(undefined, ret[0]);
 	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
 }

exported.flight_booking = async(req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let name=req.query.flightName+"航班";
		let price=req.query.flightPrice;
		let address=req.query.address;
		let buyerid=req.session.token.uid;
		var date = new Date();
		date.toLocaleString( );
		
		let sql2 = "insert into order_form values (?,2,?,?,?,?,0,?,null,null,0,null,null)";
		await conn.query(sql2,[utils.createDealRecord(),buyerid,name,price,address,date]);
		let sql3 = "update flight_info set ticketAllowance = ticketAllowance - 1\
			where flightName = ?";
		await conn.query(sql3,[req.query.flightName]);
		callback(undefined, "ok!");
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