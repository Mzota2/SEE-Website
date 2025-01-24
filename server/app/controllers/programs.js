const {db} = require("../connect");
const moment = require("moment");

const createProgram = (req, res)=>{
    try {
        const {name, code} = req.body;
        const date = moment().format('YYYY-MM-DD:HH:mm:ss');
        const q = 'INSERT INTO programs (`name`, `code`, `createdAt`, `updatedAt`) VALUE (?, ?, ?, ?)';
        db.query(q, [name, code, date, date], (error,data)=>{
            if(error){ 
                return res.status(500).json(error);
            }
            else{
                return res.status(200).json({message:"Successfully created program"});
            }
            
        });
     
    
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateProgram = (req, res)=>{
    try {
        const {name, code} = req.body;
        const {id} = req?.params;
        const date = moment().format('YYYY-MM-DD:HH:mm:ss');
        const q = `UPDATE programs SET 
                name = COALESCE(?, name) , 
                code = COALESCE(?, code),
                updatedAt = COALESCE(?, updatedAt) WHERE id = ?`;
        db.query(q, [name, code, date, id], (error,data)=>{
            if(error){ 
                return res.status(500).json(error);
            }
            else{
                return res.status(200).json({message:"Successfully updated program"});
            }
            
        });
     
    
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getProgram = (req, res)=>{
    try {
        const {id} = req.params;
        const q = `SELECT * FROM programs WHERE id = ?`;
        db.query(q, [id], (error,data)=>{
            if(error) return res.status(500).json(error);
            return res.status(200).json(data[0]);
        })
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getAllPrograms = (req, res)=>{
    try {
        const q = `SELECT * FROM programs`;
        db.query(q, (error,data)=>{
            if(error) return res.status(500).json(error);
            return res.status(200).json(data);
        })
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteProgram = (req, res)=>{
    try {
        const {id} = req.params;
        const q = `DELETE FROM programs WHERE id = ?`;
        db.query(q, [id], (error,data)=>{
            if(error) return res.status(500).json(error);
            return res.status(200).json('deleted successfully');
        })
    } catch (error) {
       return res.status(500).json(error);
    }
}

module.exports={
    createProgram,
    getAllPrograms,
    updateProgram,
    getProgram,
    deleteProgram
}