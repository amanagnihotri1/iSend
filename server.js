const express=require("express");
const server=require("socket.io");
const app=express();
const path=require("path");
const http=require("http").createServer(app);
const cors=require("cors");
const{userJoin,getCurrentUser,userLeave}=require("./utils/user");
const io=require("socket.io")(http,{
    cors:{   
        origin: ["http://localhost:5000"]
    }
});
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());
//runs when user connect 
const formatMessage=require("./utils/message");
const botName="iSend Bot";
io.on("connection",(socket)=>
{  socket.on("joinRoom",({username,roominput})=>
{   const user=userJoin(socket.id,username,roominput);
    console.log(user);
    socket.join(user.roominput);
    socket.emit("message",formatMessage(botName,"Welcome To iSend Chat App"));
    socket.broadcast.to(user.roominput).emit("message",formatMessage(botName,`${user.username} has joined the room`));
    socket.on("chatMessage",(msg)=>
{    const user=getCurrentUser(socket.id);
    console.log(msg);
   io.to(user.roominput).emit("message",formatMessage(user.username,msg));
});  
});
socket.on("disconnect",(m)=>
{  
    const user=userLeave(socket.id);
    console.log(user);
    if(user)
    {  
    socket.broadcast.to(user.roominput).emit("message",formatMessage(botName,`${user.username} has left the chat`));
    } 
});
});   
app.get("/",(req,res)=>
{
    res.sendFile(__dirname+"/public/index.html");
});
app.get("/login",(req,res)=>
{
    res.sendFile(__dirname+"/public/login.html");
})
http.listen(process.env.PORT || 5000,(err)=>
{
    console.log("Server is Up");
if(err)
{
    console.log("Error Found Server failed");
}
});
