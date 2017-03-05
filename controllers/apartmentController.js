let Apartment = require('../models/apartment');

let apartmentController = {

    getAllApartments: function (req, res) {

        Apartment.find(function (err, apartments) {
            if (err)
                res.send(err.message);
            else
                res.render('index', { apartments });
        })
    },

    getSomeApartments: function (req, res) {
        var search = req.body.search;
        var query = { district: { "$regex": search, "$options": "i" } };
        console.log(query);

        Apartment.find(query, function (err, apartments) {
            if (err)
                res.send(err.message);
            else
                res.render('index', { apartments });
        })
    },

    createApartment: function (req, res) {
        req.checkBody('address', 'Address required').notEmpty();
        req.checkBody('district', 'District required').notEmpty();
        req.checkBody('size', 'Size required').notEmpty();
        // req.checkBody('apartment_image', 'Photo required').notEmpty();
        req.checkBody('rent', 'Rent required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            req.flash('error', errors[0].msg)
            res.redirect('/upload');
            console.log(errors);
        }
        else {
            let apartment = new Apartment(req.body);
            apartment.set('photo_path', '/uploads/' + req.file.filename);

            console.log(req.file);

            apartment.save(function (err, apartment) {
                if (err) {
                    res.send(err.message)
                    console.log(err);
                }
                else {
                    console.log(apartment);
                    res.redirect('/');
                }
            })
        }
    }
}

module.exports = apartmentController;