const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('./config');
const User = require('./models/user');

// JSON WEB TOKENS STRATEGY
passport.use( new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'), // where the token is going to be located
    secretOrKey: config.JWT_SECRET // the secret
}, async(payload, done) => 
{
    try
    {
        // find user by token
        const user = await User.findById( payload.sub );

        // user doesnt exist
        if( !user ) 
        {
            return done( null, false );
        }
        // if exist return the user
        done( null, user);
    }
    catch( error )
    {
        done(error, false);
    }

}));

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret
}, async( accessToken, refreshToken, profile, done) =>
{
    try
    {
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);

        // Check if current user exist in db
        const userExist = await User.findOne({ "google.id": profile.id });
        if( userExist ){
            console.log('User already exist');
            return done( null, userExist);
        }

        console.log('User doesnt exist, creating new one');

        // If user doesnt exist create new account
        const newUser = new User({
            authMethod: 'google',
            google: {
                id: profile.id,
                email:  profile.emails[0].value
            }
        });

        await newUser.save();

        done( null, newUser);
    }
    catch( error )
    {
        done( error, false, error.message );
    }
       
}));

// FACEBOOK TOKEN STRATEGY
passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
}, async( accessToken, refreshToken, profile, done) =>
{
    try
    {
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);

        // Check if current user exist in db
        const userExist = await User.findOne({ "facebook.id": profile.id });
        if( userExist ){
            console.log('User already exist');
            return done( null, userExist);
        }

        console.log('User doesnt exist, creating new one');

        // If user doesnt exist create new account
        const newUser = new User({
            authMethod: 'facebook',
            facebook: {
                id: profile.id,
                email:  profile.emails[0].value
            }
        });

        await newUser.save();

        done( null, newUser);
    }
    catch( error )
    {
        done( error, false, error.message );
    }
       
}));
////////////////////////////////////////copied1111

// LOCAL STRATEGY
passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    }, 
    async( email, password, done) => 
    {
        try
        {
            // find user bt email
            const user = await User.findOne({ "local.email" : email});
            
            // wasnt found
            // user doesnt exist
            if( !user ) 
            {
                return done( null, false );
            }

            // check if password is correct
            const isValid = await user.isValidPassword( password );
            
            // if password is not valid
            if( ! isValid )
            {
                return done( null, false );
            }
            // found, return the user
            done( null, user);

        }catch(error)
        {
            throw new Error(error, false);
        }
    }
));


/*

FACEBOOK 

<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '{your-app-id}',
      cookie     : true,
      xfbml      : true,
      version    : '{latest-api-version}'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>


*/

/* 
response facebook


{
    status: 'connected',
    authResponse: {
        accessToken: '...',
        expiresIn:'...',
        signedRequest:'...',
        userID:'...'
    }
}


*/