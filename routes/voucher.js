const {Voucher} = require('../models/voucher');
const express = require('express');
const router = express.Router();
const response=require('../helpers/response');

router.get(`/`, async (req, res) =>{
    const voucherList = await Voucher.find({status:false});

    if(!voucherList) {
        return  res.status(500).json(response(false,"Can not retrieve data",{}))
    } 
    return res.status(200).json(response(true,"All vouchers",voucherList));

})

router.get('/:id', async(req,res)=>{
    const voucher = await Voucher.findById(req.params.id);
    if(!voucher) {
        return  res.status(500).json(response(false,"The voucher with the given ID was not found.",{}))
    } 
    if(voucher.status==false)
    {
        return  res.status(200).json(response(true,"The voucher with the given ID",voucher))

    }
    else
    {
        return  res.status(400).json(response(false,"The voucher with the given ID was not found.",{}))

    }
})



router.post('/', async (req,res)=>{
    let voucher = new Voucher({
        name: req.body.name,
        discountPer: req.body.discountPer,
        expiryDate: req.body.expiryDate,
        quantity: req.body.quantity
    })
    voucher = await voucher.save();

    if(!voucher)
    return  res.status(400).json(response(false,"the voucher cannot be created!",{}))

    return  res.status(200).json(response(true,"the voucher created successfully",voucher))

 })


router.put('/:id',async (req, res)=> {
    const voucher = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body?.name || voucher.name,
            discountPer: req.body?.discountPer || voucher.discountPer,
            expiryDate: req.body?.expiryDate || voucher.expiryDate,
            quantity: req.body?.quantity || voucher.quantity,

         },
        { new: true}
    )

    if(!voucher)
    return  res.status(400).json(response(false,"the voucher cannot be created!",{}))

 
    return res.status(200).json(response(true,"Voucher updated successfully",voucher));
})

router.delete('/:id', async (req, res)=>{


    const voucher = await Voucher.findByIdAndUpdate(
        req.params.id,
        {
            
            status: true,
        },
        { new: true}
    )
    if(!voucher)
      return  res.status(400).json(response(false,"Voucher can not be delete",{}))


      return  res.status(200).json(response(true,"Voucher deleted successfully",service))
})
module.exports =router;