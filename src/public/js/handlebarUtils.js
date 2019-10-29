module.exports = {
  lessThan: function(x, y, options) {
    return x < y ? options.fn(this) : options.inverse(this);
  },

  timeAgo: function(x, options) {
    const today = new Date().getTime();
    const comparedTime = new Date(x).getTime();
    const diff = today - comparedTime;
    const d = diff / (1000 * 3600 * 24);
    return ~~d > 0 ? `${~~d}d ago` : 'Today'
  },

  logoLetter: function(x) {
    const ls = x.split(' ');
    return x.length < 2
      ? (ls[0][0] + ls[1][0]).toUpperCase()
      : (x[0] + x[1]).toUpperCase();
  },

  submitted: function(msg,val, options) {
    return msg === val
      ? options.fn(this)
      : options.inverse(this);
  },

  showStack: function(arr) {
    return arr.filter(x => x.length < 11);
  },

  isEq: function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  },

  // parseSoText: function(x) {
  //   const raw = x;
  //
  //   const splitByColons = raw.split(':')
  // }
};
