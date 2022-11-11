const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please Provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please Provide a vaild email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please Provide a Password'],
    minlength: 8
  },
  passwordConfirm: {
    type:String,
    required:[true,'Please Confirm your password']
  }
});

const User=mongoose.model('User',userSchema)
module.exports=User
