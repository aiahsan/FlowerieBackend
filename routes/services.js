const {Service} = require('../models/service');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const uploadOptions = require('../helpers/imageUpload');
const response=require('../helpers/response');

 
router.get(`/`, async (req, res) =>{
    
    const serviceList = await Service.find({
        status:false
    }).populate('category').populate('serviceBy');

    if(!serviceList) {
        return  res.status(500).json(response(false,"Can not retrieve data",{}))
    } 
    return res.status(200).json(response(true,"All Services",serviceList));
})

router.get(`/:id`, async (req, res) =>{
    const service = await Service.findById(req.params.id).populate('category').populate('serviceBy');
    if(service.status==false)
    {
        if(!service) {
            return  res.status(500).json(response(false,"Can not retrieve data",{}))
        } 
        return res.status(200).json(response(true,"Service",service));
    }
    else
    {
        return  res.status(400).json(response(false,"Service Can not be retrieved",{}))

    }
    
})

router.post(`/`,  uploadOptions('uploads/services').array('images', 10), async (req, res) =>{
 
    const file = req.file;
    if(!file) return  res.status(400).json(response(false,"No image in the request",{}))

     let imagesPaths = [];
    
    if(files) {
        files.map(file =>{
            imagesPaths.push(`${basePath}${file.filename}`);
        })
     }
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/services/`;
    let service = new Service({
        images: imagesPaths, 

        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        price: req.body.price,
        latitude: req.body?.latitude || 0,
        longitude: req.body?.longitude || 0,
        category: req.body.category,
        serviceBy: req.body.serviceBy 
    })

    service = await service.save();

    if(!service) 
     return  res.status(500).json(response(false,"The service cannot be created",{}))

     return res.status(200).json(response(true,"Service created successfully",service));

}) 
router.delete('/:id', async (req, res)=>{


    const service = await Service.findByIdAndUpdate(
        req.params.id,
        {
            
            status: true,
        },
        { new: true}
    )
    if(!service)
      return  res.status(400).json(response(false,"service can not be delete",{}))


      return  res.status(200).json(response(true,"service deleted successfully",service))
})

 
router.put(
    '/gallery-images/:id', 
    uploadOptions.array('images', 10), 
    async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return  res.status(400).json(response(false,"Invalid service Id",{}))

          }
         const files = req.files
         let imagesPaths = [];
         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

         if(files) {
            files.map(file =>{
                imagesPaths.push(`${basePath}${file.filename}`);
            })
         }

         const service = await Service.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true}
        )

        if(!service)
        return  res.status(500).json(response(false,"the gallery cannot be updated!",{}))

        return res.status(200).json(response(true,"the gallery updated successfully",service));

    }
) 
router.put('/:id',async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
       return res.status(400).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true}
    )

    if(!product)
    return res.status(500).send('the product cannot be updated!')

    res.send(product);
})
module.exports =router;