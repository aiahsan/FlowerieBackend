const mongoose = require('mongoose');

const vouchersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    discountPer: {
        type: Number,
        required: true,
        default:0
    },
    expiryDate: {
        type: Date,
         default:Date.now()
    },
    quantity:{
        type: Number,
        required: true,
        default:0
    },
    status: {
        type: Boolean,
        default: false
    },
})


vouchersSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

vouchersSchema.set('toJSON', {
    virtuals: true,
});

exports.Voucher = mongoose.model('Voucher', vouchersSchema);
