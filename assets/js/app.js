var socket = io.connect();

socket.on('add', function(data){
    $('#tv_shows').append('<li class="list-group-item"><span data-field="name">'+data.name+'</span><span id="del_'+data.id+'" class="btn-delete badge badge-danger">delete</span><span class="badge badge-info">newly added</span></li>');

});

socket.on('del',function(data){
    $('#del_'+data.id).closest('li').remove();
});

socket.on('user_entered',function(data){
   console.log(data.user + data.msg);
   $('#user-list').append('<li>'+data.user+'</li>');
});

socket.on('user_list',function(data){
    $('#user-list').html('');

    for(var key in data){
        $('#user-list').append('<li><span class="badge badge-success">&nbsp</span> '+data[key]+'</li>');
    }

});

socket.on('recent',function(data){
    if($('#recent li').length >= 5){
        $('#recent li:last-child').remove();
    }
    var actionMessage = data.action === 'add' ? 'added' : 'removed';
    $('#recent').prepend('<li>User '+data.user + ' '+actionMessage + ' a movie called ' + data.movie+'</li>');
});

$(document).ready(function(){
    $.ajax({
        type:'GET',
        url:'tv_shows',
        dataType: 'json',
        success: function(data){

            $.each(data,function(idx,el){
                $('#tv_shows').append('<li class="list-group-item"><span data-field="name">'+el.name+'</span><span id="del_'+el.id+'" class="btn-delete badge badge-danger">delete</span></li>');
            });

        }

    });
    $('#add').on('click',function(){
        var json = {name : $('#name').val()};
        socket.emit('add_movie',json); // faster, because there is already a connection, ajax creates http overhead as it creates a connection
        $('#name').val('');
    });

     $('#setName').on('click',function(){
        var json = {name : $('#username').val()};
        socket.emit('change_name', json);
        $('#username').val('');
    });

    $('body').on('click','.btn-delete',function(){
        var id = $(this).attr('id').replace('del_','');
        var name =  $(this).closest('li').find('[data-field=name]').html();
        socket.emit('del_movie', {'id': id, 'name' : name});
    });

});
