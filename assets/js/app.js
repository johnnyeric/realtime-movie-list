var socket = io.connect('https://node-workspace-johnnyeric.c9users.io/');
socket.on('ping', function(data){
   console.log(data) ;
    $('#tv_shows').append('<li>'+data+'</li>');
});

socket.on('add', function(data){
    $('#tv_shows').append('<li class="list-group-item">'+data.name+'<span id="del_'+data.id+'" class="btn-delete badge badge-danger">delete</span><span class="badge badge-info">newly added</span></li>');

});

socket.on('del',function(data){
    $('#del_'+data.id).closest('li').remove();
});

socket.on('user_entered',function(data){
   console.log(data.user + data.msg); 
   $('#user-list').append('<li>'+data.user+'</li>');
});

socket.on('userList',function(data){
    $('#user-list').html('');
    
    for(var key in data){
        $('#user-list').append('<li>'+data[key]+'</li>');
    }
   //console.log(data.user + data.msg); 
   
});

$(document).ready(function(){
    $.ajax({
        type:'GET',
        url:'tv_shows',
        dataType: 'json',
        success: function(data){

            $.each(data,function(idx,el){
                $('#tv_shows').append('<li class="list-group-item">'+el.name+'<span id="del_'+el.id+'" class="btn-delete badge badge-danger">delete</span></li>');
            });

        }

    });
    $('#add').on('click',function(){
        var json = {name : $('#name').val()};
        $.ajax({
            type:'POST',
            url: 'tv_shows',
            contentType: 'application/json',
            data: JSON.stringify(json),
            success: function(data){
                console.log(data);

            },
            error: function(err){
 

            }
        });
        $('#name').val('');
    });
    
     $('#setName').on('click',function(){
        var json = {name : $('#username').val()};
        socket.emit('change_name', json);
        $('#username').val('');
    });

    $('body').on('click','.btn-delete',function(){
        var id = $(this).attr('id').replace('del_','');
        $.ajax({
            type:'PUT',
            url: 'tv_shows/'+id,
            success: function(data){
                console.log(data);

            },
            error: function(err){
                console.log(err);

            }
        });
        

    });
    
});