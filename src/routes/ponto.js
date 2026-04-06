const router = require('express').Router();
const auth = require('../middleware/auth');
const { registrar, meusPontos, todosPontos, upload } = require('../controllers/pontoController');
router.post('/registrar', auth, upload, registrar);
router.get('/meus', auth, meusPontos);
router.get('/todos', auth, todosPontos);
module.exports = router;