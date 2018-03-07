const express = require('express');
const router = require('express-promise-router')(); // built in try catch
const passport = require('passport');
const passportConf = require('../passport');
const UserController = require('../controllers/users');
const passportSignin = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken', { session: false });
const passportFacebook = passport.authenticate('facebookToken', { session: false });

const { 
    validateParam, 
    validateBody, 
    schemas 
} = require('../helpers/requestValidator');



router.route('/signup')
    .post( validateBody(schemas.authSchema), UserController.signUp);
    // .get( UserController.index )
    

router.route('/signin')
    .post(  validateBody(schemas.authSchema), passportSignin, UserController.signIn);

router.route('/oauth/google')
.post( passportGoogle, UserController.oAuthToken);

router.route('/oauth/facebook')
.post( passportFacebook, UserController.oAuthToken);

router.route('/secret')
    .get( passportJWT, UserController.secret );
    



// router.route('/')
//     .get( UserController.index )
//     .post( validateBody(schemas.userSchema), UserController.newUser);

// // users/:id
// router.route('/:userId')
//     .get( validateParam( schemas.idSchema, 'userId'), UserController.getUser )
//     .put( [validateParam( schemas.idSchema, 'userId'), // put = replace (all fields must exist on replace)
//            validateBody( schemas.userSchema)], 
//           UserController.replaceUser )
//     .patch( [validateParam( schemas.idSchema, 'userId'), // patch = update (fields are optional on update)
//              validateBody( schemas.userOptionalSchema)], 
//             UserController.updateUser ) 
//     .delete(  UserController.deleteUser );

// router.route('/:userId/cars')
//     .get(  validateParam( schemas.idSchema, 'userId') ,UserController.getUserCars )
//     .post( [validateParam( schemas.idSchema, 'userId'),
//             validateBody( schemas.userCarSchema)], 
//             UserController.newUserCar);

module.exports = router;

