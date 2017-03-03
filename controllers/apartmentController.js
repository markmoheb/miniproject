let Apartment = require('../models/apartment');

let apartmentController = {
    
    getAllApartments:function(req, res){
        
        Apartment.find(function(err, apartments){    
            if(err)
                res.send(err.message);
            else
                res.render('index', {apartments});
        })
    },

    createApartment:function(req, res){
        let apartment = new Apartment(req.body);
        apartment.set('photo_path',  '/uploads/'+req.file.filename);
        
        console.log(req.file);

        apartment.save(function(err, apartment){
            if(err){
                res.send(err.message)
                console.log(err);
            }
            else{
                console.log(apartment);
                res.redirect('/');
            }
        })
    }
}

module.exports = apartmentController;