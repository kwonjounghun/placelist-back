const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Place = new Schema({
    _place_id: Schema.Types.ObjectId,  
    G_place_id : String,
    name : String,
    formatted_address : String,
    address_components : {
        address : {
            level_1 : String,
            level_2 : String,
            level_3 : String
        }
    },
    location : {
        lat : Number,
        lng : Number
    },
    formatted_phone_number : String,
    photos: [] ,
    type : [],
    website : String
});

Place.statics.create = function(data){
    const place = new this(data);

    return place.save();
}

// find one user by using username
Place.statics.findPlace = function(name) {
    return this.find({
        name
    }).exec();
}

Place.statics.findOneByPlaceId = function(G_place_id) {
    return this.findOne({
        G_place_id
    }).exec()
}



module.exports = mongoose.model('place', Place);