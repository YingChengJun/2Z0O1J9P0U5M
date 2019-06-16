let express = require('express');
let router = express.Router();
let app = express();

//main page
router.get('/', (req, res) => {
	res.redirect('../account/login');
});

router.get('/logout', (req, res)=> {
	req.session.destroy();
	res.redirect('../account/login');
});

module.exports = router;