const { User, Thought, Reaction } = require('../models');

const thoughtsController = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

// create thought
  createThought({ params, body },res) {
    Thought.create(body)
    .then(({ _id }) => {
        return User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { thoughts: _id } },
            { new: true, runValidators: true }
        );
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!'})
            return
        }
        res.json(dbUserData)
    })
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    });
},

  // update Thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

  // delete Thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought with this id!' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    });
},

    // add reaction
  addReaction({ params, body}, res) {
    Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $push: { reactions: body}},
    { new: true, runValidators: true })
    .select('-__v')
    .then(dbThoughtData => {
      if (!dbThoughtData) {
      res.status(404).json({ message: 'No thought with this id!' });
      return;
    }
    res.json(dbThoughtData);
  })
    .catch(err => res.status(400).json(err));  
  },

  // delete reaction
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId }}},
        { new: true })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.status(400).json(err));  
},
};

module.exports = thoughtsController;
