const {db} = require("../connect");
const {uploadImage, uploadImages} = require("../file/uploads");
const {removeUploadedFile} = require("../file/manageFiles");
const moment = require("moment");
const path = require("path");
const {hash} = require("bcrypt")


const Update = (req, res)=>{
    try {
        uploadImages(req, res, (err, data)=>{

            const {email, password, phone, regNumber, programId, year, isRegistered, isSubscribed, firstname, surname} = req.body;
            const {id} = req?.params;
            console.log(firstname);
            const q = `UPDATE students SET
                email = COALESCE(?,  email),
                firstname = COALESCE(?, firstname),
                surname = COALESCE(?, surname),
                phone = COALESCE(?, phone),
                password = COALESCE(?, password),
                regNumber = COALESCE(?, regNumber),
                programId = COALESCE(?, programId),
                year = COALESCE(?, year),
                isRegistered = COALESCE(?, isRegistered),
                isSubscribed = COALESCE(?, isSubscribed),
                regProofUrl = COALESCE(?, regProofUrl),
                subProofUrl = COALESCE(?, subProofUrl),
                updatedAt = COALESCE(?, updatedAt)
                WHERE id = ?
                `;
            var hashedPwd;
            if(password?.length){
                hashedPwd = hash(password, 10);
            }
            
            if(err) return res.status(500).json(err);

            const date = moment().format("YYYY-MM-DD:HH:mm:ss");
            const files = req?.files;
            const subImage = files.subscription? files.subscription[0].filename : null;
            const regImage = files.registration ? files.registration[0].filename : null;
           
            if(!subImage && !regImage){
                const date = moment().format('YYYY-MM-DD:HH:mm:ss');
                db.query(q, [email, firstname, surname, phone, hashedPwd, regNumber, programId, year, isRegistered, isSubscribed, regImage, subImage, date, id], (err, data)=>{
                    if(err){
                        return res.status(500).json(err);
                    }
                    else{
                        console.log(data);
                        return res.status(201).json("Updated successfully");
                    }
                })
            }
            else{
                const q2 = 'SELECT subProofUrl, regProofUrl FROM students WHERE id = ?';
                db.query(q2, [id], (err, data)=>{
                    if(err) return res.status(500).json(err);
                    const subPath = data[0]?.subProofUrl ? path.resolve(__dirname, `../uploads/images/${data[0]?.subProofUrl}`):null;
                    const regPath = data[0]?.regProofUrl ? path.resolve(__dirname, `../uploads/images/${data[0]?.regProofUrl}`):null;
                    subPath ? removeUploadedFile(subPath):'';
                    regPath ? removeUploadedFile(regPath):'';
                    db.query(q, [email, firstname, surname, phone, hashedPwd, regNumber, programId, year, isRegistered, isSubscribed, regImage, subImage, date, id], (err, data)=>{
                        if(err){
                            const subPath = files.subscription? files.subscription[0].path : null;
                            const regPath = files.registration ? files.registration[0].path : null;
                            subPath ? removeUploadedFile(subPath):'';
                            regPath ? removeUploadedFile(regPath): '';
                            return res.status(500).json(err);
                        }
                        else{
                            console.log(data);
                            return res.status(201).json("Updated successfully")
                        }
                    })
                })
                
            }
            
            
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const Delete = (req, res)=>{
    try {
        const {id} = req?.params;
        const q = 'DELETE * FROM students WHERE id = ?';
        const q1 = 'SELECT regProofUrl, subProofUrl, FROM students WHERE id = ?';
        db.query(q1, [id], (err, student)=>{
            if(err) return res.status(500).json(err);
            db.query(q, [id], (err, data)=>{
                if(err) return res.status(500).json(err);
                const regPath = path.join(__dirname, `../uploads/images/${student?.regProofUrl}`);
                const subPath = path.join(__dirname, `../uploads/images/${student?.subProofUrl}`);
                removeUploadedFile(regPath);
                removeUploadedFile(subPath)
            })
            
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const GetAll = (req, res)=>{
    try {
        const q = 'SELECT * FROM students';
        db.query(q, (err, data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json(data);
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}


const GetStudent = (req, res)=>{
    try {
        const id  = req?.id;
        const q = 'SELECT * FROM students WHERE id = ?';
        db.query(q, [id], (err, data)=>{
            if(err) return res.status(500).json(data);
            if(data?.length){
                const {password, accountToken, passwordToken, regProofUrl, subProofUrl, ...other} = data[0];
                return res.status(200).json(other);
            }
            else{
                return res.status(200).json({});
            }
            
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    Update,
    Delete,
    GetAll,
    GetStudent
}