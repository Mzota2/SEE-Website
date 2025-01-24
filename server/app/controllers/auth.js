const {db} = require("../connect");
const {hash, genSaltSync, hashSync, compareSync} = require("bcrypt");
const {sign, verify} = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const {uploadImage} = require("../file/uploads");
const { removeUploadedFile } = require("../file/manageFiles");
require('dotenv').config();

const accessSecretKey = process.env.REFRESH_KEY;
const refreshSecretKey = process.env.ACCESS_KEY;

const generateAccessToken = (user)=>{
    return sign({id:user?.id}, accessSecretKey, {expiresIn:'60s'});
}

const generateRefreshToken = (user)=>{
    return sign({id:user?.id}, refreshSecretKey, {expiresIn:'1d'});
}

const verifyAccessToken = (req, res, next)=>{
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if(!accessToken){
            res.status(401);
        }

        verify(accessToken, accessSecretKey, (error, decoded)=>{
            if(error){
                console.log(error)
            }
            else if(decoded){
                req.id = decoded.id;
                next();
            }
        })


    } catch (error) {
        console.log(error)

        res.json('something went wrong').status(400);
    }
}

const verifyStudent = (req, res, next)=>{
    try {

        const refreshToken = req.cookies['refresh-token'];
        if(!refreshToken){
            return res.status(401);
        }

        verify(refreshToken, refreshSecretKey, (error, decoded)=>{
            if(error){
                return res.status(403);
            }

            else if(decoded){
                req.id = decoded.id;
                next();
            }
        })

        // const {id} = req;
        // const q = 'SELECT * FROM students WHERE id = ?';
        // db.query(q, [id], (error, data)=>{
        //     if(error) return res.status(500).json(error);
        //     next();
        // });
        
    } catch (error) {
        res.status(500).json(error);
    }
}

const refreshToken = (req, res)=>{
    const refreshToken = req.cookies['refresh-token'];
    if(!refreshToken){
        res.status(401);
    }

    verify(refreshToken, refreshSecretKey, (error, decoded)=>{
        if(error){
            res.status(403);
        }

        const accessToken = sign({id:decoded.id}, accessSecretKey, {expiresIn:'60s'});
        res.json(accessToken);

    })
}

const sendMail = async(email, link, subject)=>{
      try {

        let transporter = await nodemailer.createTransport(
            smtpTransport({
              service: "gmail",
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: process.env.USER,
                pass:process.env.PASSWORD,
              },
              tls: {
                rejectUnauthorized: false // <--- This line bypasses self-signed certificate errors
              }
            })
          );

         //send mail
       await transporter.sendMail({
        from:`Society of Electrical Engineers <${process.env.USER}>`,
        to:email,
        subject:subject,
        html:`
            <div>
                <a href=${link}>Click here to activate your SEE account </a>
                <p>Token will expire after 5 minutes</p>
            </div>
        `

        })

        console.log('Email message sent successfully');
        
      } catch (error) {

        console.log(error);
        
      }

      

    
}

const verifyAccount = async(req, res)=>{
    try {
        const {token} = req.params;
        const q1 = 'SELECT expiresAt FROM students WHERE accountToken = ?';
        const now = new Date();

        db.query(q1, [token], (err, data)=>{
            if(err) return res.json({message:'The token does not match with any user'}); 
            if(now > new Date(data[0]?.expiresAt)) return res.json({message:"Token has expired, generate new token"})
            const q = 'UPDATE users SET accountToken = ?, isVerified = ? WHERE accountToken = ?';
            db.query(q, [null, 1, token], (err, data)=>{
                if(err) return res.status(400).json(err);
                return res.status(200).json('Account has been verified');
            });
        })
        
            
    } catch (error) {
        res.status(400);
        console.log(error)
    }

}

const forgotPassword = (req, res)=>{
    try {
        const {email} = req.body;
        const token = crypto.randomBytes(16).toString('hex');
        const q = 'UPDATE users SET passwordToken = ? WHERE email = ?';
        db.query(q, [token, email], async(error, data)=>{
            if(error) return res.status(500).json(error);
            const link = `${process.env.FRONT_END_URL}forgot-password/${token}`
            await sendMail(email, link, 'NEW PASSWORD');
            return res.status(200).json({message:"forgot password token set successfully"});
        })
        
    } catch (error) {
        
    }
}

