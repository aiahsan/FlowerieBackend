const multer = require('multer');
let storageFolder="uploads";
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, `public/${storageFolder}`)
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })

 function uploadImage(path)
{
    if(path)
    {
        storageFolder=path;
    }
    else
    {
        storageFolder= 'uploads'
    }
    return multer({ storage: storage })
}
module.exports = uploadImage;