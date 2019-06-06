var express = require('express');
var router = express.Router();

/* GET home page. */
/* 通过localhost:3030/payment来进行访问 */
router.get('/', (req, res) => {
    res.render('transaction');
});


module.exports = router;
