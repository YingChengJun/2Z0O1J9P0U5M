let express = require("express");
let router = express.Router();
let index = require('../models/updateModels.js');

router.post("/update", function(req, res) {
  if (!req.session.token) {
    res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
    return;
  }
  index.update(req, function(err, ret) {
    if (err) {
      console.log(err);
      res.send({ status: -1 }).end(); //服务器异常
    } else {
      console.log(ret);
      if (ret < 0) {
        res.send({ status: 0 }).end(); //缺少信息
      } else {
        res.send({ status: 1 }).end(); //成功
      }
    }
  });
});

router.get('/', (req, res) => {
  if (!req.session.token) {
    res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
    return;
  }
  res.render('update', {
    typeOfUser: req.session.token.typeOfUser
  });
});

module.exports = router;