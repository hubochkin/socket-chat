$(function() {
  //make connection
  var x = 'ws://localhost';

  // var socket = io.connect(x + ':3000/socket.io/socket.io.js"', {
  //   extraHeaders: {},
  //   query: { a: 1 },
  // });

  var socket = io.connect(window.location.origin);

  //buttons and inputs
  var message = $('#message');
  var username = $('#username');
  var send_message = $('#send_message');
  var send_username = $('#send_username');
  var chatroom = $('#chatroom');
  var feedback = $('#feedback');

  //Emit message
  send_message.click(function() {
    socket.emit('new_message', { message: message.val() });
  });

  //Listen on new_message
  socket.on('new_message', data => {
    feedback.html('');
    if (socket.id === data.id) message.val('');
    chatroom.append("<p class='message'>" + data.username + ': ' + data.message + '</p>');
  });

  //Emit a username
  send_username.click(function() {
    socket.emit('change_username', { username: username.val() });
    let message1 =
      "<p class='message'>" +
      'Дмитрий великий' +
      ': пользователь' +
      '<b>' +
      ' ' +
      username.val() +
      '</b>' +
      ' вошел в чат ' +
      '</p>';
    socket.emit('new_message', { message: message1.val() });

    // chatroom.append(
    //   "<p class='message'>" +
    //     'Дмитрий великий' +
    //     ': пользователь' +
    //     '<b>' +
    //     ' ' +
    //     username.val() +
    //     '</b>' +
    //     ' вошел в чат ' +
    //     '</p>',
    // );
  });

  //Emit typing
  message.bind('keypress', () => {
    socket.emit('typing');
  });

  //Listen on typing
  socket.on('typing', data => {
    feedback.html('<p><i>' + data.username + ' is typing a message...' + '</i></p>');
  });
});
