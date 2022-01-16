const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    
    bookingAddress: {
        type: String,
        required: true,
    },
    bookingBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    services:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    }],
    bookingContact: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
        default:0
    },
    discountPer: {
        type: Number,
        required: true,
        default:0
    },
    subTotal: {
        type: Number,
        required: true,
        default:0
    },
    vouchers:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
    }],
    vat:{
        type: Number,
        required: true,
        default:0
    },
    subTotalAfterCommission: {
        type: Number,
        required: true,
        default:0
    },
    commissionRate:{
        type: Number,
        required: true,
        default:0
    },
    commissionDeducted:{
        type: Number,
        required: true,
        default:0
    },
    bookingdate: {
        type: Date,
         default:Date.now()
    },
    
    status: {
        type: Boolean,
        default: false
    },
    
})

bookingSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

bookingSchema.set('toJSON', {
    virtuals: true,
});

exports.Booking= mongoose.model('Booking', bookingSchema);


  