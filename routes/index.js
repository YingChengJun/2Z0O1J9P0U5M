let express = require('express');
let router = express.Router();
let app = express();

//main page
router.get('/', (req, res) => {
	if (req.session.token) {
		res.redirect('../account');
	} else res.redirect('../account/login');
});

router.get('/logout', (req, res)=> {
	req.session.destroy();
	res.redirect('../account/login');
});

module.exports = router;