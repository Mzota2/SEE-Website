const {db} = require("../connect");
const {uploadImage} = require("../file/uploads");
const {removeUploadedFile} = require("../file/manageFiles");
const moment = require("moment");
const path = require("path");
const {hash} = require("bcrypt")

const Register = (req, res)=>{
    try {
        const {email, phone, reg_number, program, year, is_registered, full_name} = req.body;

        uploadImage(res, req, (err, data)=>{
            if(err) return res.status(500).json(err);
            const q = `INSERT INTO students
             email =? , reg_number =?, phone = ? , program = ?,
             year = ? , is_registered = ?, full_name = ?, password = ?,
             receipt_url = ?, created_at = ?, updated_at = ?
             `;

            const hashedPwd = hash(password, 10);
            const date = moment();
            
            db.query(q, [email, reg_number, phone, program, year, is_registered, full_name, hashedPwd, req?.file?.filename, date , date ], (err, data)=>{
                if(err){
                    removeUploadedFile(req?.file?.path);
                    return res.status(500).json(err);
                }
                else{
                    return res.status(201).json("Registered successfully")
                }
            })
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const Update = (req, res)=>{
    try {

        const {email, password, phone, reg_number, program, year, is_registered, full_name} = req.body;
        const q = `UPDATE students SET
            email = COALESCE(email,  ?),
            phone = COALESCE(phone, ?),
            password = COALESCE(password, ?),
            reg_number = COALESCE(reg_number , ?),
            program = COALESCE(program, ?),
            year = COALESCE(year, ?),
            is_registered = COALESCE(is_registered, ?),
            full_name = COALESCE(full_name, ?),
            receipt_url = COALESCE(receipt_url, ?),
            updated_at = COALESCE(updated_at, ?)
            `;
            const hashedPwd = hash(password, 10);
        if(!req?.file?.path){
         
           const date = moment();
           console.log(date);
           db.query(q, [email, phone, hashedPwd, reg_number, program, year, is_registered, full_name, req?.file?.filename, date], (err, data)=>{
               if(err){
                   removeUploadedFile(req?.file?.path);
                   return res.status(500).json(err);
               }
               else{
                   return res.status(201).json("Updated successfully");
               }
           })

        }else{

            uploadImage(res, req, (err, data)=>{
                if(err) return res.status(500).json(err);
                
                const date = moment();
                console.log(date);
                
                db.query(q, [email, 
                    phone, hashedPwd, reg_number, program, year, is_registered, full_name, req?.file?.filename, date , date ], (err, data)=>{
                    if(err){
                        removeUploadedFile(req?.file?.path);
                        return res.status(500).json(err);
                    }
                    else{
                        return res.status(201).json("Registered successfully")
                    }
                })
            })
        }
        
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const Delete = (req, res)=>{
    try {
        const {id} = req?.params;
        const q = 'DELETE * FROM students WHERE id = ?';
        const q1 = 'SELECT receipt_url FROM students WHERE id = ?';
        db.query(q1, [id], (err, student)=>{
            if(err) return res.status(500).json(err);
            db.query(q, [id], (err, data)=>{
                if(err) return res.status(500).json(err);
                const filePath = path.join(__dirname, `../uploads/images/${student?.receipt_url}`);
                removeUploadedFile(filePath)
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

        const {id}= req?.params;
        const q = 'SELECT * FROM students WHERE id = ?';
    
        db.query(q, [id], (err, data)=>{
            if(err) return res.status(500).json(data);
            const {password, ...other} = data[0];
            return res.status(200).json(other);
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    Register,
    Update,
    Delete,
    GetAll,
    GetStudent
}