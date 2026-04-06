const router = require('express').Router();
const { login, cadastrar } = require('../controllers/authController');
const auth = require('../middleware/auth');
router.post('/login', login);
router.post('/cadastrar', auth, cadastrar);
module.exports = router;