const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, './uploads/');
	},
	filename: (_req, file, cb) => {
		cb(null, new Date().toISOString() + file.originalname);
	},
});

const fileFilter = (_req, file, cb) => {
	// rejecy a file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter: fileFilter,
});

router.get('/', ProductsController.products_get_all);

router.post(
	'/',
	checkAuth,
	upload.single('productImage'),
	ProductsController.products_create_product
);

router.get('/:productId', ProductsController.products_get_product);

router.patch(
	'/:productId',
	checkAuth,
	ProductsController.products_update_product
);

router.delete('/:productId', checkAuth, ProductsController.products_delete);

module.exports = router;
