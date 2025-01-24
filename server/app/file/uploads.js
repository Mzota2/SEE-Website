const multer = require('multer');

const storageImage = multer.diskStorage({
    destination:'uploads/images',
    filename:(req, file, callback)=>{
        callback(null, Date.now() +"-"+ file.originalname);
    }
});


const fileFilterImages = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
    if (allowedTypes.includes(file.mimetype)) {
      // Accept the file
      cb(null, true);
    } else {
      // Reject the file with an error
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
  };

const uploadImage = multer({
    storage:storageImage,
    fileFilter:fileFilterImages
}).single('file');


const uploadImages = multer({
  storage:storageImage,
  fileFilter:fileFilterImages
}).fields([
  {name:'subscription', maxCount:1},
  {name:'registration', maxCount:1}
])


module.exports ={
    uploadImage,
    uploadImages
}