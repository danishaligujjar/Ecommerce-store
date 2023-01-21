const mongoose = require('mongoose');
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');
//var uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required:true,
        maxlength: 32
    },
    email:{
        type: String,
        trim: true,
        required:true,
        unique: true,
        maxlength: 32
    },
    hashed_password:{
        type: String,
        require:true,
    },
    about:{
        type: String,
        trim:true,
        },
    salt:String,
    role:{
        type: Number,
        default:0
    },
    history:{
        type: Array,
        default:[]
    },
}, { timestamps: true });

userSchema.virtual('password')
.set(function(password) {
    this._password  = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

userSchema.methods = {
    authenticate : function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword : function(password){
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        }
        catch(err){
            return ''
        }
    }
}
//userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)