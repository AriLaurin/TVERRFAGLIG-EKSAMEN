const { Router } = require("express");//we need the express router to plug into applications
const Controller = require("../controllers/controller"); //exports our controller to get our functions
const router  = Router(); ///creates a new router
const {requireAuth} = require("../middleware/middleware");

router.get("/", Controller.home_get);


router.post("/account", Controller.account_post);

router.get("/signup", Controller.signup_get);
router.post("/signup", Controller.signup_post);

router.get("/login", Controller.login_get);
router.post("/login", Controller.login_post);

router.get("/logout", Controller.logout_get);

router.get("/guide", requireAuth, Controller.guide_get);



router.get("/home/:user", requireAuth, Controller.account_get);
router.get("/:user", Controller.user_get);


router.post("/update/:updateId", Controller.Wish_update);

router.delete("/home/:id", Controller.Wish_delete);

// Move a wish 
router.post('/:userId/move-wish', Controller.move_Wish);


module.exports = router;