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
  }
};
