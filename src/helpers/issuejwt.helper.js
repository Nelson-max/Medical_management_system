const jwt = require('jsonwebtoken');

function issueJWT(user) {
  const { id, name, role } = user;
  const expiresIn = '1d';
  const payload = {
    sub: id,
    name,
    role,
    iat: Date.now()
  };

  const signedToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: expiresIn
  });

  return {
    token: signedToken,
    expires: expiresIn
  };
  // return {
  //   token: `Bearer ${signedToken}`,
  //   expires: expiresIn
  // };
}

// const issueJWT = user => {
//   const { id, name, role } = user;
//   const payload = {
//     iss: 'MsM',
//     sub: id,
//     name,
//     role,
//     iat: new Date().getTime(), // current time
//     exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
//   };
//   const signedToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET);
//   return {
//     token: signedToken,
//     expires: payload.exp
//   };
// };

module.exports = { issueJWT };
