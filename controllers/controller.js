const Pokomon = require("../models/Pokomon");
const User = require("../models/User");
const Image = require("../models/Image");
const jwt = require("jsonwebtoken");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: "", password: ""};

    //incorrect email
    if(err.message === "incorrect email"){
        errors.email = "that email is not registered";
    }

        //incorrect password
        if(err.message === "incorrect password"){
            errors.password = "that password is not valid";
        }

    //duplicate error code
    if (err.code === 11000){
        errors.email = "that email is already registered";
        return errors;
    }

    //validation errors
    if(err.message.includes("user validation failed")){
                                        //destructuring the errors object, so we dont need to write .properties on error code
        Object.values(err.errors).forEach(({properties}) => {//errors object inside err value
            errors[properties.path] = properties.message; //upadting the error message with proper text
        });
    }

    return errors; 
}

const maxAge = 3 * 24 * 60 * 60; //three days in seconds

                    //id is the value we get from when we create a user, check the db where you can see that every user has an ID
const createToken = (id) => {
    return jwt.sign({id}, "gnome secret", { // first para is our id property which is our payload, second para is our secret, our key that we can never share, third para is options
        expiresIn: maxAge
    }); 
}

module.exports.home_get = async (req,res) => { //a function that renders our routes from AuthRoutes
  await Pokomon.find().populate("image").sort({ createdAt: -1}).limit(10)
  .then((result) => {
      res.render('home', {title: 'All Pokomons', pokomon: result})
  })
  .catch((err) => {
    res.render("error");
    console.log(err);
})
}

module.exports.account_post = async (req, res) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err);
        res.status(500).send("Error saving image");
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log(err);
        res.status(500).send("Error saving image");
      } else {
        // Everything went fine.
        const { name, ability1, ability2, ability3, author } = req.body;
  
        const image = new Image({
          name: req.file.originalname,
          data: req.file.buffer,
          contentType: req.file.mimetype,
          key: name,
        });
  
        try {
          await image.save();
          const product = await Pokomon.create({ name, ability1, ability2, ability3, author, image });
          res.status(201);
          console.log("Pokomon created:", product);
          res.json(product);
        } catch (err) {
          console.log(err);
          res.status(500).send("Error saving image");
        }
      }
    });
  };

module.exports.signup_get = (req,res) => { //a function that renders our routes from AuthRoutes
  res.render("signup");
}

module.exports.signup_post = async(req,res) => { //a function that renders our routes from AuthRoutes
  const {email, password} = req.body;

  try { //try todo something
          //create a local user and save in database
      const user = await User.create({email, password}); //async task
              // turn this into async with await so user variable gets created with actual information
      const token = createToken(user._id); //creates a token and returns it so we can have it stored here
      res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000}); //value name, actual value and options
      res.status(201).json({user: user._id}); //success code, send back the user object

  } //if it fails, do this
  catch(err){
      const errors = handleErrors(err);
      res.status(400).json({ errors }); //we send now the errors object that we wrote above in "handle errors" area
  }
}

module.exports.account_get = async (req,res) => { 
  const URLuser = req.params.user; //req.params is what we write into the url & using :user in the route, we can grab what we wrote
  await Pokomon.find({author: URLuser}).populate("image").sort({ createdAt: -1}).limit(10)
  .then((result) => {
      res.render('account', {title: 'All Pokomons', pokos: result, URLuser})
  })
  .catch((err) => {
    res.render("error");
    console.log(err);
})

}

module.exports.login_get = (req,res) => { //a function that renders our routes from AuthRoutes
  res.render("login");
}

module.exports.login_post = async(req,res) => { //a function that renders our routes from AuthRoute
  const {email, password} = req.body; //destructuring, grabbing properties from our login post
  //console.log(req.body); //shows requests that are sent, such as emails and passwords

  try { 
      const user = await User.login(email, password) //if successful, const user gets the value of the account we accepted
      const token = createToken(user._id); //creates a token and returns it so we can have it stored here
      res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000}); //value name, actual value and options
      res.status(200).json({user: user._id});
  }
  catch (err){ //if try gets an error, catch it
      const errors = handleErrors(err)//catching error
      res.status(400).json({errors});
  }
}

module.exports.logout_get = (req,res) => { 
  //delete jwt cookie
  res.cookie("jwt", "", {maxAge: 1}); //we replace jwt with empty string and expires in 1 ms
  res.redirect("/"); //sends them to homepage on click

}

module.exports.user_get = async (req,res) => {
  const user = req.params.user; //req.params is what we write into the url & using :user in the route, we can grab what we wrote
  await Pokomon.find({author: user}).sort({ createdAt: -1})
  .then((result) => {
      res.render('user', {title: 'All Pokos', pokos: result})
  })
  .catch((err) => {
    res.render("error", {title: "Pokos not found"});
})

}

module.exports.pokomon_delete = (req,res) => {
  const ID = req.params.id;
  Pokomon.findByIdAndDelete(ID)
  .then(result => {
    res.status(204).send();
  })
  .catch(err => {
      console.log(err);
  })
}

module.exports.pokomon_update = (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      res.status(500).send("Error saving image");
    } else if (err) {
      console.log(err);
      res.status(500).send("Error saving image");
    } else {
      const ID = req.params.updateId;
      const { name, ability1, ability2, ability3, author } = req.body;
      let image = null;
      if (req.file) {
        // process the image if it exists
        image = new Image({
          name: req.file.originalname,
          data: req.file.buffer,
          contentType: req.file.mimetype,
          key: name,
        });
      }
      const update = { name, ability1, ability2, ability3, author };
      if (image) {
        update.image = image;
      }
      Pokomon.findByIdAndUpdate(ID, update)
        .then((result) => {
          console.log('Updated Pokomon successfully');
          res.status(204).send();
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("Error updating pokomon");
        });
    }
  });
};



