var mongoose = require('mongoose');

var apartmentSchema = mongoose.Schema({
      size: Number,
      address: String,  
      rent: Number,
      insurance: Number,
      service_fee: Number,
      date_posted: Date,
      district: String,
      // amenities: [
      //   {description: String}
      // ],
      number_of_rooms: Number,
      photo_path: String
})

var Apartment = mongoose.model("apartment", apartmentSchema);

module.exports = Apartment;

// address, photo_path, amenities, extra_amenities have been modified
// insurance type? service fee?