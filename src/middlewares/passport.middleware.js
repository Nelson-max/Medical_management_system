const passport = require('passport');
const passportJwt = require('passport-jwt');

// const { ExtractJwt } = passportJwt;
const JwtStrategy = passportJwt.Strategy;

const User = require('../models/user.model');

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.access_token;
  }
  return token;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_ACCESS_SECRET,
  passReqToCallback: true
};

passport.use(
  new JwtStrategy(options, async (req, payload, done) => {
    try {
      // Find the user specified in token
      const user = await User.findById(payload.sub);
      // If user doesn't exists, handle it
      if (!user) {
        return done(null, false);
      }
      // Otherwise, return the user
      req.user = user;
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  })
);

// const options = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.JWT_ACCESS_SECRET,
//   passReqToCallback: true
// };

// passport.use(
//   new JwtStrategy(options, async (req, payload, done) => {
//     try {
//       // Find the user specified in token
//       const user = await User.findById(payload.sub);
//       // If user doesn't exists, handle it
//       if (!user) {
//         return done(null, false);
//       }
//       // Otherwise, return the user
//       req.user = user;
//       done(null, user);
//     } catch (error) {
//       done(error, false);
//     }
//   })
// );
