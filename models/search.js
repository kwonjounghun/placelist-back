const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Place = new Schema({
    _place_id: Schema.Types.ObjectId,
    name: String,
    address: String,
    address_components: {
        country: String,
        sido: String,
        sigugun: String,
        dongmyun: String,
        ri: String,
        rest: String
    },
    location: {
        lat: Number,
        lng: Number
    },
    RoadAddress: String,
    phone_number: String,
    photos: [],
    website: String,
    category: String,
    description: String,
    fillters: {
        sido: String,
        sigugun: String,
        category: String
    }
});

Place.statics.create = function (data) {
    const place = new this(data);

    return place.save();
}

Place.statics.updatePlace = function (placeInfo, addrItems) {
    let obj = {
        name: placeInfo.title,
        address: placeInfo.address,
        address_components: addrItems.addrdetail,
        location: {
            lat: addrItems.point.x,
            lng: addrItems.point.y
        },
        RoadAddress: placeInfo.roadAddress,
        phone_number: placeInfo.telephone,
        photos: [],
        website: placeInfo.link,
        category: placeInfo.category,
        description: placeInfo.description,
        fillters: {
            sido: addrItems.addrdetail.sido,
            sigugun: addrItems.addrdetail.sigugun,
            category: placeInfo.fillter
        }
    }

    return this.find()
        .where({address: placeInfo.address})
        .where({ name: new RegExp(placeInfo.title, 'g') })
        .update(
            {},
            obj,
            { multi: true }
        );
}

Place.statics.createPlace = function (placeInfo, addrItems) {
    console.log("2", addrItems);
    place = new this(
        {
            name: placeInfo.title,
            address: placeInfo.address,
            address_components: addrItems.addrdetail,
            location: {
                lat: addrItems.point.y,
                lng: addrItems.point.x
            },
            RoadAddress: placeInfo.roadAddress,
            phone_number: placeInfo.telephone,
            photos: [],
            website: placeInfo.link,
            category: placeInfo.category,
            description: placeInfo.description,
            fillters: {
                sido: addrItems.addrdetail.sido,
                sigugun: addrItems.addrdetail.sigugun,
                category: placeInfo.fillter
            }
        }
    )

    return place.save();
}

// find one user by using username
Place.statics.findPlace = function (name) {
    return this.find({
        name: new RegExp(name, 'g')
    }).exec();
}
Place.statics.findPlaceDetail = function (place_id) {
    return this.find({
        _id: place_id
    }).exec();
}

Place.statics.findPlaceCount = function (name, address) {
    console.log("count : ", name, address);
    return this.count({}).exec();
}



module.exports = mongoose.model('place', Place);