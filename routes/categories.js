const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();
const response=require('../helpers/response');
const uploadOptions = require('../helpers/imageUpload');

router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find({status:false});

    if(!categoryList) {
        return  res.status(500).json(response(false,"Can not retrieve data",{}))
    } 
    return res.status(200).json(response(true,"All Categories",categoryList));
})

router.get('/:id', async(req,res)=>{
    const category = await Category.findById(req.params.id);
    if(category.status==false)
    {
        if(!category) {
            return  res.status(500).json(response(false,"The category with the given ID was not found.",{}))

         } 
         return res.status(200).json(response(true,"Category",category));
        }
    else
{
    return  res.status(400).json(response(false,"The category with the given ID was not found.",{}))

}
    
})



router.post('/', uploadOptions('uploads/categories').single('profile'),async (req,res)=>{

    const file = req.file;
    if(!file)  return  res.status(400).json(response(false,"Image required",{}))

    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/categories/`;

    let category = new Category({
        name: req.body.name,
        image: `${basePath}${fileName}`,
     })
    category = await category.save();

    if(!category)
     return  res.status(200).json(response(false,"the category cannot be created!",{}))

     return res.status(200).json(response(true,"Category created successfully",category));

 })



 router.delete('/:id', async (req, res)=>{


    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            
            status: true,
        },
        { new: true}
    )
    if(!category)
      return  res.status(400).json(response(false,"Category can not be delete",{}))


      return  res.status(200).json(response(true,"Category deleted successfully",category))
})


router.put('/:id',async (req, res)=> {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color,
        },
        { new: true}
    )

    if(!category)
    return res.status(400).send('the category cannot be created!')

    res.send(category);
})

module.exports =router;