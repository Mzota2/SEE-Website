const {db} = require("../connect");
const moment = require("moment");
const { uploadImage } = require("../file/uploads");
const { removeUploadedFile } = require("../file/manageFiles");
const path = require("path");

const createHome = (req, res)=>{
    try {
        uploadImage(req, res, (err, data)=>{
            if(err) return res.status(500).json(data);
            const {title, description} = req.body;
            const q = 'INSERT INTO homes (`title`, `description`, `coverImgUrl`, `createdAt`, `updatedAt`) VALUES(?, ?, ?, ?, ?)';
            const date = moment().format("YYYY-MM-DD:HH:mm:ss");
            db.query(q, [title, description, req?.file?.filename, date, date], (err, data)=>{
                if(err) {
                    removeUploadedFile(req?.file?.path);
                    return res.status(500).json(err)
                }
                else{
                    return res.status(201).json({message:"Successfully created home data"});
                }
                
            })
        })
        
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateHome = (req, res)=>{
    try {
        uploadImage(req, res, (err, data)=>{
        
            if(err) return res.status(500).json(err);
            const {id} = req?.params;
            const {title, description} = req.body;
            const date = moment().format("YYYY-MM-DD:HH:mm:ss");
            const q = `UPDATE homes SET 
                        title = COALESCE(?, title), 
                        description = COALESCE(?, description),
                        coverImgUrl = COALESCE(?, coverImgUrl), 
                        updatedAt = COALESCE(?, updatedAt) WHERE id = ?`;
            if(!req?.file?.path){
                db.query(q, [title, description, req?.file?.path, date, id], (err, data)=>{
                    if(err) return res.status(500).json(err)
                    return res.status(200).json({message:'Successfully updated home data'});
                });
            }
            else{
                const q2 = 'SELECT coverImgUrl FROM homes WHERE id = ?';
                db.query(q2, [id], (err, data)=>{
                    if(err) return res.status(500).json(err);
                    const filePath = data[0]?.coverImgUrl ? path.resolve(__dirname, `../uploads/images/${data[0]?.coverImgUrl}`):null;
                    filePath? removeUploadedFile(filePath):'';
                    db.query(q, [title, description, req?.file?.path, date, id], (err, data)=>{
                        if(err) {
                            removeUploadedFile(req?.file?.path);
                            return res.status(500).json(err);
                        }
                        else{
                            return res.status(200).json({message:"Successfully updated home data"});
                        }
                        
                    });
                })
            }
        })
        
        
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getHomes = (req, res)=>{
    try {
        const q = 'SELECT * FROM homes';
        db.query(q, (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json(data);
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteHome = (req, res)=>{
    try {
        const {id} = req?.params;
        const q = 'DELETE * FROM homes WHERE id = ?';
        db.query(q,[id], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json({message:"Successfully deleted home data"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    createHome,
    updateHome,
    getHomes,
    deleteHome
}