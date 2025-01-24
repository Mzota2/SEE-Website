const {db} = require("../connect");
const moment = require("moment");
const { uploadImage } = require("../file/uploads");
const { removeUploadedFile } = require("../file/manageFiles");
const path = require("path");

const createLeader = (req, res)=>{
    try {
        uploadImage(req, res, (err, data)=>{
            const {position, studentId} = req.body;
            const q = 'INSERT INTO leaders (`position`, `profileImgUrl`, `studentId`, `createdAt`, `updatedAt`) VALUES(?, ?, ?, ?, ?)';
            const date = moment().format("YYYY-MM-DD:HH:mm:ss");
            db.query(q, [position, req?.file?.filename, studentId, date, date], (err, data)=>{
                if(err) {
                    removeUploadedFile(req?.file?.path);
                    return res.status(500).json(err)
                }
                else{
                    return res.status(201).json({message:"Successfully added leader"});
                }
                
            })
        })
        
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateLeader = (req, res)=>{
    try {
        uploadImage(req, res, (err, data)=>{
            const {position, studentId} = req.body;
            const {id} = req?.params;
            const date = moment().format("YYYY-MM-DD:HH:mm:ss");
            const q = `UPDATE leaders SET 
                        position = COALESCE(?, position), 
                        profileImgUrl= COALESCE(?, profileImgUrl), 
                        studentId = COALESCE(?, studentId), 
                        updatedAt = COALESCE(?, updatedAt) WHERE id = ?`;
            if(!req?.file?.path){
                db.query(q, [position,req?.file?.filename, studentId, date, id], (err, data)=>{
                    if(err) return res.status(500).json(err)
                    return res.status(200).json({message:"Successfully updated leader"});
                })
            }
            else{
                const q2 = 'SELECT profileImgUrl FROM leaders WHERE id = ?';
                db.query(q2, [id], (err, data)=>{
                    if(err) return res.status(500).json(err);
                    const filePath = data[0]?.profileImgUrl ? path.resolve(__dirname, `../uploads/images/${data[0]?.profileImgUrl}`):null;
                    filePath? removeUploadedFile(filePath):'';
                    db.query(q, [position, req?.file?.filename, studentId, date, id], (err, data)=>{
                        if(err){ 
                            removeUploadedFile(req?.file?.path);
                            return res.status(500).json(err)
                        }
                        else{
                            return res.status(200).json({message:'Successfully updated leader'});
                        }
                        
                    })

                })
                
            }
            
        })
        
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getLeaders = (req, res)=>{
    try {
        const q = 'SELECT * FROM leaders';
        db.query(q, (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json(data);
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteLeader = (req, res)=>{
    try {
        const {id} = req?.params;
        const q = 'DELETE * FROM leaders WHERE id = ?';
        db.query(q,[id], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json({message:"Successfully deleted leader"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    createLeader,
    updateLeader,
    getLeaders,
    deleteLeader
}