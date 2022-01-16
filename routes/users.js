const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response=require('../helpers/response');
const uploadOptions = require('../helpers/imageUpload');




router.post('/register',uploadOptions('uploads/users').single('profile'), async (req,res)=>{

    const file = req.file;
     if(!file)  return  res.status(400).json(response(false,"Image required",{}))
    const userExisit=await User.findOne({email:req.body.email});
    if(!userExisit)
    {
        const fileName = file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/users/`;
         let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            roles: req.body.roles ? JSON.parse(req.body.roles) : ["user"],
            profile: `${basePath}${fileName}`,
            
        })
        user = await user.save();
    
        if(!user)
        return res.status(400).json(response(false,"the user cannot be created!",{}))
    
        return res.status(200).json(response(true,"User created successfully",user))
    }
    else
    {        
        return res.status(400).json(response(false,"Email already exsist",{}))

    }
     
})

router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!user) {
        
        return  res.status(400).json(response(false,"The user not found",{}))

 
    }

    if(user.status==false)
    {
        if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign(
                {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    profile: user.profile,
                    roles: user.roles,
                    latitude: user?.latitude || 0,
                    longitude: user?.longitude || 0,
                    id:user.id
                },
                secret,
                {expiresIn : '365d'}
            )
           
            return res.status(200).json(response(true,"Login successful",{
                token
            }));
    
        } else {
            return  res.status(400).json(response(false,"password is wrong!",{}))
    
        }
    }
    else return  res.status(400).json(response(false,"your account is terminated contact support",{}))


    
})

router.get(`/`, async (req, res) =>{
    const userList = await User.find({status:false}).select('-passwordHash');

    if(!userList) {
        return   res.status(500).json(response(false,"Can not retrieve data",{}))
    } 
    return  res.status(200).json(response(true,"All Users",userList));
})
router.get('/:id', async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        return  res.status(500).json(response(false,"The user with the given ID was not found.",{}))
    } 
    if(user.status==false)
    return  res.status(200).json(response(true,"The user with the given ID",user));
    else  
    return  res.status(400).json(response(false,"The user with the given ID is deleted",user))

})

router.post('/',uploadOptions('uploads/users').single('profile'), async (req,res)=>{
   
    const file = req.file;
     if(!file)  return  res.status(400).json(response(false,"Image required",{}))
    const userExisit=await User.findOne({email:req.body.email});
     if(!userExisit)
    {
        const fileName = file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/users/`;
         let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            roles: req.body.roles ? JSON.parse(req.body.roles) : ["user"],
            profile: `${basePath}${fileName}`,
            
        })
        user = await user.save();
    
        if(!user)
        return res.status(400).json(response(false,"the user cannot be created!",{}))
    
        return res.status(200).json(response(true,"User created successfully",user))
    }
    else
    {        
        return res.status(400).json(response(false,"Email already exsist",{}))

    }
})

router.put('/:id',async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})




router.delete('/:id', async (req, res)=>{


    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            
            status: true,
        },
        { new: true}
    )
    if(!user)
      return  res.status(400).json(response(false,"User can not be delete",{}))


      return  res.status(200).json(response(true,"User deleted successfully",user))
})

router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})


module.exports =router;