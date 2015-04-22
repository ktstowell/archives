'use strict';

/***********************************************************************************************************************************************
 * DELETE
 ***********************************************************************************************************************************************
 * @description Delete a document within the db.
 */
var q = require('q');

module.exports = function(Transactions) {

  /**
   * Deletes a record from within the archive.
   * @param  {[type]} collection [description]
   * @param  {[type]} spec       [description]
   * @return {[type]}            [description]
   */
  function remove(collection, spec) {
    var def = q.defer();

    Transactions.validate({type:'Delete', data: spec}).then(function() {

      collection.remove(spec.record, {w:1}, function(err) {

        if(err) {
          err = Transactions.Messages.Delete.error(err);

          Transactions.Logger.log({type: 'error', message: err}).then(function() {
            def.reject(err);
          });
        } else {
          Transactions.Logger.log({type: 'success', message: Transactions.Messages.Delete.success(Transactions.Logger.log.format(spec.record))}).then(function() {
            def.resolve(spec.record);
          });
        }
      });
    }, function(errs) {
      Transactions.Messages.All.Validation.error('DELETE', errs).then(function(message) {
        def.reject(message);
      });
    });

    return def.promise;
  }

  return remove;
};