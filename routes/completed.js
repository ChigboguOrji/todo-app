var express = require('express');
var router = express.Router();
var Todo = require('../models/todo-model');

router.use(function (req, res, next) {
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

/* GET users listing. */
router.get('/', function (req, res, next) {

  Todo.find({
    status: 'completed'
  }).sort({
    addedOn: -1
  }).exec(function (err, doneTasks) {
    if (err) return next(err);
    if (doneTasks) {
      res.render('completed', {
        completed: true,
        title: 'Completed tasks',
        tasks: doneTasks
      });
    }
  })
});


router.get('/mark-all-completed/', function (req, res, next) {

  Todo.updateMany({
    status: 'pending'
  }, {
    $set: {
      status: 'completed'
    }
  }, function (err, updatedAll) {
    if (err) return next(err);
    if (updatedAll) {
      req.flash('info', 'Wahoo!, All task has been completed');
      res.redirect('/todos/');
    }
  })
})

module.exports = router;