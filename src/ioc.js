// http://css.dzone.com/articles/dependency-injection-0
var IOC = function () {
    this.dependencies = {};

    this.add = function(qualifier, obj){
        this.dependencies[qualifier] = obj;
    };

    this.get = function(func) {
        var obj = new func;
        var dependencies = this.resolveDependencies(func);
        func.apply(obj, dependencies);

        return obj;
    };

    this.resolveDependencies = function(func) {
        var args = this.getArguments(func);
        var dependencies = [];
        for ( var i = 0; i < args.length; i++) {
            dependencies.push(this.dependencies[args[i]]);
        }

        return dependencies;
    };

    this.getArguments = function(func) {
        // This regex is from require.js
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var args = func.toString().match(FN_ARGS)[1].split(/\s*,\s*/);

        return args;
    };
};

module.exports = IOC;