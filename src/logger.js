// logQueue definition
let logQueue = [];
Object.defineProperty(logQueue, 'stringified', {
  get () { return JSON.stringify(this); }
});

logQueue.pushLogs = function () {
  console.log(this.stringified);
  this.length = 0;
}.bind(logQueue);

logQueue.logPoll = function () {
  if (this.length) {
    this.pushLogs();
  }
}.bind(logQueue);


// Logger
module.exports = {
  info(message) {
    logQueue.push({
      user: CMM.seeds.currentUser.id,
      message: message
    });

    setTimeout(logQueue.logPoll, 0);
  }
}