const verifyForgotPassword= async(req, res)=>{
    try {
        const {token} = req.params;
        const {password} = req.body;
        const hashedPassword = hash(password, 10);
        const q = 'UPDATE students SET password = ?, passwordToken = ? WHERE passwordToken = ?';

        db.query(q, [hashedPassword, null, token], (err, data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json({message:'Created new password'});
        });
            
    } catch (error) {
        res.status(500).json(err);
       
    }

}

const register = async (req, res)=>{
    //CHECK USER IF EXISTS 
    uploadImage(req, res, (err, data)=>{
        const {password, email, firstname, surname, programId, year, regNumber} = req.body;

        const q = 'SELECT * FROM students WHERE email = ?';
        
        db.query(q, [email],async(err, data)=>{
            if(err) return res.status(500).json(err)
            if(data?.length) return res.json({message:"User already exists"}).status(409);
        
            //CREATE A NEW USERS
            //Hash password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);
    
            //INSERT
            const q = 'INSERT INTO students (`firstname`, `surname`, `email`, `regNumber`, `programId`, `year`, `regProofUrl`, `password`, `accountToken`, `createdAt`, `updatedAt`, `expiresAt`) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const date = moment().format('YYYY-MM-DD:HH:mm:ss');
            const token = crypto.randomBytes(16).toString('hex');
            const expiresAt = new Date(Date.now() + 60 * 5 * 1000); 
            
            db.query(q, [firstname, surname, email, regNumber, programId, year, req?.file?.filename, hashedPassword, token, date, date, expiresAt], async(err, data)=>{
                if(err) {
                    removeUploadedFile(req?.file?.path);
                    return res.status(500).json(err)
                }
                else{
                    const link = `${process.env.FRONT_END_URL}verify/${token}`
                    await sendMail(email, link,  'ACCOUNT VERIFICATION');
                    return res.status(200).json('User has been created');
                }
                
            });
    
        });   
    })
}

const resendConfirmationMail = async (req, res)=>{
    //CHECK USER IF EXISTS 

    const { email} = req.body;
    const expiresAt = new Date(Date.now() + 60 * 5 * 1000); 
    const q = 'UPDATE students SET accountToken = ?, expiresAt = ? WHERE email = ?';
    const token = crypto.randomBytes(16).toString('hex');

    db.query(q, [token, expiresAt, email],async(err, data)=>{
        if(err) return res.status(500).json(err)
        const link = `${process.env.FRONT_END_URL}verify/${token}`
        await sendMail(email, link,  'ACCOUNT VERIFICATION');
        return res.status(200).json({message:'Resent confirmation email'});
    });   

}

const login = (req, res)=>{
    //CHECK USER
    const{ email} = req.body;
    const q = 'SELECT * FROM students WHERE email = ?';

    db.query(q, [email], (err, data)=>{
        if(err) return res.status(500).json(err);
        if(!data?.length) return res.json({message:"Wrong email address"}).status(404);

        const checkPassword =compareSync(req.body.password, data[0]?.password);
        if(!checkPassword) return res.json({message:'Wrong password or email address'}).status(403);
        if(!data[0]?.isVerified) return res.json({message:"Your account is not verified"}).status(403);

        const refreshToken = generateRefreshToken(data[0]);
        const accessToken = generateAccessToken(data[0]);
        const {password, ...others} = data[0];
        res.cookie('refresh-token', refreshToken, {httpOnly:true, maxAge:1000*60*60*24}).status(200).json({...others, accessToken:accessToken});

    })
}

const logout = (req, res)=>{

    const refreshToken = req.cookies['refresh-token'];
    if(!refreshToken){
        res.status(401);
    }

    verify(refreshToken, refreshSecretKey, (error, decoded)=>{
        if(error){
            console.log(error);
            res.status(403);
        }

        else if(decoded){
            res.clearCookie('refresh-token',{secure:true, sameSite:'none'}).status(200).json('Logged out successfully');
        }
    })
}

module.exports = {
    register,
    login,
    logout,
    verifyAccessToken,
    refreshToken,
    verifyAccount,
    verifyStudent,
    forgotPassword,
    verifyForgotPassword,
    resendConfirmationMail
}