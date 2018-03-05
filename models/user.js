const mongoose = require('../libs/mongooseConnector');

module.exports.createUser = () => {
  const schema = new mongoose.Schema({
    _id: {
      required: true,
      type: String
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    picture: {
      type: String,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    }
  });

  mongoose.model('User', schema);
};