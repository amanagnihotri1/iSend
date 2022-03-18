const chatForm=document.getElementById("uf");
const f=document.getElementById("formf");
const socket= io("http://localhost:5000");
const btn=document.getElementById("leavebtn");
const{ username,roominput }= Qs.parse(window.location.search,{
    ignoreQueryPrefix:true   
 });
 
socket.on("message",(m)=>
{  
outputMessage(m);
document.getElementById("msger-chat").scrollTop=document.getElementById("msger-chat").scrollHeight;
});
socket.emit("joinRoom",{username,roominput});

function outputMessage(msg)
{
    const div=document.createElement("div");
    div.classList.add("msg-left-msg");
    div.innerHTML=`
    <div class="msg-img" style="background-image: url(https://cdn-icons-png.flaticon.com/512/219/219983.png)">
    </div>      
    <div class="msg-bubble">
      <div class="msg-info">
        <div class="msg-info-name">${msg.user}</div>
        <div class="msg-info-time">${msg.time}</div>
      </div>
      <div id="msg-text">
        ${msg.text}
      </div>
    </div>`
 document.getElementById("msger-chat").appendChild(div);
}
f.addEventListener("submit",(e)=>
{
  e.preventDefault();
  const message=e.target.mess.value;
  socket.emit("chatMessage",message);
  e.target.mess.value="";
  e.target.mess.focus();
  document.getElementById("msger-chat").scrollTop=document.getElementById("msger-chat").scrollHeight;
});
btn.addEventListener("click",()=>
{ 
  window.location.href="login.html";    
  socket.emit("disconnect","User has left the room"); 
});
