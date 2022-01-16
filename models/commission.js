const mongoose = require('mongoose');

const commissionSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    ratePer: {
        type: Number,
        default:0,
        required:true
    },
    status: {
        type: Boolean,
        default: false
    },
})


commissionSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commissionSchema.set('toJSON', {
    virtuals: true,
});

exports.Commission = mongoose.model('Commission', commissionSchema);
