const { model, Schema } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/]
    },
    thoughts: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
},
{   toJson: {
    virtuals: true,
    getters: true
},
    id: false
});

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('Users', userSchema);

module.exports = User;