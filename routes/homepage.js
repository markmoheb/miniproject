// require dependencies
var express = require('express');
var router = express.Router();
var multer = require('multer');
var apartmentController = require('../controllers/apartmentController');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });
// var upload = multer({ dest: 'uploads/' }); // weird name

// add routes
router.get('/', apartmentController.getAllApartments);

router.post('/upload', upload.single('apartment_image'), apartmentController.createApartment);

router.get('/upload', function (req, res) {
   res.render('upload');
});


// export router
module.exports = router;