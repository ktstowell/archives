'use strict';

/***********************************************************************************************************************************************
 * ARCHIVES
 ***********************************************************************************************************************************************
 * @description Transactional wrapper for MongoDB within Node.js applications.
 */

//
// VENDOR DEPENDENCIES
//------------------------------------------------------------------------------------------//
// @description
var q = require('q');

//
// ARCHIVE PROCESS NAMESPACE
//------------------------------------------------------------------------------------------//
// @description
var Archives = global.Archives = {
  System: require('./system'),
};

//
// ARCHIVES ENTRY
//------------------------------------------------------------------------------------------//
// @description
module.exports = function(spec) {
  var def = q. defer();

  Archives.System.Mongo.connect(spec)
    .then(function(db) {
      def.resolve(Transactions(db));
    }, function(err) {
      def.reject(err);
    });

  return def.promise;
};
