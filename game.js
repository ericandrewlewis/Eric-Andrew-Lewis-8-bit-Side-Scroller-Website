

var game = {

    current_direction : '',
    obstructed_directions : Array(), //array to hold obstructed directions
    move_recurrences : 0, //used for animation acceleration
    moving : false,
    eric : 0,
    
    //bootstrap
    init : function() {
        
        game.eric = $("#me"); //abbreviated resource for #me HTML element
        game.collisionChecker(); //start continuous collision checker
        
        //bind key events
        $(document).keydown( function(event) { game.keysDown(event) } );
        $(document).keyup( function(event) { game.keysUp(event) } );
        $(document).focusout(function() {   game.stopAllObjects(); });

    },

    keysDown : function(event) {

        var keyCode = parseInt(event.keyCode);
        game.move_recurrences++;

        switch(keyCode) {
            case 37:
                game.move('left');
            break;
            case 38:
                game.ericJump();
            break;
            case 39:
                event.preventDefault();
                game.move('right');
            break;
        }
   
    },

    keysUp : function(event) {

        var keyCode = parseInt(event.keyCode);
        switch(keyCode) {
            case 37:
            case 39:
            case 40:
                game.stopAllObjects();
            break;
            case 38:
            break;
        }
        game.move_recurrences = 0;
    
    },

    ericJump : function() {
        if( game.jumping )
            return;

        var distanceToFall = parseInt( game.eric.css('bottom') );
        if( !distanceToFall )
            distanceToFall = 1;
        

        game.jumping = true;
        game.jumping_direction = 'up';
        

        game.eric.animate(
            { bottom: '+=250'}, 
            225, 
            'easeOutQuad', 
            function() {
                game.jumping_direction = 'down';
                game.eric.animate(
                    {bottom: '-='+distanceToFall}, 
                    225*(distanceToFall/225), 
                    'easeInQuad', 
                    function() { 
                        game.jumping = false;
                        return;
                    });
                return;
            }
        );
    },

    stopAllObjects : function() {

        game.moving = false;
        $('.moving-object').stop(true);
        $('.moving-background-1').stop(true);
        if(game.current_direction == "left" )
            game.eric.attr('src','http://ericandrewlewis.nfshost.com/images/8-bit-site/me-standing-left.gif');
        if(game.current_direction == "right" )
            game.eric.attr('src','http://ericandrewlewis.nfshost.com/images/8-bit-site/me.gif');

    },

    move : function(direction) {

        game.current_direction = direction;

        //if character can't go that way, return false;
        if( ! game.go )
            return false;
        
        if(game.obstructed_directions[game.current_direction])
            return false;

        game.startRunning();

    },

    startRunning : function() {

        delta_x = 0;


        //set character gif to the moving gif
        if(game.current_direction == 'right') {
            if( game.eric.attr('src') != 'http://ericandrewlewis.nfshost.com/images/8-bit-site/me-running.gif')
                game.eric.attr('src','http://ericandrewlewis.nfshost.com/images/8-bit-site/me-running.gif');
        }
        if(game.current_direction == 'left') {
            if( game.eric.attr('src') != 'http://ericandrewlewis.nfshost.com/images/8-bit-site/me-running-left.gif')
                game.eric.attr('src','http://ericandrewlewis.nfshost.com/images/8-bit-site/me-running-left.gif');
        }

        //set change in css for animation
        if ("left" == game.current_direction)
            delta_x = '5000';
        else if ("right" == game.current_direction)
            delta_x = '-5000';

        if (delta_x == 0) return;
        
        if( ! game.move_recurrences)
            game.move_recurrences=1;
        
        custom_duration = 10000 + (10000 / game.move_recurrences) ;

        //stop all objects and restart animation
        $('.moving-object').stop(true);
        $('.moving-background-1').stop(true);

        if( game.moving ) {
            $('.moving-object').animate({
                left: '+=' + delta_x
            }, custom_duration, 'linear', function() {
                game.move_recurrences++;
            });

            $('.moving-background-1').animate({
                left: '+=' + delta_x/2,
            }, custom_duration, 'linear', function() {
                game.move_recurrences++;
            });
            return;
        }
        
        game.moving = true;

        
        
        $('.moving-object').animate({
            left: '+=' + delta_x
        }, custom_duration, 'linear', function() {
            
        });

        $('.moving-background-1').animate({
            left: '+=' + delta_x/2,
        }, custom_duration, 'linear', function() {
            
        });
    },

    getEricXPosition : function() {
        var left = ( parseInt( $('#hills-1').css('left') ) * -1 ) - 2000;
        if( isNaN( left ) ) 
            return;
        return left;
    },

    getEricYPosition : function() {
        var top = parseInt( game.eric.css('bottom') );
    if( isNaN( top ) ) return;
    return top;
    },

    landOnEdge : function() {

        if( game.landing )
            return;
        game.landing = true;
        game.eric.stop();
        game.eric.animate(
            { bottom: '-='+game.closenessToLedge}, 
            10, 
            'linear', 
            function() {
                game.jumping = false;
                game.landing = false;
                return;
            }
        );



    },

    updateDebugger : function () {
        
        // if( parseInt( $('.collisiondetection').html() ) == 1 )
        //     $('.collisiondetection').html("2");
        // else
        //     $('.collisiondetection').html("1");

        // var currentXPosition = game.getEricXPosition(); //debug
        // var currentYPosition = game.getEricYPosition(); //debug

        // $('.xpos').html(currentXPosition); //debug
        // $('.ypos').html(currentYPosition); //debug
        
        // $('.moverecurrences').html(game.move_recurrences); //debug

        // $('.direction').html(game.current_direction); //debug

        
        // if(game.go)
        //     $('.gamego').html('yes'); //debug
        // else
        //     $('.gamego').html('no'); //debug

        // if(game.landing)
        //     $('.landing').html('yes'); //debug
        // else
        //     $('.landing').html('no'); //debug
        
    },


    dropEric : function() {

        var distanceToFall = parseInt( game.eric.css('bottom') );
        if(distanceToFall < 3 || game.jumping )
            return;
        game.jumping = true;
        game.eric.animate(
            { bottom: '-='+distanceToFall },
            225, 
            'easeInQuad', 
            function() { 
                game.jumping = false;
                return;
            });
    },

    collisionChecker : function() {

        setTimeout( "game.collisionChecker()", 28 );

        game.updateDebugger();
        
        var currentXPosition = game.getEricXPosition(); //debug
        var currentYPosition = game.getEricYPosition(); //debug
        var onLedge = false;

        //check for collision against block

        $.each( $(".block"), 
            function(i, el ) { 

                object_left = parseInt( $(el).css('left') );

                object_right = object_left + parseInt( $(el).css('width') );

                objectLedgeHeight = parseInt( $(el).css('bottom') ) + parseInt( $(el).css('height') );
                closenessToLedge = currentYPosition - objectLedgeHeight;

                $('.objectleft').html(object_left); //debug
                $('.objectheight').html(game.closenessToLedge); //debug

                if ( object_right > 535 && object_left < 590 && ! game.jumping && closenessToLedge < 3 && closenessToLedge > -1 ) {
                    onLedge = true;
                } 
                //run into wall to right
                if( 520 < object_left && 620 > object_left && closenessToLedge < 0 ) {
                    
                    if( game.moving && game.current_direction=="right") {
                        game.stopAllObjects();
                        game.moving = false;  
                    }
                    game.obstructed_directions['right'] = true;
                } else if( 510 < object_right && 625 > object_right && closenessToLedge < 0 ) {
                    
                    if( game.moving && game.current_direction=="left") {
                        game.stopAllObjects();
                        game.moving = false;  
                    }
                    game.obstructed_directions['left'] = true;
                }else {
                    game.obstructed_directions['right'] = false;
                    game.obstructed_directions['left'] = false;
                }
                //found ledge below, land on it
                if ( object_right > 540 && object_left < 620 && closenessToLedge > 2 && closenessToLedge < 50 && game.jumping_direction == 'down' ) {
                    game.closenessToLedge = closenessToLedge;
                    game.landOnEdge();
                } 

            }
        );

        if( ! onLedge )
            game.dropEric();


        
        if( game.moving && game.obstructed_directions[game.current_direction] )
            game.go = false;
        else
            game.go = true;
    }
}

$(function() {
    //bootstrap
    game.init();
});
