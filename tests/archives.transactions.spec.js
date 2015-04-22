'use strict';

/***********************************************************************************************************************************************
 * PERSISTENCE TRANSACTION TESTS
 ***********************************************************************************************************************************************
 * @description
 */

module.exports = function(data) {
  var vows = data.vows;
  var Archives = data.Archives;
  var Data = data.Data;
  var reporter = data.reporter;
  var assert = data.assert;

  //
  // CREATE
  //------------------------------------------------------------------------------------------//
  // @description
  var create = vows.describe('ARCHIVE:TRANSACTIONS:CREATE').addBatch({
    'When creating a user: ': {
      topic: function() {
        var self = this;

        Archives('users').create({record: Data.User}).then(function(data) {
          self.callback(null, data);
        }, function(err) {
          self.callback(err);
        });
      },
      'We should see a new user entity in the database': function(e, data) {
        assert.equal(e, null);
        assert.isNotEmpty(data);
      }
    }
  });

  //
  // READ
  //------------------------------------------------------------------------------------------//
  // @description
  var read = vows.describe('ARCHIVE:TRANSACTIONS:READ').addBatch({
    'When finding a record within the archives': {
      topic: function() {
        var self = this;

        Archives('users').find({query: Data.User}).then(function(data) {
          self.callback(null, data);
        }, function(err) {
          self.callback(err, null);
        });
      },
      'We should be able to locate the record': function(e, data) {
        assert.equal(e, null);
        assert.notEqual(data, null);
        assert.notEqual(data, undefined);
      }
    }
  });

  //
  // UPDATE
  //------------------------------------------------------------------------------------------//
  // @description
  var update = vows.describe('ARCHIVE:TRANSACTIONS:UPDATE').addBatch({
    'When updating a record within the archive': {
      topic: function() {
        var self = this;

        Archives('users').update({record: Data.User, data: {gender:'male'}}).then(function(data) {
          self.callback(null, data);
        }, function(err) {
          self.callback(err, null);
        });
      },
      'We should see the updated record:': function(e, data) {
        assert.equal(e, null);
        assert.notEqual(data, undefined);
        assert.notEqual(data, null);
      }
    }
  });

  //
  // DELETE
  //------------------------------------------------------------------------------------------//
  // @description
  var remove = vows.describe('ARCHIVE:TRANSACTIONS:DELETE').addBatch({
    'When deleting a record from within the data base.':  {
      topic: function () {
        var self = this;
        console.log(Data.User)
        Archives('users').delete({record: {_id:Data.User._id}}).then(function(data) {
          self.callback(null, data);
        }, function(err) {
          self.callback(err, null);
        });
      },
      'We should see the deleted record': function(e, data) {
        assert.equal(e, null);
        assert.notEqual(data, undefined);
        assert.notEqual(data, null);
      }
    }
  });

  //
  // RUN
  //------------------------------------------------------------------------------------------//
  // @description Execute specs

  // Create
  create.run({reporter: reporter}, function() {
    // Run read spec.
    read.run({reporter: reporter}, function() {
      // Update
      update.run({reporter: reporter}, function() {
        // Delete
        remove.run({reporter: reporter}, function(results) {
          console.log('Specs executed: ', results);
          process.exit(0);
        });
      });
    });
  });
};
