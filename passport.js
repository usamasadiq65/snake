const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/User');

const cookieExtractor = req =>{
    let token = null;
    if(req &&  req.cookies){
        token = req.cookies["access_token"];
    }
    return token;
}

// authorization 
passport.use(new JwtStrategy({
    jwtFromRequest : cookieExtractor,
    secretOrKey : "NoobCoder"
}, async (payload,done)=>{
    try {
        const user = await User.findById(payload.sub);
        if(user)
            return done(null,user);
        else
            return done(null,false);
    } catch(err) {
        return done(err,false);
    }
}));

// authenticated local strategy using username and password
passport.use(new LocalStrategy({ usernameField:'email'}, async (email,password,done)=>{
    try {
        const user = await User.findOne({email});
        // if no user exist
        if(!user)
            return done(null,false,'User not found');
        // check if password is correct
        user.comparePassword(password,done);
    } catch(err) {
        // something went wrong with database
        return done(err);
    }
}));