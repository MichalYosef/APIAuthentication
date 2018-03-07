const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');

signToken = user => // function with only 1 parameter
{
    return JWT.sign({
        iss: 'MicYo', // Issuer
        sub: user.id, // subject
        iat: new Date().getTime(), // issued at
        exp: new Date().setDate(new Date().getDate()+1),// expiration date
    },JWT_SECRET);


}

module.exports = {

     // Validation: 
    signUp: async ( req, res, next ) => 
    {
        const { email, password } = req.value.body ;

        // Check if there is a user with the same email
        const foundUser = await User.findOne({ "local.email" : email})
        if( foundUser)
        { 
            return res.status(403).json({error: "email already exist"});
        }

        // create a new user and save to db
        const newUser = new User( { 
            authMethod: 'local',
            local: {
                email: email, 
                password: password
            } 
        });
        await newUser.save();

        // generate token
        const token = signToken(newUser);

        // respond with the token
    
        res.status(200).json({token});        
    },

    // Validation: 
    signIn: async(req, res, next) => 
    {
        // Generate a token
        const token = signToken( req.user );

        res.status(200).json({token});        

    },

    oAuthToken: async ( req, res, next) =>
    {
        // Generate a token
        const token = signToken( req.user );

        res.status(200).json({token});   
    },

    // facebookOAuth: async ( req, res, next) =>
    // {
    //     // Generate a token
    //     const token = signToken( req.user );

    //     res.status(200).json({token});   
    // },

    // Validation: 
    secret: async(req, res, next) => 
    {
        console.log('secret');
       
        res.json({secret: "resource"});
    },


    // // Validation: 
    // index: async ( req, res, next ) => 
    // {
    //     const users = await User.find({});
    //     res.status(200).json(users);        
    // },

    // // Validation: 
    // newUser: async(req, res, next) => 
    // {
    //     const newUser = new User(req.value.body);
    //     const user = await newUser.save();
    //     res.status(200).json(user);
    // },

    // // Validation: 
    // getUser: async(req, res, next) => 
    // {
    //     const { userId } = req.value.params ; // this is after validation in Joi
        
    //     const user = await User.findById( userId );
    //     res.status(200).json(user);
    // },

    // // Validation: DONE
    // replaceUser :  async(req, res, next) => 
    // {
    //     // enforce that req.body must contain all the fields
    //     const { userId } = req.value.params ;
    //     const newUser = req.value.body;

    //     await User.findByIdAndUpdate( userId, newUser );
    //     res.status(200).json({ success: true});
    // },

    // // Validation: DONE
    // updateUser :  async(req, res, next) => 
    // {
    //     // req.body may contain number of fields
    //     const { userId } = req.value.params ;
    //     const newUser = req.value.body;

    //     await User.findByIdAndUpdate( userId, newUser );
    //     res.status(200).json({ success: true});
    // },

    // deleteUser :  async(req, res, next) => 
    // {
    //     const { userId } = req.params ;
        
    //     const user = await User.findById( userId );
    //     res.status(200).json(user);
    // },

    //  // Validation: DONE
    // getUserCars: async( req, res, next) =>
    // {
    //     const { userId } = req.value.params ;
    //     const user = await User.findById(userId).populate('cars');
    //     res.status(200).json(user.cars);
    // },
 
    // // Validation: DONE
    // newUserCar: async( req, res, next) =>
    // {
    //     const { userId } = req.value.params ;
    //     // Create new car
    //     const newCar = new Car( req.value.body );
        
    //     // Get User
    //     const user = await User.findById(userId);
    //     // Assign user as car's seller
    //     newCar.seller = user;
    //     //save the car
    //     await newCar.save();
    //     // add car to the  user's selling array 'cars'
    //     user.cars.push( newCar );
    //     // Save the user
    //     await user.save();

    //     res.status(200).json(newCar);

    // }

};
