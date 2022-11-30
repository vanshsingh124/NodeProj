require("dotenv").config({path:"D:/back-end/nodeproj/backend/.env"})
let mongoose = require("mongoose")
let bcrypt = require("bcryptjs")
let jwt = require("jsonwebtoken")


let employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },surname:{
        type:String,
        
    },email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    conf_password:{
        type:String
        

    },tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

//Generating Auth Tokens
//Methods are used with instance 
employeeSchema.methods.generateAuthToken = async function (req,res) {
    try{
        //jwt.sign takes three argument First is unique identifier,Second argument takes the SecretKey or PrivateKey,Third one is callback
        let tokeng = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:tokeng})
        await this.save()
        // console.log(token)

    }catch(err){
        res.send(`There is some error and the error is${err}`)
    }
}

//Conveting the password into hash
//pre execution hooks are processing scripts that run before and after actual data processing is performed.
employeeSchema.pre("save",async function(next) {
    //Only we have to hash the password when the user update password otherwise it will not do anything.This is the function of the isMofified.
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10)
    // console.log(`The current password is ${this.password}`)
    this.conf_password = undefined
    }
    next()
})



let EmployeeModel = new mongoose.model("people",employeeSchema)

module.exports = EmployeeModel

