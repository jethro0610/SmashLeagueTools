const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const scopes = ['identify', 'email']
const User = require('../models/user.model')

module.exports = passport => {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(async function(id, done) {
        const user = await User.findById(id);
        if(user) done(null, user);
    });

    passport.use(new DiscordStrategy( {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CLIENT_REDIRECT,
        scope: scopes
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({discordId: profile.id});
            if(user) 
                done(null, user);
            else {
                const newUser = await User.create({
                    name: profile.username,
                    discordId: profile.id,
                    balance: process.env.STARTING_BALANCE,
                    admin: false
                });
                const savedUser = await newUser.save();
                done(null, savedUser);
            }
        }
        catch(err) {
            console.log(err);
            done(err, null);
        }
    }));
}