var CentsToDollarsFormatter = {
  applyFormat: function(value){
    return (value/100).toFixed(2);
  }
}

module.exports = CentsToDollarsFormatter;
