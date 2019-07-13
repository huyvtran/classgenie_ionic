angular.module('starter.services', [])
 
.service('VideoService', function($q) {
    // TBD
var deferred = $q.defer();
var promise = deferred.promise;
 
promise.success = function(fn) {
	promise.then(fn);
	return promise;
}
promise.error = function(fn) {
	promise.then(null, fn);
	return promise;
}

    
});