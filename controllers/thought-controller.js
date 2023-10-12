
const { Thought, User } = require("../models");

const thoughtController = {
  // Get all Thoughts
  async getAllThought(req, res) {
    try {
      const thoughts = await Thought.find({})
        .populate({ path: "reactions", select: "-__v" })
        .select("-__v")
        .sort({ _id: -1 });
      res.json(thoughts);
    } catch (error) {
      handleError(error, res);
    }
  },

  // Get one Thought by id
  async getThoughtById({ params }, res) {
    try {
      const thought = await Thought.findOne({ _id: params.id })
        .populate({ path: "reactions", select: "-__v" })
        .select("-__v");

      if (!thought) {
        return sendNotFoundResponse(res, "No thought with this id!");
      }

      res.json(thought);
    } catch (error) {
      handleError(error, res);
    }
  },

  // Create Thought
  async createThought({ params, body }, res) {
    try {
      const thought = await Thought.create(body);
      const userId = body.userId;
      await updateUserThoughts(userId, thought._id, res);
    } catch (error) {
      handleError(error, res);
    }
  },

  // Update Thought by id
  async updateThought({ params, body }, res) {
    try {
      const thought = await Thought.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
      });

      if (!thought) {
        sendNotFoundResponse(res, "No thought found with this id!");
        return;
      }

      res.json(thought);
    } catch (error) {
      handleError(error, res);
    }
  },

  // Delete Thought
  async deleteThought({ params }, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: params.id });
      if (!thought) {
        sendNotFoundResponse(res, "No thought with this id!");
        return;
      }

      await updateUserThoughtsOnDelete(params.id, res);
    } catch (error) {
      handleError(error, res);
    }
  },

  // Add Reaction
  async addReaction({ params, body }, res) {
    try {
      const thought = await updateThoughtWithReaction(params.thoughtId, body, res);
      if (!thought) {
        sendNotFoundResponse(res, "No thought with this id");
        return;
      }
      res.json(thought);
    } catch (error) {
      handleError(error, res);
    }
  },

  // Remove Reaction
  async removeReaction({ params }, res) {
    try {
      const thought = await removeReactionFromThought(params.thoughtId, params.reactionId, res);
      res.json(thought);
    } catch (error) {
      handleError(error, res);
    }
  },
};

// Helper functions
function handleError(err, res) {
  console.log(err);
  res.sendStatus(400);
}

function sendNotFoundResponse(res, message) {
  res.status(404).json({ message });
}

async function updateUserThoughts(userId, thoughtId, res) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { thoughts: thoughtId } },
      { new: true }
    );

    if (!updatedUser) {
      sendNotFoundResponse(res, "Thought created but no user with this id!");
      return;
    }

    res.json({ message: "Thought successfully created!" });
  } catch (error) {
    handleError(error, res);
  }
}

async function updateUserThoughtsOnDelete(thoughtId, res) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { thoughts: thoughtId },
      { $pull: { thoughts: thoughtId } },
      { new: true }
    );

    if (!updatedUser) {
      sendNotFoundResponse(res, "Thought created but no user with this id!");
      return;
    }

    res.json({ message: "Thought successfully deleted!" });
  } catch (error) {
    handleError(error, res);
  }
}

async function updateThoughtWithReaction(thoughtId, reaction, res) {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $addToSet: { reactions: reaction } },
      { new: true, runValidators: true }
    );
    return thought;
  } catch (error) {
    handleError(error, res);
  }
}

module.exports = thoughtController;


