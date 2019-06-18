const pool = require("./conn_pool");
let exported={};

exported.update =  async function (req, callback) {
    try {
      const connection = await pool.getConnection();
      let deal_id = req.body.dealid;
      let from_id = req.body.fromid;
      let to_id = req.body.toid;
      let amount = req.body.amount;
      ret = 0;
      let sql = "UPDATE deal_record SET from_id = ?,to_id = ?,amount = ?, transaction_status = 2 WHERE deal_id = ?";
      let param = [from_id ,to_id ,amount ,deal_id ]
      let ret = await connection.query(sql,param);
      callback(undefined, ret[0]);
    } catch (err) {
      callback(err, undefined);
    }finally{
        if(connection) connection.release();
    }
  }
  module.exports = exported;
