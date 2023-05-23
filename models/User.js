const mongoose  = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

//Schemer, it dicatates how the different documents look in the interface, as in what properties it has
const userSchema = new mongoose.Schema({//object defines the structure of our user document
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true, //takes everything into lowercase
        validate: [isEmail, "Enter a valid email"]//email should be valid, so it needs an @mail.com
                //first para is the value that user inputs, we use validator package to check if its actually an email
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Minimum password length is 6 characters"]
    },
});

//fire a function after doc saved to db
userSchema.post("save", function (doc, next){ //.post refers to after a save has been made, do something
                                //grabs our saved doc
    console.log("new user created and saved", doc);
    next(); //next is used in custom middleware so the code knows to continue after this, else it would hang and nothing else would work
});

// fire a function before doc saved to db
userSchema.pre("save", async function (next){ //.pre refers to before something happens, do something
    const salt = await bcrypt.genSalt(); //genSalt is async
    this.password = await bcrypt.hash(this.password, salt);//this. refers to the current user being created
            //turn the password into hash through has algorithm, and add salt
   // console.log("user about to be created and saved", this); //this refers to the user object that is created and saved before its actually sent to the db, which is why we want to use a normal function as well
    next();
});

//static method to login user
userSchema.statics.login = async function (email,password) { //we create a static method and call it "login"
    const user = await this.findOne({email: email}); //find one record or document of this user, if it finds one, user variable gets the value

    if(user){ //if user exists, do something
        const auth = await bcrypt.compare(password, user.password) //first para is the password the user logs in with, the second para is the hashed password stored in db
            //store the value in a const

            if(auth){ //if auth gets a true value from compare, do this
                return user; //return the user variable
            }
            throw Error("incorrect password") //if auth is false, do this
    }
    throw Error("incorrect email");//if user doesnt exist, do this
}

//creating a model based on the schemer
                        //must be the singular of what we want to call our model. Mongoose reads this and pluralizes it
const User = mongoose.model("user", userSchema) //using our new schema

module.exports = User;