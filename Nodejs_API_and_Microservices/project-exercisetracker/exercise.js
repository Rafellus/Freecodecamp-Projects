require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

// Exercise variables
const users = [];
class User {
  constructor(name, id) {
    this.username = name;
    this._id = id;
  }
  log = [];
}


// POST '/api/users'
exports.createUser = (req, res) => {
  // Take name
  const username = req.body.username;

  // Test if username is empty
  if (!username) {
    console.log(username, "No username give by user.");
    res.set('Content-Type', 'text/plain');
    return res.status(400).send("Path `username` is required.");
  }

  // Test is username is already in database.
  for (let i = 0; i < users.length; i++) {
    if ( users[i].username === username) {
      console.log(username, "is taken.");
      res.set('Content-Type', 'text/plain');
      return res.status(400).send("Username already taken");
    }
  }

  // Add new user to database.
  const id = uuidv4().split('-').join('');
  const user = new User(username, id);

  users.push(user);
  console.log("New User Created:\n", `username: ${user.username}\n_id: ${user._id}`);
  res.json({username: user.username, _id: user._id});
};

// GET '/api/users'
exports.getAllUsers = (req, res) => {
  res.json(users);
};

// POST '/api/users/:_id/exercises'
exports.addExercise = (req, res) => {
  const _id = req.params._id;
  const description = req.body.description,
    duration = parseInt(req.body.duration),
    date = req.body.date? new Date(req.body.date) : new Date();

  if (_id === "") {
    res.set('Content-Type', 'text/plain');
    res.status(404).send("not found");

  } else if ( !(description && duration)) {
    res.set('Content-Type', 'text/plain');
    res.status(500).send("Didn't fill required fields.");

  } else {
    for (let i = 0; i < users.length; i++){
      if (users[i]._id === _id) {
        // Store exercise data, except id.
        users[i].log.push({description, duration, date});
        console.log(`Added new exercise to user: ${_id}\n`, {description, duration, date});
        
        return res.json({
          _id: users[i]._id,
          username: users[i].username,
          date: date.toDateString(),
          duration,
          description
        });
      }
    }
  }
};

/*TEST USER micra id 6090235a66a4ce1d36a63c3b
*/

// GET '/api/users/:_id/log'
// optional query: [from][&to][&limit]
/* limit: amount of log to display starting with the
last.
from: start date (inclusive)
to: end date (exclusive)
 */
exports.userLog = (req, res) => {
  // set from, to equal to zero if no val.
  const _id = req.params._id
    fromDate = req.query.from ? new Date(req.query.from).getTime() : 0,
    toDate = req.query.to ? new Date(req.query.to).getTime() : new Date().getTime();

  // Search user in db
  for (let i = users.length - 1; i >= 0 ; i--){
    console.log("searching for user...")
    console.log('_id =', _id);
    if (users[i]._id === _id) {

      // if no limit value, then limit equal to log length
      const limit = req.query.limit? req.query.limit : users[i].log.length;
      let counter = 0;
      let log = users[i].log.filter(exercise => {
        if (counter < limit
        && exercise.date.getTime() >= fromDate
        && exercise.date.getTime() < toDate) {
          counter++;
          return true;
        } else {
          return false;
        }
      });
      console.log({
        _id: users[i]._id,
        username: users[i].username,
        count: log.length,
        log
      })
      return res.json({
        _id: users[i]._id,
        username: users[i].username,
        count: log.length,
        log
      });
    }
  }

  // User not found
  console.log("User not found.");
  res.set('Content-Type', 'text/plain');
  res.status(404).send("not found");
};