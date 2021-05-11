require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const exercise = require('./exercise');

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded( {extended: false}) );
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// API
app.route('/api/users')
  .post(exercise.createUser)
  .get(exercise.getAllUsers);

app.post('/api/users/:_id/exercises', exercise.addExercise);

// optional query: [from][&to][&limit]
app.get('/api/users/:_id/logs', exercise.userLog);

// Port
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
})
