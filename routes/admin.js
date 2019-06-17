let express = require('express');
let router = express.Router();
let mysql = require('mysql');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'opmsystem',
    port: '3306'
});

router.get('/', function(req, res, next) {
    if(!req.session.token){
        res.redirect('../account');
    }
    if(req.session.token.typeOfUser != 3){
        res.redirect('../account');
    }

    let data = "";
    let user = req.query.user;
    let filter = "";
    if (user) {
        filter = 'WHERE id = ?';
    }
    con.query('SELECT * FROM user ' + filter, user, function(err, rows) {
        if (err) {
            console.log(err);
        }
        rows.forEach((item)=>{
            if(item.typeOfUser == 1)
                item.typeOfUser = 'Buyer';
            else if(item.typeOfUser == 2)
                item.typeOfUser = 'Seller';
            else if(item.typeOfUser == 3)
                item.typeOfUser = 'Admin';
        });
        var data = rows;
        res.render('account/admin', {data: data, user: user });
    });
});

router.get('/stat', (req, res)=>{
    if(!req.session.token){
        res.redirect('../account');
    }
    if(req.session.token.typeOfUser != 3){
        res.redirect('../account');
    }
    con.query('SELECT COUNT(id) AS USERNUM FROM user',' ',(err, row)=>{
        if(err){
            con.log(err);
        }
        res.render('account/stat', {userNum:row[0].USERNUM});
    });

});

router.get('/userReset', (req, res, next)=>{
    if(!req.session.token){
        res.redirect('../account');
    }
    if(req.session.token.typeOfUser != 3){
        res.redirect('../account');
    }
    let id = req.query.id;
    let pwd = '12345678';
    con.query('UPDATE user SET password = ? WHERE id = ?',[pwd, id], (err, rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/account/admin');
        }
    });

});

module.exports = router;