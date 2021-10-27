const { User, Thought } = require('../models');

const resolvers = {
  Query: {
    //we are now using the parameters to which the apollo-server library passes argument data so we can have a more dynamic interaction with our server
    //parent: This is if we used nested resolvers to handle more complicated actions, 
    // as it would hold the reference to the resolver that executed the nested resolver function
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },

    // place this inside of the `Query` nested object right after `thoughts` 
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },

    // get all users
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
  }
};
  
module.exports = resolvers;