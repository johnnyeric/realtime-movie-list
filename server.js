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
            
            //io.emit('ping',el.new_val.name);
            
        });
    });
});
 
app.get('/',function(req,res){
    res.sendFile(__dirname + '/assets/html/index.html');
});

app.post('/tv_shows',function(req,res){
    var  name = req.body.name;
    r.table('tv_shows').insert({'name':name}).run(conn,function(err,result){
        res.send('success');
    });
    
});

app.get('/tv_shows',function(req,res){
    r.table('tv_shows').run(conn,function(err,cursor){
        cursor.toArray(function(err,result){
            res.json(result);

        });
    });
});

app.put('/tv_shows/:id',function(req,res){
    console.log(req.params.id);
    r.table('tv_shows').get(req.params.id).delete().run(conn,function(err,result){
        if(err) throw err;
        res.send('success on delete');
    });

});




io.on('connection', function(socket){
    users[socket.id] = 'New User';
    //io.emit('user_entered', {msg:'oi',user:'john doe'}); 
    io.emit('userList',users);
    console.log(socket.id);
    
    socket.on('change_name', function(data){
       users[this.id] = data.name;
       io.emit('userList',users);
    });
    
    socket.on('disconnect', function(data){
       delete users[this.id]; 
       io.emit('userList',users);
    });
});
