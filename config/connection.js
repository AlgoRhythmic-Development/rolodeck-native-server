const mongoose = require("mongoose");

// the name of the project/website should go in the placeholder.
mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb+srv://TRemigi:Tj3254082!@rolodeck-native.9yh77.mongodb.net/rolodeck-native?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

module.exports = mongoose.connection;
