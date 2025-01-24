const {db} = require("../connect");
const moment = require("moment");

const createBlog = (req, res)=>{
    try {
        const {title, description} = req.body;
        const q = 'INSERT INTO blogs (`title`, `description`, `createdAt`, `updatedAt`) VALUES(?, ?, ?, ?)';
        const date = moment().format("YYYY-MM-DD:HH:mm:ss");
        db.query(q, [title, description, date, date], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(201).json({message:"Successfully created blog data"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateBlog = (req, res)=>{
    try {
        const {title, description} = req.body;
        const date = moment().format("YYYY-MM-DD:HH:mm:ss");
        const q = 'UPDATE blogs SET title =COALESCE(?, title), description = COALESCE(?, description), updatedAt = COALESCE(?, updatedAt) WHERE id = ?';
        db.query(q, [title, description, date, 1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json({message:'Successfully updated Blog'});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getBlog = (req, res)=>{
    try {
        const q = 'SELECT * FROM blogs WHERE id = ?';
        db.query(q, [1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json(data[0]);
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteBlog = (req, res)=>{
    try {
        const q = 'DELETE * FROM blogs WHERE id = ?';
        db.query(q,[1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json({message:"Successfully deleted blog data"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    deleteBlog
}