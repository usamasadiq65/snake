const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true,
        min : 3,
        max : 15
    },
    email:{
        type:String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
});

UserSchema.pre('save', async function(next){
    if(!this.isModified('password'))
        return next();
    try {
        const passwordHash = await bcrypt.hash(this.password, 10);
        this.password = passwordHash;
        next();
    } catch(err) {
        return next(err);
    }
});

UserSchema.methods.comparePassword = function(password,cb){
    bcrypt.compare(password, this.password, (err,isMatch)=>{
        if(err)
            return cb(err);
        else{
            if(!isMatch)
                return cb(null,isMatch,'Incorrect password');
            return cb(null,this);
        }
    });
}

module.exports = mongoose.model('User',UserSchema);