'use strict';

/***********************************************************************************************************************************************
 * ARCHIVES
 ***********************************************************************************************************************************************
 * @description Transactional wrapper for MongoDB within Node.js applications.
 */

//
// ARCHIVE DEPENDENCIES
//------------------------------------------------------------------------------------------//
// @description
var MongoDB = require('mongodb');
var Client = MongoDB.MongoClient;
var OID = MongoDB.ObjectID;
var q = require('q');

//
// ARCHIVES ENTRY
//------------------------------------------------------------------------------------------//
// @description
module.exports = function(spec) {
  var Archives = {validated: q.defer(), Logger: require('./logging')};
  //
  // ARCHIVE VALIDATION
  //------------------------------------------------------------------------------------------//
  // @description
  Archives.validate = function(validators, data, def) {
    var failed = {};
    // Stored promise obj
    def = def || q.defer();

    if(!data) { failed['undefined'] = validators['undefined']; }

    for(var prop in validators.required) {
      if(!data || !data[prop]) { failed[prop] = validators.required[prop]; }
    }

    if(Object.keys(failed).length) {
      def.reject(failed);
    } else {
      def.resolve();
    }

    return def.promise;
  };

  /**
   * Module level config validation.
   * @type {{DB: {undefined: string, required: {name: string}}, failed: Function}}
   */
  Archives.validation = {
    DB: {
      undefined: 'ARCHIVES: Please provide the Archives with a config object: require{"archives"}({DB: {}})',
      required: {
        name: 'ARCHIVES: Please provide us the name of the database you wish to connect to within the DB object.'
      }
    },
    failed: function(errs) {
      return 'ARCHIVES: Initialization failed with the following errors: '+ Archives.Logger.format(errs);
    }
  };

  //
  // ARCHIVE DEFAULTS
  //------------------------------------------------------------------------------------------//
  // @description

  /**
   * Connection defaults
   * @type {{prefix: string, url: string, host: string, port: number}}
   */
  Archives.DB = {
    prefix: 'mongodb://',
    url: '',
    host: 'localhost',
    port: 27017
  };

  /**
   * Logging defaults
   * @type {{mode: string}}
   */
  Archives.logging = {
    mode: 'development'
  };

  //
  // CONFIG INGESTION
  //------------------------------------------------------------------------------------------//
  // @description

  // Some minimal dummy-proofing
  spec = spec || {};
  spec.logging = spec.logging || {};

  // Set up logging defaults
  Archives.logging.mode = spec.logging.mode || Archives.logging.mode;
  // Init Logger
  Archives.Logger = Archives.Logger(Archives.logging);
  Archives.Transactions = require('./transactions')(Archives);

  // Perform argument validation
  Archives.validate(Archives.validation.DB, spec.DB, Archives.validated).then(function() {
    // Set up connection defaults
    Archives.DB.name = spec.DB.name;
    Archives.DB.host = spec.DB.host || Archives.DB.host;
    Archives.DB.port = spec.DB.port || Archives.DB.port;
    Archives.DB.url = (Archives.DB.prefix + Archives.DB.host + ':' +Archives.DB.port + '/' + Archives.DB.name);
  }, function(errs) {
    Archives.Logger.throw({label: 'ARCHIVES:ERROR: ', message: (Archives.validation.failed(errs))});
  });

  // Create instance

  //
  // ARCHIVE ENTRY API
  //------------------------------------------------------------------------------------------//
  // @description
  function API(collection) {
    collection = Archives.DB.instance.collection(collection);

    return {
      find: function(spec) { return Archives.Transactions.find(collection, spec); },
      create: function(spec) { return Archives.Transactions.create(collection, spec); },
      update: function(spec) { return Archives.Transactions.update(collection, spec); },
      delete: function(spec) { return Archives.Transactions.delete(collection, spec); }
    };
  }

  /**
   * Opens the DB connection
   */
  API.start = function() {
    var def = q.defer();

    Archives.validated.promise.then(function() {
      Client.connect(Archives.DB.url, function(err, instance) {
        if(err) {
          Archives.Logger.throw({label: 'ARCHIVES:CANNOT CONNECT TO DATABASE: ', message: err});
        } else {
          Archives.DB.instance = instance;
          def.resolve(Archives.DB);
        }
      });
    });

    return def.promise;
  };

  return API;
};
