const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    position: Number,
    list: {
        type: Schema.Types.ObjectId,
        ref: 'List',
        require: true
    }, timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
     });
    
     module.exports = mongoose.model('Card', cardSchema);