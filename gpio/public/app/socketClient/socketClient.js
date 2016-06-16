var socket = io.connect();
// var socket = io.connect('http://localhost:3000', {'forceNow' : true});

socket.on('messages', function (data) {
  console.log("socketClient");
  console.log(data);
})

function render (data) {
  var html = '<div><strong> ${data.author} </strong><em> ${data.text} </em></div>';

  document.getElementById('messages').innerHTML = html;

}

function addMessage ()  {
  var payload = {
    author : document.getElementById('username').value,
    text : document.getElementById('msg').value
  };

  console.log("socketService : emit new-message");
  io.emit('new-message', payload);

  io.on('messages', function (data) {
    console.log("socketService");
    console.log(data);
    render(data);
  });
