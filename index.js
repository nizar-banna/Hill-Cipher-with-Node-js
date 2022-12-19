var express = require("express");
let app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
var mKey = null;
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  console.log("connection");
  socket.on("connection", function (key) {
    if (mKey == null) {
      mKey = key;
    }
    io.emit("key", mKey);
  });
  console.log(`key is ${mKey}`);

  socket.on("chat message", function (msg) {
    io.emit("chat message", msg);
  });
});

http.listen(port, function () {
  console.log("listening on *:" + port);
});
