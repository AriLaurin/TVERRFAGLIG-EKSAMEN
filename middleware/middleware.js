const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => { //check auth status, apply this func to anything that need authentication
    
    const token = req.cookies.jwt; //requesting our jwt, we must have this

    //check json web token exists and is verified / valid
    if(token){ //if jwt is true
        //verify token
        jwt.verify(token, "gnome secret", (err, decodedToken) => {//secret is our private key that we must provide to verify
            //is there an error?
            if(err){
                console.log(err.message);
                res.redirect("/login");
            } else {
                // console.log(decodedToken);
                next(); //middleware always need next to continue
            }
        }); 
    }
    else{
        res.redirect("/login"); //if user has no jwt, send them to login
    }

    
}

//check current user
const checkUser = (req, res, next) => {
    //get the token
    const token = req.cookies.jwt;
    
    if (token){
        jwt.verify(token, "gnome secret", async (err, decodedToken) => {//secret is our private key that we must provide to verify
            //is there an error?
            if(err){
                console.log(err.message);
                res.locals.user = null; //if user doesnt exist, set it to null
                next() //if token is not valid, dont do anything, just carry on with next task at hand
            } else {
                let user = await User.findById(decodedToken.id); //finds a user
                res.locals.user = user; //makes user available to views (public), which has our email and password for example
                next();
            }
        }); 
    }
    else{
        res.locals.user = null; //if user doesnt exist, set it to null
        next();
    }
}

module.exports = { requireAuth, checkUser }; //exporting the middleware module