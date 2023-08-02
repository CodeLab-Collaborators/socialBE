"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(5566, {
    cors: {
        origin: "*",
    },
});
let activeUsers = [];
io.on("connection", (socket) => {
    // add new User
    socket.on("new-user-add", (newUserID) => {
        // if user is not added previously
        if (!activeUsers.some((user) => user.userID === newUserID)) {
            activeUsers.push({ userID: newUserID, socketID: socket.id });
            console.log("New User Connected", activeUsers);
        }
        // send all active users to new user
        io.emit("get-users", activeUsers);
    });
    socket.on("disconnect", () => {
        // remove user from active users
        activeUsers = activeUsers.filter((user) => user.socketID !== socket.id);
        console.log("User Disconnected", activeUsers);
        // send all active users to all users
        io.emit("get-users", activeUsers);
    });
    // send message to a specific user
    socket.on("send-message", (data) => {
        const { receiverID } = data;
        const user = activeUsers.find((user) => user.userID === receiverID);
        console.log("Sending from socket to :", receiverID);
        console.log("Data: ", data);
        if (user) {
            io.to(user.socketID).emit("recieve-message", data);
        }
    });
});
