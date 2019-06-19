/* 0 待付款
 * 1 待发货
 * 2 待收货
 * 3 已完成
 * 4 退款完成
 * 5 已关闭*/
/* 0 未对账
 * 1 核对后证明正确
 * 2 核对后自动修改
 * 3 金额问题，等待手动修改*/
// 在视图层面上进行操作，先通过标准化.js建立基于deal_record和order_form的视图。
/* 从订单库中取出订单，根据订单号在流水库中select*/
// 现在后台初步处理完数据后，再将信息渲染到前端

const pool = require('./conn_pool');
let exported = {};

let record=[];//存储订单
let index;

exported.init_status = async function(){
  const connection = await pool.getConnection();
  try{
      let rows = await connection.query('UPDATE deal_record SET transaction_status=1')
      console.log(rows);
  }catch(err){
     console.log(err);
  }finally{
     if(connection) connection.release();
  }
  
}

exported.comp_info = async function(){
  await exported.init_status();
  const connection = await pool.getConnection();
  try{
    let rows = await connection.query( 'SELECT order_id,seller_id,buyer_id,price,current_status FROM order_form')
    //console.log(rows)
    for(var i=0;i<rows[0].length;i++){
          record[i]=rows[0][i];          
    }
    //console.log(record);
    for(var i=0;i<record.length;i++){
          index =i;
          console.log(index);
          let sql = 'SELECT order_id,from_id,to_id,amount,transaction_status FROM deal_record WHERE order_id = ?';
          let sqlUO = 'UPDATE order_form SET current_status = ? WHERE order_id = ?';
          let sqlUD = 'UPDATE deal_record SET transaction_status = ? WHERE order_id = ?';
          let param1 = record[i].order_id;
          let current_status=record[i].current_status;
          let seller_id=record[i].seller_id;
          let buyer_id=record[i].buyer_id;
          let price=record[i].price;
          console.log(param1);
          let param2;
          let param3;
          let dealRcd = await connection.query(sql,param1)
          //console.log(dealRcd[0]);
          let Rcd=dealRcd[0];
          console.log(Rcd);
          //console.log(dealRcd[0].length);
          switch(current_status){
            //deal库中本来应该没有内容
            case 0:
              if(dealRcd[0].length==1){
                    param2=[1,param1];
                    param3=[2,param1];
                    await connection.query(sqlUO,param2,function(err,rows){
                      if(err) throw err;
                      else{
                        console.log(rows[0]);
                      }
                    })
                    await connection.query(sqlUD,param3,function(err,rows){
                      if(err) throw err;
                      else{
                        console.log(rows[0]);
                      }
                    })
                    console.log("有交易流水，但显示未付款，将订单状态修改为1。");
                    console.log("有已经核对且自动修改，将流水状态修改为2");
              }
              else if(dealRcd[0].length==0){
                    console.log("无交易流水，且显示未付款，正确订单。");
              }  
              else if(dealRcd[0].length==2){
              // 无需人工
                if(price==Rcd[0].amount){
                      param2=[3,param1];
                      param3=[2,param1];
                      await connection.query(sqlUO,param2,function(err,rows){
                        if(err) throw err;
                        else{
                          console.log(rows[0]);
                        }
                      })
                      await connection.query(sqlUD,param3,function(err,rows){
                        if(err) throw err;
                        else{
                          console.log(rows[0]);
                        }
                      })
                    console.log("有2条交易流水，但显示未付款，将订单状态修改为3。");
                    console.log("有已经核对且自动修改，将流水状态修改为2");
                }
              // 需要人工
                else if(price!=Rcd[0].amount){
                    param2=[3,param1];
                      param3=[3,param1];
                      await connection.query(sqlUO,param2,function(err,rows){
                        if(err) throw err;
                        else{
                          console.log(rows[0]);
                        }
                      })
                      await connection.query(sqlUD,param3,function(err,rows){
                        if(err) throw err;
                        else{
                          console.log(rows[0]);
                        }
                      })
                    console.log("有2条交易流水，但显示未付款，将订单状态修改为3。");
                    console.log("金额出现差池需要修改，将流水状态修改为3");
                }
              }
            break;
            case 1:case 2:
              if(dealRcd[0].length==2){
                // 无需人工
                  if(price==Rcd[0].amount){
                        param2=[3,param1];
                        param3=[2,param1];
                        await connection.query(sqlUO,param2,function(err,rows){
                          if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                        await connection.query(sqlUD,param3,function(err,rows){
                          if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                      console.log("有2条交易流水，但显示未付款，将订单状态修改为3。");
                      console.log("有已经核对且自动修改，将流水状态修改为2");
                    
                  }
                // 需要人工
                  else if(price!=Rcd[0].amount){
                      param2=[3,param1];
                      param3=[3,param1];
                        await connection.query(sqlUO,param2,function(err,rows){
                          if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                        await connection.query(sqlUD,param3,function(err,rows){
                          if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                      console.log("有2条交易流水，但显示未付款，将订单状态修改为3。");
                      console.log("金额出现差池需要修改，将流水状态修改为3");
                  }
              }
              else if(dealRcd[0].length==1){
                if(buyer_id==Rcd[0].buyer_id){
                  if(price==Rcd[0].amount){
                    param3=[1,param1];
                    await connection.query(sqlUD,param3,function(err,rows){
                    if(err) throw err;
                      else{
                        console.log(rows[0]);
                      }
                    })
                    console.log("正确，将流水状态修改为1");
                  }
                  else{
                    param3=[3,param1];
                    await connection.query(sqlUD,param3,function(err,rows){
                    if(err) throw err;
                    else{
                      console.log(rows[0]);
                      }
                    })
                    console.log("金额出现差池需要修改，将流水状态修改为3");
                  }
                }
                else{
                  if(price==Rcd[0].amount){
                    param3=[3,param1];
                    await connection.query(sqlUD,param3,function(err,rows){
                    if(err) throw err;
                    else{
                      console.log(rows[0]);
                      }
                    })
                    console.log("买家出现差池需要修改，将流水状态修改为3");
                  }
                  else{
                    param3=[3,param1];
                    await connection.query(sqlUD,param3,function(err,rows){
                    if(err) throw err;
                    else{
                      console.log(rows[0]);
                      }
                    })
                    console.log("买家和金额出现差池需要修改，将流水状态修改为3");
                  }
                }
                
              }
              else if(dealRcd[0].length==0){
                      param2=[0,param1];
                      await connection.query(sqlUO,param2,function(err,rows){
                        if(err) throw err;
                        else{
                          console.log(rows[0]);
                        }
                      })
                      console.log("无交易流水，但显示已付款，将订单状态修改为0");
              }
            break;
            case 3:case 4:
              if(dealRcd[0].length==2){
                // 无需人工
                  if(price==Rcd[0].amount){
                        param3=[1,param1];
                        await connection.query(sqlUD,param3,function(err,rows){
                          if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                      console.log("有两条流水，且显示资金流向为买家->中间->卖家，正确订单");

                  }
                // 需要人工
                  else if(price!=Rcd[0].amount){
                        param3=[3,param1];
                        await connection.query(sqlUD,param3,function(err,rows){
                          if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                      console.log("金额出现差池需要修改，将流水状态修改为3");
                  }
              }
              else if(dealRcd[0].length==1){
                  if(buyer_id==Rcd[0].buyer_id){
                    if(price==Rcd[0].amount){
                      param2=[2,param1];
                      param3=[2,param1];
                      await connection.query(sqlUO,param2,function(err,rows){
                        if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                      await connection.query(sqlUD,param3,function(err,rows){
                      if(err) throw err;
                        else{
                          console.log(rows[0]);
                        }
                      })
                      console.log("修改订单状态状态为2待发货");
                      console.log("将流水状态修改为2");
                    }
                    else{
                      param2=[2,param1];
                      param3=[3,param1];
                      await connection.query(sqlUO,param2,function(err,rows){
                        if(err) throw err;
                        else{
                          console.log(rows[0]);
                          }
                        })
                      await connection.query(sqlUD,param3,function(err,rows){
                      if(err) throw err;
                      else{
                        console.log(rows[0]);
                        }
                      })
                      console.log("金额出现差池需要修改，将流水状态修改为3");
                    }
                  }
                  else{
                    if(price==Rcd[0].amount){
                      param2=[2,param1];
                      param3=[3,param1];
                      await connection.query(sqlUO,param2,function(err,rows){
                        if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                      await connection.query(sqlUD,param3,function(err,rows){
                      if(err) throw err;
                        else{
                          console.log(rows[0]);
                        }
                      })
                      console.log("修改订单状态状态为2待发货");
                      console.log("将流水状态修改为3");
                    }
                    else{
                      param2=[2,param1];
                      param3=[3,param1];
                      await connection.query(sqlUO,param2,function(err,rows){
                        if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                      await connection.query(sqlUD,param3,function(err,rows){
                      if(err) throw err;
                        else{
                          console.log(rows[0]);
                        }
                      })
                      console.log("修改订单状态状态为2待发货");
                      console.log("将流水状态修改为3");
                    }
                  }
                  
              }
              else if(dealRcd[0].length==0){
                param2=[0,param1];
                await connection.query(sqlUO,param2,function(err,rows){
                  if(err) throw err;
                  else{
                    console.log(rows[0]);
                  }
                })
                console.log("无交易流水，但显示已付款，将订单状态修改为0");
              }
            break;
           /* case 5:
              if(dealRcd[0].length==2){
                // 无需人工
                  if(price==Rcd[0].amount){
                    //退款
                    if(buyer_id==Rcd[0].from_id&&buyer_id==Rcd[1].to_id){
                        param3=[1,param1];
                        await connection.query(sqlUD,param3,function(err,rows){
                          if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                        console.log("有2条交易流水，且显示资金流向为买家->中间->买家，正确订单。");
                      } 
                    else if(buyer_id==Rcd[0].from_id&&seller_id==Rcd[1].to_id){
                        param2=[3,param1];
                        await connection.query(sqlUO,param2,function(err,rows){
                          if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                      console.log("有两条流水，但显示资金流向为买家->中间->卖家，将订单状态修改为3");
                    }
                  }
                // 需要人工
                  else if(price!=Rcd[0].amount){
                    //退款
                    if(Rcd[0].form_id==buyer_id&&Rcd[1].to_id==buyer_id){
                        param3=[3,param1];
                        await connection.query(sqlUD,param3,function(err,rows){
                          if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                        console.log("金额出现差池需要修改，将流水状态修改为3");
                     }
                    //完成
                    else if(Rcd[0].form_id==buyer_id&&Rcd[1].to_id==seller_id){
                        param2=[3,param1];
                        param3=[3,param1];
                        await connection.query(sqlUO,param2,function(err,rows){
                          if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                        await connection.query(sqlUD,param3,function(err,rows){
                          if(err) throw err;
                          else{
                            console.log(rows[0]);
                          }
                        })
                      console.log("有两条流水，但显示资金流向为买家->中间->卖家，将订单状态修改为3");
                      console.log("金额出现差池需要修改，将流水状态修改为3");
                     }
                  }
                }
              else if(dealRcd[0].length==1){
                //console.log(rows);
                //console.log(rows[0].amount);
                if(price==Rcd[0].amount){
                  param2=[2,param1];
                  param3=[2,param1];
                  await connection.query(sqlUO,param2,function(err,rows){
                    if(err) throw err;
                      else{
                        console.log(rows[0]);
                      }
                    })
                  await connection.query(sqlUD,param3,function(err,rows){
                  if(err) throw err;
                    else{
                      console.log(rows[0]);
                    }
                  })
                  console.log("有1条交易流水，但显示交易已完成，自动修改，将订单状态修改为2");
                  console.log("自动修改，将流水状态修改为2");
                }
                else{
                  param2=[2,param1];
                  param3=[3,param1];
                  await connection.query(sqlUO,param2,function(err,rows){
                    if(err) throw err;
                      else{
                        console.log(rows[0]);
                      }
                    })
                  await connection.query(sqlUD,param3,function(err,rows){
                  if(err) throw err;
                    else{
                      console.log(rows[0]);
                    }
                  })
                  console.log("有1条交易流水，但显示交易已完成，将订单状态修改为2");
                  console.log("金额出现差池需要修改，将流水状态修改为3");
                }
              }
              else if(dealRcd[0].length==0){
                param2=[0,param1];
                await connection.query(sqlUO,param2,function(err,rows){
                  if(err) throw err;
                  else{
                    console.log(rows[0]);
                  }
                })
                console.log("无交易流水，但显示已付款，将订单状态修改为0");
              }*/
          }
      }   
  }catch(err){
    throw err;
  }finally{
    if(connection) connection.release();
  }
}

exported.show_info  = async (req,res,callback) =>{
  const connection = await pool.getConnection();
  try{
    await exported.comp_info();
    let deal = await connection.query('SELECT * FROM deal_record');
    callback(undefined,deal);
  }catch(err){
    console.log(err);
    callback(err,undefined);
  }finally{
    if(connection) connection.release();
  }
}

module.exports = exported;