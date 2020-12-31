const faker = require("faker");

const db = require("../config/connection");
const { User, Card } = require("../models");

db.once("open", async () => {
  let cardIdArr = [];

  for (let i = 0; i < 10; i += 1) {
    // user data
    const username = faker.name.findName();
    const email = faker.internet.email(username);
    const password = faker.internet.password();

    // card data
    const name = username;
    const jobTitle = faker.name.jobTitle();
    const phone = "000-000-0000";

    const newUser = await User.create({ username, email, password });

    const newCard = await Card.create({
      name,
      jobTitle,
      phone,
      email,
      username,
    });

    cardIdArr.push(newCard._id);

    await User.findByIdAndUpdate(
      { _id: newUser._id },
      { $push: { cards: newCard._id } },
      { new: true }
    );

    if (i > 0) {
      await User.findByIdAndUpdate(
        { _id: newUser._id },
        { $push: { collectedCards: cardIdArr[i - 1] } },
        { new: true }
      );
    }
  }

  console.log("all done!");
  process.exit(0);
});
