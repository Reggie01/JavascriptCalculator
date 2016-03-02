$(document).ready( function() {
  
  // Comiple handlbars template
 /*  var listComponent   = $("#list-template").html();
  var listTemplate = Handlebars.compile( listComponent ); */

  /* $( "#list_container" ).html( listTemplate ); */
  
  function clickHandler( e ){
     var foo = $( this ).data( "id" );
     console.log( foo );
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
     console.log( key );
     if( e.which >= 42 && e.which <= 57 || e.which === 61 || e.which === 13 ){
          console.log( +String.fromCharCode( key ) + 1 );
         // if()
     }
  }
  
  $( document ).keypress( keyHandler );
  
  $( ".calc_buttons_container" ).delegate( ".calc_button", "click", clickHandler );
    
});