
var socketsConfig = function (io) {

  this.io = io;

  this.messages = [
    {
     id : 1,
      text : "olá",
      author : "me"
    }
  ];

  this.init();
}



socketsConfig.prototype.init = function () {

  var self = this;

  self.io.on('connection', function (socket) {
    console.log("Socket connected !!");

    socket.emit('messages', self.messages);

    socket.on('disconnect', function () {
      console.log("Socket disconnected !!");
    });

    socket.on('new-message', function (data){
      console.log("www : new-message");
      self.messages.push(data);

      self.io.sockets.emit('messages', self.messages);
    });
  });

}

module.exports = socketsConfig;
