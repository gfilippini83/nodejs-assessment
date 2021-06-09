let express = require('express');
let router = express.Router();

//Importing the controllers
let githubController = require('../controllers/github.controller');
let authController = require('../controllers/auth.controller');

//Importing Middlewares
let githubMiddleware = require('../middlewares/github.middleware');

/*
 * This route will make sure that the Github URL is in the correct format and that the user and repo do not have special
 * characters in their names. Additionally, it will then call the controller to set exactly what was requested, the number of
 * opened PR's, the PR creator, the number of comments on the PR (not including approval or rejection comment), and the 
 * number of commits.
 */
router.get('/exactRequest', githubMiddleware.validate, githubController.getRepoData, githubController.getPulls);

/*
 * Adding separate middlewares for Authentication, and getting that actual data for the repo.
 * You can see that two of the middleware functions call the same controller, but I wanted to show that
 * if you had a notification middleware or more then one or two, that you can continue to add middlewares.
 */
router.get('/additionalInfo', authController.auth, githubMiddleware.validate, githubController.getRepoData, githubController.getPulls);


module.exports = router; 