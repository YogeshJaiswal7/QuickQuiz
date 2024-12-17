import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullname:{
        type :String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique : true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['student','teacher'],
        required : true,
    },
    // field for teacher
    subject:{
        type:String,
        required : function(){
            return this.role === 'teacher';
        }
    },
    // field for student
    branch:{
        type:String,
        required : function(){
            return this.role === 'student';
        }
    },
    year:{
        type:Number,
        min:1, max:4,
        required : function(){
            return this.role === 'student';
        }
    }
},{timestamps: true});

export const User = mongoose.model("User",userSchema);