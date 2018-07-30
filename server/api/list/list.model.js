const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  position: {
    type: Number,
    default: 0
  },
  cards: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'Card', 
      require: true
    }
  ],
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

module.exports = mongoose.model('List', ListSchema);