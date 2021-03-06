const { User, Card } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("cards")
          .populate("collectedCards");

        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
    // get collectedCards of logged in user
    myCollection: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("collectedCards");
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
    //get all users
    users: async () => {
      return await User.find().select("-__v -password").populate("cards");
    },
    //get a user by _id
    user: async (parent, { _id }) => {
      return User.findOne({ _id: _id })
        .select("-__v -password")
        .populate("cards")
        .populate("collectedCards");
    },
    //get a card by id
    card: async (parent, { _id }) => {
      const card = await Card.findOne({ _id: _id }).select("-__v");
      return card;
    },
    //get cards by _id
    cards: async () => {
      // const params = _id ? { _id } : {};
      return Card.find().select("-__v");
    },
    cardSearch: async (parent, { input }) => {
      const card = await Card.findOne({ input });
      return card;
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }).select("-__v");
      if (!user) {
        throw new AuthenticationError("Email not found");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },

    addCard: async (parent, args, context) => {
      if (context.user) {
        const card = await Card.create({
          ...args,
        });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { cards: card._id } },
          { new: true }
        );

        return card;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // add card to collectedCards
    addCollectedCard: async (parent, { _id }, context) => {
      if (context.user) {
        const card = await Card.findById({ _id: _id });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { collectedCards: card._id } },
          { new: true }
        );

        return card;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    updateCard: async (parent, { _id, input }, context) => {
      // if user is logged in: find card by id, update specified card fields by user input,
      // and return updated card, else return an error
      if (context.user) {
        const updatedCard = await Card.findOneAndUpdate({ _id: _id }, input, {
          new: true,
        });
        return updatedCard;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    deleteCard: async (parent, { _id }, context) => {
      if (context.user) {
        const removedCard = await Card.findOneAndDelete({ _id: _id });
        return removedCard;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeCard: async (parent, { _id }, context) => {
      if (context.user) {
        const card = await Card.findById({ _id: _id });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { collectedCards: card._id } },
          { new: true }
        );

        return card;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
