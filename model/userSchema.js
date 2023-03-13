const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const userSchema = new mongoose.Schema({
    
    names:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    cemail:{
        type:String,
        required:true
    },
    tokens: [ 
        {
            token: {
                type:String,
                required:true
            } 
        }
    ]
 
})

userSchema.methods.generateAuthToken = async function (){
    try{
        let token = jwt.sign({_id : this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token});
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
}

const Users = mongoose.model('USERS',userSchema); 
module.exports = Users;
  