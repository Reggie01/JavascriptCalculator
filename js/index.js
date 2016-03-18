$(document).ready( function() {
  
  // Comiple handlbars template
 /*  var listComponent   = $("#list-template").html();
  var listTemplate = Handlebars.compile( listComponent ); */

  /* $( "#list_container" ).html( listTemplate ); */
  var sum = "";
  
  function clickHandler( e ){
     var foo = $( this ).data( "id" );
     
     if( foo === "c" ) {
         sum = "";
     } else if( foo !== "=" ){
        if( sum === "0" ){
          sum = "";
        } else {
          sum += foo; 
        }
       $( ".calc_total_display_number" ).val( sum );
     } else {
       var lexer = Lexer( regexHelpers );
       lexer.init( sum );
       var tokens = lexer.createTokens();
       var interpret = Interpreter();
       interpret.init( tokens );
       sum = interpret.expr();
        $( ".calc_total_display_number" ).val( sum );
     }
     
     
  }
  
  var keyMap = {
     "13": "=",
     "42": "*",
     "43": "+",
     "45": "-",
     "46": ".",
     "47": "/",
     "48": "0",
     "49": "1",
     "50": "2",
     "51": "3",
     "52": "4",
     "53": "5",
     "54": "6",
     "55": "7",
     "56": "8",
     "57": "9"
  }
  
  function keyHandler( e ){
     var key = e.which;
     
     if( key === 67 || key === 99 ){
        sum = "";
        $( ".calc_total_display_number" ).val( sum );
     } else if( key === 13 ){
       var lexer = Lexer( regexHelpers );
       lexer.init( sum );
       var tokens = lexer.createTokens();
       var interpret = Interpreter();
       interpret.init( tokens );
       sum = interpret.expr();
       $( ".calc_total_display_number" ).val( sum );
       console.log( sum );
     } else if( key === 47 || key === 42 || key === 45 || key === 43 || key === 41 || key === 40 ){
          sum += String.fromCharCode( key );
          console.log( sum );         
         $( ".calc_total_display_number" ).val( sum );
     } else if( e.which >= 42 && e.which <= 57 || e.which === 61 ){      
         if( $( ".calc_total_display_number" ).val() !== "0" ){
           sum += +String.fromCharCode( key ) + "";
           console.log( sum );
           $( ".calc_total_display_number" ).val( sum );
         } else {
           sum = "";
           sum = +String.fromCharCode( key ) + "";
           console.log( sum );
           $( ".calc_total_display_number" ).val( sum );
         }          
     }
  }
  
  
  
  $( document ).keypress( keyHandler );
  
  $( ".calc_buttons_container" ).delegate( ".calc_button", "click", clickHandler );
    
});