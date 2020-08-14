const http = require('http');
const path = require('path');
const fs = require('fs');
const io = require('socket.io')(3000);

const users = {}
io.on('connection', socket => {
    socket.on('new-user',name =>{
        users[socket.id]=name
        socket.broadcast.emit('user-connected',name)
    })
    socket.on('send-chat-message',message =>{
        socket.broadcast.emit('chat-message',{message:message, name:users[socket.id]})
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('user-disconnected',users[socket.id])
        
    })
});
const server = http.createServer((req,res)=>{

    let filePath = path.join(__dirname,'public',req.url==='/' ? 'index.html' : req.url );
     //Set Initial Content Type
     let extname = path.extname(filePath);
     let contentType = 'text/html';
     switch(extname){
         case '.js':
             contentType = 'text/javascript';
             break;
         case '.css':
             contentType = 'text/css';
             break;
         case '.json':
             contentType = 'application/json';
             break;
         case '.png':
             contentType = 'image/png';
             break;
         case '.jpg':
             contentType = 'image/jpeg';
             break;
     }
    fs.readFile(filePath,(err,content)=>{
            if(err)
            {
                fs.readFile(path.join(__dirname,'public','404.html'),(err,content)=>{
                    if(err)
                    {
                        throw err;
                    }
                    else{
                        res.writeHead(200,{'Content-Type':'text/html'});
                        res.end(content,'utf8')
                    }
                })
            }
            else{
                res.writeHead(200,{'Content-Type': 'text/html'});
                res.end(content,'utf8');
            }
        })

})
const PORT = process.env.PORT || 5000;

server.listen(5000);