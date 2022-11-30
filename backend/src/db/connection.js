let mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/employeeRegis",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
   
}).then(function () {
    console.log("Connection is successfully etablish")
    
}).catch(function (err) {
    console.log(err)
})