require("dotenv").config({path:"D:/back-end/nodeproj/backend/.env"})
//We have require dotenv package at the top
//Requring all the packages
let express = require("express")
let app = express()
let path = require("path")
let bcrypt = require("bcryptjs")
let jwt = require("jsonwebtoken")
let EmployeeModel = require("D:/back-end/nodeproj/backend/src/models/userRegistration.js")
require("D:/back-end/nodeproj/backend/src/db/connection.js")
let hbs = require("hbs")

//Port Number
let port = process.env.PORT || 5600


//Path of the file 
let static = path.join("D:/back-end/nodeproj/backend/src/public")

//Using JSON 
app.use(express.json())

//To get the form 
app.use(express.urlencoded({ extended: false }))

//To set view engine 
app.set("view engine", "hbs")
app.set("views", "D:/back-end/nodeproj/backend/template/views")
// hbs.registerPartials("D:/back-end/nodeproj/backend/template/partials")



//Using Get Method 
app.get("/", function (req, res) {

    res.render("D:/back-end/nodeproj/backend/template/views/index.hbs")
})

//Posting the form data to the server
app.post("/", async function (req, res) {
    try {
        let pass = req.body.password
        let cpass = req.body.conf_password
        if (pass === cpass) {
            let register = new EmployeeModel({
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: pass,
                confpass: cpass
            })
            //Password Hashing  We can say that it is a middleware 
            let tokengen = await register.generateAuthToken()
            // console.log(tokengen)
            let result = await register.save()
            console.log(`The result is ${result}`)
            res.status(201).render("D:/back-end/nodeproj/backend/template/views/index.hbs")
            console.log(`The Secret Key is${process.env.SECRET_KEY}`)

         
        }else {
            
            res.send("Paaword is not matching")
        }

    } catch (err) {
        res.status(400).send(err)
    }

})

//Creating Login Page 
app.get("/login", function (req, res) {
    res.render("D:/back-end/nodeproj/backend/template/views/login.hbs")

})

//Login Validation
app.post("/login", async function (req, res) {
    try {
        let useremail = req.body.email
        let password = req.body.password

        let find = await EmployeeModel.findOne({ email: useremail })
        // console.log(`The result is here ${find}`)

        
        
        let match = await bcrypt.compare(password, find.password)//First argument takes the user password during login,Second argument takes the password that stored on database.Then it will check.
        // console.log(find)

        let token = await find.generateAuthToken()//This will generate the token for verification.
        console.log(`The token is ${token}`)
        
        
        // if(find.password===password){//find.password resembles the password that stored on database and password resembles the password that the user going to enter and if the find.password and password will match then the user looged successfully.
        //     res.status(201).render("D:/back-end/nodeproj/backend/template/views/index.hbs")
        // }else{
            //     res.send("Invalid Login Details") 
            // }
            if (match) {
                res.status(201).render("D:/back-end/nodeproj/backend/template/views/index.hbs")
            }
            else {
                res.send("Invalid Login Details")
            }
           


    } catch (err) {
        res.status(400).send("Invalid Email")
    }

})

//Using bcryptjs to secure password 
// async function securePass(password) {
//   let hashing =  await bcrypt.hash(password, 10)
//   console.log(hashing)
//   let hashingCheck = await bcrypt.compare(password,hashing)
//   console.log(hashingCheck)
// }

// securePass("vansh")
//Using static website
app.use(express.static(static))

//Listening to the Port 
app.listen(port, function () {
    console.log(`We are listening to the port no. ${port}`)

})


