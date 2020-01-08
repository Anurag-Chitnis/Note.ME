const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deletedSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    favIdea: {
        type: String,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    deletedIdea: {
        type: Boolean,
        default: false
    }
})

module.exports = deletedIdea = mongoose.model("deleteIdea", deletedSchema);