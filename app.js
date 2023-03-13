const mongoose = require('mongoose');
const dotenv = require ('dotenv');
const express = require('express');
const cors = require('cors');
const app = express(); 
const jwt = require('jsonwebtoken');
const User = require('./model/userSchema');
const path = require('path')

dotenv.config()
const DB = process.env.DATABASE
const PORT = process.env.PORT

require('./db/connection');
app.use(express.json()); 

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*",function(req,res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


app.post('/signup',async (req,res) =>{
    const {names,email,cemail} = req.body
    if( !names || !email || !cemail){

        return res.status(422).json({ error:"require all the fields."});
       }  
       try{   
        const userExist = await User.findOne({ email:email });
        
            if(userExist) { 
                 res.status(409).json({ error:"Email already exist"});
            } else if( email != cemail) {
                 res.status(422).json({ error:"Emails are not matching"});                  
            } else{
                const user = new User({names,email,cemail});
            
                await user.save();

                res.status(201).json({ message: "user registered successfully"});
            }
       }catch (err) {
        res.status(500).json(err);
       } 
    });    


app.post('/signin',async(req,res) =>{
    const { names,email } = req.body; 
    if(!names || !email) {
        return res.status(400).json({error:"Please enter the credentials"})
    }
    try{       
        const userLogin = await User.findOne({ email:email });
        if(userLogin){
            const token = await userLogin.generateAuthToken();
            console.log("token:",token);  
            res.status(200).json({
                message: "User Signin Successfully.",
                token: token,
                names: names,
                email: email,
            });
           
        }
        else{
            res.status(400).json({ error:"Invalid credentials."});
        }        
      }catch(err){
        console.log(err);  
      }  
});
 

app.get('/dashboard',(req,res) =>{
    res.send(req.rootUser)
});
app.get('/courses',(req,res) =>{
    // res.send(req.rootUser)
});
app.get('/discussions',(req,res) =>{
    res.send(req.rootUser)
}); 
app.get('/logout',(req,res) =>{  
    res.clearCookie('stdtoken',{path:'/'}); 
    res.status(200).send('user loggedout') ;
});  

app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`);
});
