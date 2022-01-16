const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    images: [{
        type: String
    }],
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    
    price : {
        type: Number,
        default:0
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    serviceBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    status: {
        type: Boolean,
        default: false
    },
})

serviceSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

serviceSchema.set('toJSON', {
    virtuals: true,
});


exports.Service = mongoose.model('Service', productSchema);
