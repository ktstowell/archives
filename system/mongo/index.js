'use strict';

/***********************************************************************************************************************************************
 * ARCHIVES - SYSTEM - MONGO
 ***********************************************************************************************************************************************
 * @description
 */
var MongoDB = require('mongodb');
var q = require('q');

//
// MODULE API
//------------------------------------------------------------------------------------------//
// @description
module.exports = {
  Mongo: MongoDB,
  OBjectID: MongoDB.OBjectID,
  connect: connect
};

/**
 * Connect to a mongo db instance values will be validated at this point
 * 
 * @return {[type]} [description]
 */
function connect(spec) {
  var def = q.defer();
  
  return def.promise;
}