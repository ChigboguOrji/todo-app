var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
  task: {
    type: String,
    required: true,
    trim: true
  },

  status: {
    type: String,
    enum: ['completed', 'pending'],
    default: 'pending'
  },

  addedOn: {
    type: Date,
    default: Date.now
  }
});

TodoSchema
  .virtual('date')
  .get(function () {
    return this.addedOn.toUTCSting().slice(0, 8);
  });

module.exports = mongoose.model('Todo', TodoSchema, 'todos');