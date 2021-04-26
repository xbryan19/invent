
const multer = require('multer')
const fs = require('fs-extra')

const UploadFilestorage = multer.diskStorage(
    {
      destination: (req, file, cb ) => {
        try {
         let dir =`./upload/`
          // console.log(dir)
          fs.mkdirSync(dir, { recursive: true })
          return cb(null, dir)
        } catch (error) {
          console.log(error)
        }
      },
      filename: function ( req, file, cb ) {
        cb(null, file.originalname)
      }
    }
  )   

//   const UpdateuploadFile = multer({storage: UploadFilestorage})

  module.exports = multer({
    storage: UploadFilestorage //storage property 
  })