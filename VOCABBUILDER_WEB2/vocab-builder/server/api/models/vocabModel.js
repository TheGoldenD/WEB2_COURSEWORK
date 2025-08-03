const mongoose = require('mongoose');

const schema = mongoose.Schema;

const vocabSchema = new schema(
    {
        english: {
            type:String,
            required: 'English word is required',
        },
        german : {
            type: String,
            required: 'German word is required',
        }
    },
    {collection: 'vocab'}
);

module.exports = mongoose.model('Vocab', vocabSchema);