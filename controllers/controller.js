const Wish = require("../models/Wish");
const User = require("../models/User");
const Image = require("../models/Image");
const jwt = require("jsonwebtoken");
const multer = require('multer');

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage }).single('image');

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
await User.aggregate([
  { $sort: { updatedAt: -1 } }, // Sort by createdAt in descending order
  {
    $group: {
      _id: '$email', // Group by email field
      wishlist: { $first: { $reverseArray: '$wishlist' } }, // Reverse the wishlist array and select the first wish
      updatedAt: { $first: '$updatedAt' } // Select the first updatedAt value
    }
  },
  { $limit: 5 } // Limit the result to 5 documents (optional)
])
.then((result) => {
  // console.log(result);
  res.render('home', { title: 'All Wishes', Wish: result })
})
.catch((err) => {
  res.render("error");
  console.log(err);
});
}

module.exports.account_post = async (req, res) => {
        const { yourWish, author } = req.body;

        const update = {wishlist: yourWish}

        try {
          product = await User.updateOne({email: author}, { $push: update})
          res.status(201);
          console.log("Wish created:", product);
          res.json(product);
        } catch (err) {
          console.log(err);
          res.status(500).send("Error saving image");
        }
    
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
  await User.find({email: URLuser})
  .then((result) => {
      res.render('account', {title: 'All Wishes', wishes: result, URLuser})
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
  const URLuser = req.params.user; //req.params is what we write into the url & using :user in the route, we can grab what we wrote
  await User.find({email: URLuser})
  .then((result) => {
      res.render('user', {title: 'All Wishes', wishes: result, URLuser})
  })
  .catch((err) => {
    res.render("error");
    console.log(err);
})

}

module.exports.guide_get = async (req,res) => {
  res.render("guide");
}

module.exports.Wish_delete = (req, res) => {
  const arrayNr = req.params.id;
  const author = req.body.author;

  User.findOne({ email: author })
    .then(user => {
      if (user && user.wishlist[arrayNr]) {
        // Remove the wishlist item at the specified index
        user.wishlist.splice(arrayNr, 1); //para 1 is what index and para 2 is how many elements to delete

        // Save the updated user
        return user.save();
      } else {
        throw new Error("Invalid index or user not found");
      }
    })
    .then(updatedUser => {
      console.log("Wish deleted:", updatedUser);
      res.status(200).json(updatedUser);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error deleting wish");
    });
};


module.exports.Wish_update = (req, res) => {
  const arrayNr = req.params.updateId;
  const yourWish = req.body.yourWish;
  const author = req.body.author;

  // Find the user based on the author's email
  User.findOne({ email: author })
    .then(user => {
      // Update the wishlist item at the specified index
      user.wishlist[arrayNr] = yourWish;

      // Save the updated user
      return user.save();
    })
    .then(updatedUser => {
      console.log("Wish updated:", updatedUser);
      res.status(201).json(updatedUser);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error updating wish");
    });
};



module.exports.move_Wish = async (req, res) => {
const userId = req.params.userId;
  const { currentIndex, newIndex } = req.body;

  try {
    const user = await User.findById(userId);
    const wishlist = user.wishlist;

    // Validate currentIndex and newIndex
    if (currentIndex < 0 || currentIndex >= wishlist.length || newIndex < 0 || newIndex >= wishlist.length) {
      return res.status(400).json({ error: 'Invalid currentIndex or newIndex' });
    }

    // Move the wish in the wishlist array
    const movedWish = wishlist.splice(currentIndex, 1)[0];
    wishlist.splice(newIndex, 0, movedWish);

    // Save the updated user document
    await user.save();

    res.json({ message: 'Wish moved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while moving the wish' });
  }
}