const { Schema, Types, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// thoughts

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String, 
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date, 
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
)

// reactions

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectIdId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        } 
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
)



thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = models('Thought', thoughtSchema);

module.exports = { Thought };