const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
  create,
  login
};

// This function fires when a request is made to /api/users POST
async function create(req, res) {
  try {
    // Add the user to the database
    // then()
    const user = await User.create(req.body)
    // token will be a string
    const token = createJWT(user)
    // Yes, we can use res.json to send back just a string
    // The client code needs to take this into consideration
    res.json(token)
  } catch(err) {
    res.status(400).json(err)
  }
}

// async/wait new syntax for .then() aka thennables

async function login(req, res) {
  try {
    // Query our database to find a user with the email provided
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error();
    // if we found the email, compare password
    // 1st argument from the credentials that the user typed in
    // 2nd argument what's stored in the database
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error();
    // if everything checks out, create token, login!
    res.json(createJWT(user));
  } catch {
    res.status(400).json('Bad Credentials');
  }
}

/*-- Helper Functions --*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}