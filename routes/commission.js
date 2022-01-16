const {Commission} = require('../models/commission');
const express = require('express');
const router = express.Router();
const response=require('../helpers/response');

router.get(`/`, async (req, res) =>{
    const commissionList = await Commission.find({status:false});

    if(!commissionList) {
        return  res.status(500).json(response(false,"Can not retrieve data",{}))
    } 
    return res.status(200).json(response(true,"All Commissions",commissionList));


})

router.get('/:id', async(req,res)=>{
    const commission = await Commission.findById(req.params.id);
    if(!commission) {
        return  res.status(500).json(response(false,"The commission with the given ID was not found.",{}))
    } 
    if(commission.status==false)
    {
        return  res.status(200).json(response(true,"The commission with the given ID",commission))

    }
    else
    {
        return  res.status(400).json(response(false,"The commission with the given ID was not found.",{}))

    }
   
})



router.post('/', async (req,res)=>{
    let commission = new Commission({
        category: req.body.category,
        ratePer: req.body.ratePer,
     })
    commission = await commission.save();

    if(!commission)
     return  res.status(400).json(response(false,"the category cannot be created!",{}))

     return  res.status(200).json(response(true,"the category cannot be created!",commission))

 })


router.put('/:id',async (req, res)=> {
    const commission = await Commission.findByIdAndUpdate(
        req.params.id,
        {
            commission: req.body.commission,
            ratePer: req.body.ratePer || commission.ratePer,
            
        },
        { new: true}
    )

    if(!commission)
     return  res.status(400).json(response(false,"the commission cannot be updated!",{}))

     return res.status(200).json(response(true,"Commission updated successfully",commission));
    })


router.delete('/:id', async (req, res)=>{


        const commission = await Commission.findByIdAndUpdate(
            req.params.id,
            {
                
                status: true,
            },
            { new: true}
        )
        if(!commission)
          return  res.status(400).json(response(false,"commission can not be delete",{}))
    
    
          return  res.status(200).json(response(true,"commission deleted successfully",commission))
    })

module.exports =router;