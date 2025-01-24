const {db} = require("../connect");
const moment = require("moment");

const createTeam = (req, res)=>{
    try {
        const {title, description} = req.body;
        const q = 'INSERT INTO teams (`title`, `description`, `createdAt`, `updatedAt`) VALUES(?, ?, ?, ?)';
        const date = moment().format("YYYY-MM-DD:HH:mm:ss");
        db.query(q, [title, description, date, date], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(201).json({message:"Successfully created team"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateTeam = (req, res)=>{
    try {
        const {title, description} = req.body;
        const date = moment().format("YYYY-MM-DD:HH:mm:ss");
        const q = 'UPDATE teams SET title =COALESCE(?, title), description = COALESCE(?, description), updatedAt = COALESCE(?, updatedAt) WHERE id = ?';
        db.query(q, [title, description, date, 1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json({message:"Successfully updated team"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getTeam = (req, res)=>{
    try {
        const q = 'SELECT * FROM teams WHERE id = ?';
        db.query(q, [1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json(data[0]);
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteTeam = (req, res)=>{
    try {
        const q = 'DELETE * FROM teams WHERE id = ?';
        db.query(q,[1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json({message:"Successfully deleted blog data"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    createTeam,
    updateTeam,
    getTeam,
    deleteTeam
}