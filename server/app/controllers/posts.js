const {db} = require("../connect");
const moment = require("moment");
const {uploadImage} = require("../file/uploads");
const { removeUploadedFile } = require("../file/manageFiles");
const path = require("path");

const createPost = (req, res)=>{
    try {
        uploadImage(req, res, (err, data)=>{
            if(err) return res.status(500).json(err);

            const {writer, editor, title, subTitle, description, category} = req.body;
            const date = moment().format('YYYY-MM-DD:HH:mm:ss');
            const q = 'INSERT INTO posts (`writer`, `editor`, `title`, `subTitle`, `description`, `category`, `coverImgUrl`, `createdAt`, `updatedAt`) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(q, [writer, editor, title, subTitle, description, category, req?.file?.filename, date, date], (error,data)=>{
                if(error){ 
                    removeUploadedFile(req?.file?.path);
                    return res.status(500).json(error);
                }
                else{
                    return res.status(200).json({message:"Successfully created post"});
                }
               
            });
        })
    
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updatePost = (req, res)=>{
    try {
        uploadImage(req, res, (err, data)=>{
            if(err) return res.status(500).json(err);

            const {writer, editor, title, subTitle, description, category} = req.body;
            const {id} = req?.params;
            const date = moment().format('YYYY-MM-DD:HH:mm:ss');
            const q = `UPDATE posts SET 
                        writer = COALESCE(?,writer), 
                        editor = COALESCE(?,editor), 
                        title= COALESCE(?, title), 
                        subTitle = COALESCE(?, subTitle), 
                        description =COALESCE(?, description), 
                        category = COALESCE(?, category),
                        coverImgUrl =COALESCE(?, coverImgUrl), 
                        updatedAt = COALESCE(?, updatedAt) WHERE id = ?`;

            const q2 = 'SELECT coverImgUrl FROM posts WHERE id = ?';

            db.query(q2, [id], (err, data)=>{
                if(err) return res.status(500).json(err);
                const filePath = data[0]?.coverImgUrl ? path?.resolve(__dirname, `../uploads/images/${data[0]?.coverImgUrl}`):null;
                filePath ? removeUploadedFile(filePath):'';
                db.query(q, [writer, editor, title, subTitle, description, category, req?.file?.filename, date, id], (error,data)=>{
                    if(error){ 
                        removeUploadedFile(req?.file?.path);
                        return res.status(500).json(error);
                    }
                    else{
                        return res.status(200).json({message:'Successfully updated post'});
                    }
                   
                });
            })
        })
    
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getPost = (req, res)=>{
    try {
        const {id} = req.params;
        const q = `SELECT * FROM posts WHERE id = ?`;
        db.query(q, [id], (error,data)=>{
            if(error) return res.status(500).json(error);
            return res.status(200).json(data[0]);
        })
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getAllPosts = (req, res)=>{
    try {
        const q = `SELECT * FROM posts`;
        db.query(q, (error,data)=>{
            if(error) return res.status(500).json(error);
            return res.status(200).json(data);
        })
    } catch (error) {
        res.status(500).json(error);
    }
}

const deletePost = (req, res)=>{
    try {
        const {id} = req.params;
        const q = `DELETE FROM posts WHERE id = ?`;
        db.query(q, [id], (error,data)=>{
            if(error) return res.status(500).json(error);
            return res.status(200).json('deleted successfully');
        })
    } catch (error) {
       return res.status(500).json(error);
    }
}

module.exports={
    createPost,
    updatePost,
    getAllPosts,
    getPost,
    deletePost
}