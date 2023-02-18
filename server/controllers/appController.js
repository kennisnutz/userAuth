import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config.js';
import otpGenerator from 'otp-generator';

/**Middleware for user verificatio */

export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == 'GET' ? req.query : req.body;

    /**check if user exists */
    const exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: 'Cant find username' });
    next();
  } catch (error) {
    return res.status(404).send({ error: 'Authentication error' });
  }
}
/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
  
}
*/

export async function register(req, res) {
  try {
    const { username, password, email, profile } = req.body;

    //check if user exists
    const existsUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username }, function (err, user) {
        if (err) reject(new Error(err));
        if (user) reject({ error: 'Username already exists' });
        resolve();
      });
    });

    //check if usemail exists
    const existsEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email }, function (err, email) {
        if (err) reject(new Error(err));
        if (email) reject({ error: 'Please use unique email' });
        resolve();
      });
    });

    Promise.all([existsEmail, existsUsername])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || '',
                email,
              });
              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: 'User Register Successfully' })
                )
                .catch((error) => res.status(500).send({ error }));
            })
            .catch((error) => {
              return res.status(500).send({ error: 'Unable to hash Password' });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/

export async function login(req, res) {
  const { username, password } = req.body;
  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: 'Does not have Password' });

            //create jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                usename: user.username,
              },
              env.JWT_SECRET,
              { expiresIn: '24h' }
            );
            return res.status(200).send({
              msg: 'Login successful...!',
              username: user.username,
              token,
            });
          })
          .catch((erro) => {
            return res.status(400).send({ error: 'Password does not match' });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: 'username not found' });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET: http://localhost:8080/api/user/example123 */

export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) return res.status(501).send({ error: 'Invalid Username' });
    UserModel.findOne({ username }, function (err, user) {
      if (err) return res.status(500).send({ err });
      if (!user) return res.status(501).send({ error: 'Could not find user' });
      const { password, ...rest } = Object.assign({}, user.toJSON());
      return res.status(201).send(rest);
    });
  } catch (error) {
    return res.status(404).send({ error: 'Cannot find user data' });
  }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/

export async function updateUser(req, res) {
  try {
    //  const id = req.query.id;
    const { userId } = req.user;
    if (userId) {
      const body = req.body;
      //update the data
      UserModel.updateOne({ _id: userId }, body, function (err, data) {
        if (err) throw err;
        return res.status(201).send({ msg: 'Record Updated...!' });
      });
    } else {
      return res.status(401).send({ error: 'user not found' });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET: http://localhost:8080/api/generateOTP */

export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:8080/api/verifyOTP */

export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) == parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: 'Verification successful' });
  }
  return res.status(400).send({ error: 'Invalid OTP' });
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */

export async function creatResetSession(req, res) {
  if (req.app.locals.resetSession) {
    //allow access to this route only once
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(404).send({ error: 'Session expired...!' });
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */

export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(404).send({ error: 'Session expired...!' });
    }
    const { username, password } = req.body;
    try {
      UserModel.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword },
                function (err, data) {
                  if (err) throw err;
                  return res.status(201).send({ msg: 'Password updated...!' });
                }
              );
            })
            .catch((e) => {
              return res.status(500).send({
                error: 'Unable to hash password',
              });
            });
        })
        .catch((error) => {
          return res.status(404).send({ error: 'User not found...!' });
        });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}
