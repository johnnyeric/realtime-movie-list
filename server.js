var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var r = require('rethinkdb');
var bodyParser = require('body-parser');

var users = {};

app.use('/assets',express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

server.listen(process.env.PORT,process.env.IP);
var conn;

var p = r.connect({host: 'localhost',port:28015});
p.then(function(c){
    conn = c;
    r.table('tv_shows').changes().run(c,function(err,res){
        res.each(function(idx,el){
            console.log(el);
            if(el.new_val){
                io.emit('add',el.new_val);
            }else{
                io.emit('del',el.old_val);
            }
            
        });
    });
});
 
app.get('/',function(req,res){
    res.sendFile(__dirname + '/assets/html/index.html');
});

app.get('/tv_shows',function(req,res){
    r.table('tv_shows').run(conn,function(err,cursor){
        cursor.toArray(function(err,result){
            res.json(result);

        });
    });
});

io.on('connection', function(socket){
    users[socket.id] = 'Anonymous';
    io.emit('user_list',users);
    console.log(socket.id);
    
    socket.on('change_name', function(data){
       users[this.id] = data.name;
       io.emit('user_list',users);
    });
    
    socket.on('add_movie', function(data){
        r.table('tv_shows').insert({'name':data.name}).run(conn, function(err, result) {
            if(err) throw err;
            var recent = {'user':users[socket.id], 'movie' : data.name, 'action' : 'add'};
            io.emit('recent',recent);//'User '+users[socket.id] + ' added a movie called ' + data.name
        });
    });
    
    socket.on('del_movie', function(data){
        r.table('tv_shows').get(data.id).delete().run(conn,function(err,result){
            if(err) throw err;
            var recent = {'user':users[socket.id], 'movie' : data.name, 'action' : 'del'};
            io.emit('recent',recent);//'User '+users[socket.id] + ' added a movie called ' + data.name
        });
    });
    
    socket.on('disconnect', function(data){
       delete users[this.id]; 
       io.emit('user_list',users);
    });
});
