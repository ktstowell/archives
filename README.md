# Archives
Node.js Transactional wrapper for MongoDB.

# Installation
`npm install archives`

# Why

 Archives seeks to create a consistent transactional abstraction to make data operations easy and modular. Consider the following application structure:

 ```
 /modules
  --/users
        users.model.js
  --/sessions
        sessions.model.js
 ```

Both of these modules have to interact with user data. Implementing a data access abstraction prevents from either module having to know about the other while
still cutting back on redundancy; encouraging modules to be self contained to fulfill their own requirements.

# How

##### init

In the location in which you establish your database connection:

```
var archives = require('archives')({DB: databaseConfigObject});

archives.start().then(function() {
  // DB connection successfull, start the server!
});

```

##### implementation
With the above users module in mind, consider:

```
// Assuming the DAL is passed into the module. This is of course completely arbitrary.
module.exports = function(archives) {
  var Users = archives('users');

  // Users now has access to:
  Users.create({record: databaseInsertionObject}).then(function(createdRecord) {});
  Users.find({query: dataBaseQueryObject}).then(function(locatedRecord) {});
  Users.update({record: dataBaseQueryObject}).then(function(updatedRecord) {});
  Users.delete({{record: dataBaseQueryObject}}).then(function(deletedRecord) {});
};
```

# Issues
Please submit the, via the issues tab!
