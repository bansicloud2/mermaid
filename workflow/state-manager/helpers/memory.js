var dot = require("dot-object");
var Utils = require("../../../utils");

/* Memory Mapper Helper Class */

var MemoryHelper = function(state){
  this.state = state;
  this.memory = {};
};

MemoryHelper.prototype.getMemory = function(){

  for(var field in this.state.context.memory){

    var value = this.state.context.memory[field];

    this.resolveField(field, value)

  }

  return this.memory;

};

MemoryHelper.prototype.resolveField = function(key, value, root){

  if(root){
    key = root + "." + key;
  }

  if(value.field){

    var resolvedValue = dot.pick(value.field, this.state.context);

    dot.set(key, resolvedValue, this.memory);

  } else if(value.template) {

    var resolvedValue = Utils.injectVariables(value.template, this.state.context);

    dot.set(key, resolvedValue, this.memory);

  } else {

    /* This is a parent and need to resolve children */

    var parent = value;

    for(var field in parent){
      var v = parent[field];

      this.resolveField(field, v, key);
    }
  }


};



module.exports = MemoryHelper;
