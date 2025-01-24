const {db} = require("../connect");
const moment = require("moment");

const createAbout = (req, res)=>{
    try {
        const {title, description, vision, mission, goal} = req.body;
        const q = 'INSERT INTO abouts (`title`, `description`, `vision`, `mission`, `goal`, `createdAt`, `updatedAt`) VALUES(?, ?, ?, ?, ?, ?, ?)';
        const date = moment().format("YYYY-MM-DD:HH:mm:ss");
        db.query(q, [title, description, vision, mission, goal, date, date], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(201).json({message:"Successfully created about"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateAbout = (req, res)=>{
    try {
        const {title, description, vision, mission, goal} = req.body;
        const date = moment().format("YYYY-MM-DD:HH:mm:ss");
        const q = `UPDATE abouts SET title =COALESCE(?, title), description = COALESCE(?, description), vision =COALESCE(?, vision), mission =COALESCE(?, mission), 
                    goal =COALESCE(?, goal), updatedAt = COALESCE(?, updatedAt) WHERE id = ?`;
        db.query(q, [title, description, vision, mission, goal, date, 1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json({message:"Successfully updated about"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getAbout = (req, res)=>{
    try {
        const q = 'SELECT * FROM abouts WHERE id = ?';
        db.query(q, [1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json(data[0]);
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteAbout = (req, res)=>{
    try {
        const q = 'DELETE * FROM abouts WHERE id = ?';
        db.query(q,[1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json({message:"Successfully deleted about data"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    createAbout,
    updateAbout,
    getAbout,
    deleteAbout
}