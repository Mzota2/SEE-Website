const fs = require('fs');
const path = require('path');
const {db}= require('../connect');

const removeUploadedFile = (filePath) => {
  fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
      return 0;
  });
};

// Directory paths
const imagesDir = path.join(__dirname, '../uploads/images');
const audioDir = path.join(__dirname, '../uploads/audios');


const handleDeleteImages = (itemName, databaseImageFiles)=>{
  if(databaseImageFiles?.length){
    let index;
    for (index = 0; index < databaseImageFiles.length; index++) {
      const image = databaseImageFiles[index]?.slice(15);
      if(image === itemName){
        break;
      }
    }
    if(index === databaseImageFiles?.length){
      const filepath = path.join(__dirname, `../uploads/images/${itemName}`);
      removeUploadedFile(filepath);
    }
    
  }else{
    const filepath = path.join(__dirname, `../uploads/images/${itemName}`);
    removeUploadedFile(filepath);
  }
}

const handleDeleteAudios = (itemName, databaseAudioFiles)=>{
  if(databaseAudioFiles?.length){
    let index;
    for (index = 0; index < databaseAudioFiles.length; index++) {
      const audio = databaseAudioFiles[index]?.slice(15);
      if(audio === itemName){
        break;
      }
    }
    if(index === databaseAudioFiles?.length){
      const filepath = path.join(__dirname, `../uploads/audios/${itemName}`);
      removeUploadedFile(filepath);
    }
    
  }else{
    const filepath = path.join(__dirname, `../uploads/audios/${itemName}`);
    removeUploadedFile(filepath);
  }
}

const clearSystem = (req, res)=>{
  try {
    const imageFiles = fs.readdirSync(imagesDir);
    const audioFiles = fs.readdirSync(audioDir);
    
    const q1 = `SELECT profile_img_url FROM users`;
    const q2 = `SELECT cover_img_url FROM albums`;
    const q3 = `SELECT cover_img_url, file_url FROM songs`;
    const q4 = `SELECT cover_img_url FROM events`;
    const q5 = `SELECT profile_img_url FROM artists`;

    

    db.query(q1, (error, users)=>{
      if(error) return res.status(500);
       db.query(q2, (error, albums)=>{
        if(error) return res.status(500);
        db.query(q3, (error, songs)=>{
          if(error) return res.status(500);
          db.query(q4, (error, events)=>{
            if(error) return res.status(500);
            db.query(q5, (error, artists)=>{
              if(error) return res.status(500);
              var databaseImageFiles = [];
              var databaseAudioFiles = [];
              users?.forEach(item =>{
                const {profile_img_url} = item;
                databaseImageFiles.push(profile_img_url);
              });
              artists?.forEach(item =>{
                const {profile_img_url} = item;
                databaseImageFiles.push(profile_img_url);
              });
              albums?.forEach(item =>{
                const {cover_img_url} = item;
                databaseImageFiles.push(cover_img_url);
              });

              songs?.forEach(item =>{
                const {cover_img_url, file_url} = item;
                databaseImageFiles.push(cover_img_url);
                databaseAudioFiles.push(file_url);
              });

              events?.forEach(item =>{
                const {cover_img_url} = item;
                databaseImageFiles.push(cover_img_url);
              });

              //
              if(imageFiles.length){
                imageFiles?.forEach((item)=>{ 
                  handleDeleteImages(item, databaseImageFiles);
                  
                })
              }
              if(audioFiles.length){
                audioFiles?.forEach((item)=>{ 
                  handleDeleteAudios(item, databaseAudioFiles);
                })
              }

              return res.json("Successfully cleared the system")
              
            });
          });
        });
      });
    });
 

 
    
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}



module.exports ={
    clearSystem,
    removeUploadedFile
}