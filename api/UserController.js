const sha1 = require('../libs/sha1');
const mongoose = require('../libs/mongooseConnector');
const TransportService = require('../services/TransportService');

class UserController {
  static signIn(req, res) {
    const User = mongoose.models.User;
    const token = req.body.token;

    TransportService.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)
      .then((data) => {
        const googleUser = JSON.parse(data.toString('utf8'));

        let hash = sha1(`${googleUser.sub}`);
        User.findOne({hash}, (err, user) => {
          if (err) {
            //TODO error
            return res.status(500).send({err, message: 'findOne error'});
          }
          if (user) {
            return res.status(200).send(user);
          } else {
            const userData = {
              picture: googleUser.picture,
              name: `${googleUser.given_name} ${googleUser.family_name}`,
              email: googleUser.email,
              created: Date.now(),
              hash
            };
            const newUser = new User(userData);
            newUser.save((err) => {
              if (err) {
                //TODO error
                return res.status(500).send({err, message: 'save error'});
              }
              return res.status(200).send(userData);
            })
          }
        });
      })
      .catch((err) => {
        //TODO error
        return res.status(500).send({err, message: 'token error'});
      });
  }
}

module.exports = UserController;