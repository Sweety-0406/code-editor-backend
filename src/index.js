const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require("./db/index")

dotenv.config({
    path:'./.env'
})


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL, 
        methods: ['GET', 'POST'], 
        allowedHeaders: ['Content-Type'], 
        credentials: true
    },
    connectionStateRecovery: {}
});

app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type'], 
    credentials: true
}));

app.get('/', (req, res) => {
   res.send("hii");
});


//router
const  userRouter = require('./routes/user.routes.js');
app.use("/api/v1/users",userRouter)


const groupMembers = {};
io.on('connection', async (socket) => {
    socket.on('join-chat',(groupId,username,userId, color)=>{
        socket.join(groupId);

        if(!groupMembers[groupId]){
            groupMembers[groupId] = []
        }
        // groupMembers[groupId].push({username,color})
        const userExists = groupMembers[groupId].some(member => member.userId === userId);
        if (!userExists) {
            groupMembers[groupId].push({ userId, username, color });
        }

         // Notify all members in the group about the new member
         io.to(groupId).emit('new-member', groupMembers[groupId]);
    })

    socket.on('leave-chat', (groupId, userId)=>{
        console.log("leave")
        socket.leave(groupId)

        if(groupMembers[groupId]){
            groupMembers[groupId] = groupMembers[groupId].filter(member => member.userId !== userId);
            if (groupMembers[groupId].length === 0) {
                delete groupMembers[groupId];
            }else {
                // Notify all members in the group about the updated member list
                io.to(groupId).emit('new-member', groupMembers[groupId]);
            }
        }
    })
    
    
    socket.on('chat-message', ( {groupId, msg, username, time}) => {
        console.log(`Message to room ${groupId} by ${username}: ${msg}`);
        io.to(groupId).emit('chat message', {msg, username, time});
    });

    //broadcast image of the board to all the users with same groupId
    socket.on("board",(canvasImage, groupId, userId)=>{
        console.log(`Image to room ${groupId} : ${canvasImage}`);
        socket.broadcast.to(groupId).emit('boardData', { canvasImage });
    })

    app.get('/group-members/:groupId', (req, res) => {
        const { groupId } = req.params;
        if (groupMembers[groupId]) {
            res.json(Array.from(groupMembers[groupId]));
        } else {
            res.json([]);
        }
    });

 
});

connectDB().then(()=>{
    server.listen(3000, () => {
      console.log('server running at http://localhost:3000');
    });
})
.catch((err)=>{
    console.log(err);
})


