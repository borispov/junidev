// A Script for checking the time of the day and running 
// Function if the time matches the requirements

// Pull out the last date Function has been run
// From a LOG.

const currentDate = new Date();

const cMin = currentDate.getMinutes();
const cHr = '';


// function sequence(list = []) {
//   list
//     .map(item => () =>  new Promise(resolve => isFunction(item) ? resolve(item()) : setTimeout(resolve, item)))
//     .reduce((prev, next) => prev.then(next), Promise.resolve());
// }
