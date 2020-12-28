const faker = require("faker");

const db = require("../config/connection");
const { User, Card } = require("../models");

db.once("open", async () => {
  for (let i = 0; i < 10; i += 1) {
    // user data
    const username = faker.internet.userName();
    const email = faker.internet.email(username);
    const password = faker.internet.password();

    // card data
    const name = faker.name.findName();
    const jobTitle = faker.name.jobTitle();
    const phone = "000-000-0000";

    await User.create({ username, email, password });
    await Card.create({ name, jobTitle, phone, email, username });
  }

  console.log("all done!");
  process.exit(0);
});
