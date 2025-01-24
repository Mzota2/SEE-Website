const {db} = require("../connect");
const moment = require("moment");

const createContact = (req, res)=>{
    try {
        const {title, description,physicalAddress, location, email, phone, facebookUrl, xUrl, linkedInUrl, instagramUrl, tiktokUrl, whatsAppUrl } = req.body;
        const q = 'INSERT INTO contacts (`title`, `description`, `physicalAddress`, `location`, `email`, `phone`, `facebookUrl`, `xUrl`, `linkedInUrl`, `instagramUrl`, `tiktokUrl`, `whatsAppUrl`, `createdAt`, `updatedAt`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?)';
        const date = moment().format("YYYY-MM-DD:HH:mm:ss");
        db.query(q, [title, description, physicalAddress, location, email, phone, facebookUrl, xUrl, linkedInUrl, instagramUrl, tiktokUrl, whatsAppUrl,  date, date], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(201).json({message:"Successfully created contact"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateContact = (req, res)=>{
    try {
        const {title, description,physicalAddress, location, email, phone, facebookUrl, xUrl, linkedInUrl, instagramUrl, tiktokUrl, whatsAppUrl } = req.body;
        const date = moment().format("YYYY-MM-DD:HH:mm:ss");
        const q = `UPDATE contacts SET title = COALESCE(?, title) , description = COALESCE(?, description),
                        physicalAddress = COALESCE(?, physicalAddress), location = COALESCE(?, location), 
                        email = COALESCE(?, email), phone = COALESCE(?, phone), facebookUrl= COALESCE(?, facebookUrl),
                        xUrl= COALESCE(?, xUrl), linkedInUrl= COALESCE(?, linkedInUrl), instagramUrl= COALESCE(?, instagramUrl), 
                        tiktokUrl= COALESCE(?, tiktokUrl), whatsAppUrl=COALESCE(?, whatsAppUrl), updatedAt =COALESCE(?, updatedAt) WHERE id = ?`;

        db.query(q, [title, description, physicalAddress, location, email, phone, facebookUrl, xUrl, linkedInUrl, instagramUrl, tiktokUrl, whatsAppUrl, date, 1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json({message:"Successfully updated contact"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getContact = (req, res)=>{
    try {
        const q = 'SELECT * FROM contacts WHERE id = ?';
        db.query(q, [1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json(data[0]);
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteContact = (req, res)=>{
    try {
        const q = 'DELETE * FROM contacts WHERE id = ?';
        db.query(q, [1], (err, data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json({message:"Successfully deleted contacts data"});
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    createContact,
    updateContact,
    getContact,
    deleteContact
}