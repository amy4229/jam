import express from "express";
import http from "http";
import path from 'path';
import WebSocket, {
    WebSocketServer
} from "ws";

const __dirname = path.resolve();

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"))
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listen on http://localhost:3000')

const server = http.createServer(app);

const wss = new WebSocketServer({
    server
});

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "annonymous";
    console.log("Connected to Browser");
    socket.on("close", () => {
        console.log("disconnected from Browser X");
    })
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
            case "new_message":
                sockets.forEach(asocket => {
                    asocket.send(`${socket["nickname"]} : ${message.payload}`)
                });
                break;
            case "nickname":
                console.log(`nickName changed from ${socket["nickname"]} to ${message.payload} `)
                socket["nickname"] = message.payload;
                break;
        }
    })
});

server.listen(3000, handleListen);