const {Booking} = require('../models/booking');
const express = require('express');
 const router = express.Router();
 const response=require('../helpers/response');
 const pSub=require('../helpers/percentageSubtract');

router.get(`/`, async (req, res) =>{
    const bookingList = await Booking.find({status:false}).populate('bookingBy').populate('services').populate('vouchers');

    if(!bookingList) {
        return  res.status(500).json(response(false,"Can not retrieve data",{}))
    } 
    return res.status(200).json(response(true,"All Bookings",bookingList));
})

router.get(`/:id`, async (req, res) =>{
    const booking = await Booking.findById(req.params.id)
    .populate('bookingBy').populate('services').populate('vouchers')
    // .populate({ 
    //     path: 'orderItems', populate: {
    //         path : 'product', populate: 'category'} 
    //     });
    
    if(!booking) {
        return  res.status(500).json(response(false,"Can not retrieve data",{}))

    } 
    if(booking.status==false)
    {
        return  res.status(200).json(response(true,"Booking",booking))

    }
    else
    {
        return  res.status(400).json(response(false,"Booking not found",{}))

    }
})

router.post('/', async (req,res)=>{
    let total=parseFloat(req.body.total);
    let vouchersPrice=0;
    vouchersPrice+=req.body.vouchers.map(x=>{ 
        return pSub(total,x.discountPer)
    });
    let discountPer=req.body?.discountPer || 0;

    let subTotal=total-vouchersPrice-pSub(total-discountPer);
    let vat=req.body?.vat || 0;
    subTotal=subTotal-pSub(subTotal-vat);
    let commissionRate=req.body?.commissionRate||0;
    let subTotalAfterCommission=subTotal-pSub(subTotal-commissionRate);
    let commissionDeducted=subTotal-subTotalAfterCommission;

    let booking = new Booking({
        bookingAddress: req.body.bookingAddress,
        bookingBy: req.body.bookingBy,
        services: req.body.services,
        bookingContact: req.body.bookingContact,
        total,
        discountPer,
        subTotal,
        vouchers:req.body.vouchers,
        vat,
        subTotalAfterCommission,
        commissionRate,
        commissionDeducted,
        bookingdate: req.body.bookingdate,
         
 
    })
    booking = await booking.save();

    if(!booking)
    return  res.status(500).json(response(false,"the booking cannot be created!",{}));

    else
    {
        const vouchers = Promise.all(req.body.vouchers.map(async (voucher) =>{
            return  await Voucher.findByIdAndUpdate(
                voucher.id,
                {
                    quantity: voucher.quantity>0?voucher.quantity-1:voucher.quantity
                },
                { new: true}
            )
        
    
            
    
            
        }))
        const vouchersIdsResolved =  await vouchers;
        
        return  res.status(200).json(response(true,"Booking created successfully",booking));

    }

 })

router.delete('/:id', async (req, res)=>{


    const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        {
            
            status: true,
        },
        { new: true}
    )
    if(!user)
      return  res.status(400).json(response(false,"Booking can not be delete",{}))


      return  res.status(200).json(response(true,"Booking deleted successfully",user))
})

router.get(`/get/userbooking/:userid`, async (req, res) =>{
    const userBookingList = await Booking.find({user: req.params.userid,status:false}).populate('bookingBy').populate('services').populate('vouchers');

    if(!userBookingList) {
        return  res.status(500).json(response(false,"Can not retrieve data",{}))

    } 
    return res.status(200).json(response(true,"Users Bookings",userBookingList));
})




router.put('/:id',async (req, res)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true}
    )

    if(!order)
    return res.status(400).send('the order cannot be update!')

    res.send(order);
})


module.exports =router;