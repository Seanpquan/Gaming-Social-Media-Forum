const router = require('express').Router();
let Exercise = require('../models/exercise.model');

router.route('/').get((req, res) => {
  Exercise.find()
    .then(exercises => res.json(exercises))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = Date.parse(req.body.date);
  const comments = req.body.comments;
  const pic = req.body.pic;

  const newExercise = new Exercise({
    username,
    description,
    duration,
    date,
    comments,
    pic,
  });

  newExercise.save()
    .then(() => res.json('Exercise added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Exercise.findById(req.params.id)  //gets id directly from URL in line28
    .then(exercise => res.json(exercise))  //return the exercise as JSON
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Exercise.findByIdAndDelete(req.params.id)  //deletes from database
    .then(exercise => res.json('Exercise deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {  //req is request, res is the response
  Exercise.findById(req.params.id)
    .then(exercise => {
      exercise.username = req.body.username;  //set username to equal this because the route will receive a JSON object (request) 
      exercise.description = req.body.description; //that will contain a username, description, duration, and date.  
      exercise.duration = req.body.duration;  //assigning it to fields of exercise that already exists.
      exercise.date = Date.parse(req.body.date);
      exercise.comments = req.body.comments;
      exercise.pic = req.body.pic;

      exercise.save()
        .then(() => res.json('Exercise updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;