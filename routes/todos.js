var express = require('express');
var router = express.Router();
var Todo = require('../models/todo-model');

router.use(function (req, res, next) {
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

/* GET todos listing. */
router.get('/', function (req, res, next) {
  Todo.find().sort({
    addedOn: -1
  }).exec(function (err, done) {
    if (err) return next(err);
    if (done) {
      res.status(200);
      res.render('todos', {
        todos: true,
        title: 'All todo list',
        tasks: done
      });
    }
  })
});


router.post('/add-task/', function (req, res, next) {
  var taskPost = {
    task: req.body.task
  };
  Todo.findOne({
    task: taskPost.task
  }, function (err, done) {
    if (err) next(err);
    if (done) {
      req.flash('error', 'Todo already exist');
      return res.redirect('/todos/');
    }

    var newTask = new Todo(taskPost);
    newTask.save(function (err, done) {
      if (err) return next(err);
      if (done) {
        res.status(201);
        console.log('Task saved as %s', done.task);
        req.flash('info', 'A task is being added to your list')
        res.redirect('/todos/');
      }
    })
  })
})



// Deleting a task
router.get('/delete/:id/', function (req, res, next) {
  var itemId = req.params.id;

  Todo.findByIdAndDelete(itemId, function (err, deleted) {
    if (!err && deleted) {
      res.status(201);
      req.flash('info', 'Activity deleted')
      res.redirect('/todos/');
    } else {
      res.sendStatus(500)
    }
  })
})



// Mark a completed task
router.get('/mark-as-completed/:id', function (req, res, next) {
  var id = req.params.id;

  Todo.findByIdAndUpdate(id, {
    $set: {
      status: 'completed'
    }
  }, function (err, updated) {
    if (err) return next(err);
    if (updated) {
      req.flash('info', 'Wahoo! so nice, an activity completed');
      res.redirect('/todos/');
    }
  })
});


module.exports = router;