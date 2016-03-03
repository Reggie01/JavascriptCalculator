/* 
* Optional if you want to run to run program from cmd line. 
* From node docs  https://nodejs.org/docs/latest-v0.12.x/api/readline.html#readline_example_tiny_cli
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('OHAI> ');
rl.prompt();

rl.on('line', function(line) {
  switch(line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log('Say what? I might have heard `' + line.trim() + '`');
      break;
  }
  //console.log( line.trim() );
  var interpreter = new Interpreter( line.trim() );
  var result = interpreter.expr();
  console.log( result );
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
}); */

// Version 0.1.0

var Type = {
  INTEGER: "INTEGER",
  PLUS: "PLUS",
  MINUS: "MINUS",
  EOF: "EOF"
}

function Token( type, value ) {
  this.type = type;
  this.value = value;
};

Token.prototype.toString = function() {
  return "Token(" + this.type + ", " + this.value + ")";
};


// Code for Error object creation in mdn docs https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
function InterpreterError(message) {
  this.name = 'MyError';
  this.message = message || 'Default Message';
  this.stack = (new Error()).stack;
}


function Interpreter( text ){
  
  this.text = text;
  this.pos = 0;
  this.current_token = null;
  this.current_char = "";
  
  this.error = function() {
     throw new InterpreterError( "Error parsing input." );
  }
  
  this.getNumber = function() {
     var num = "";

     while( is_int( this.text.charAt( this.pos ) ) ){
        num += this.text.charAt( this.pos );
        this.pos += 1;
     }

     return new Token( Type.INTEGER, parseInt( num, 10 ) );
  }
  

  this.skipWhiteSpace = function() {
     while( is_whitespace( this.text.charAt( this.pos ) ) ){
        this.pos += 1;
     }
     this.current_char = text.charAt( this.pos );  
  }
  
  this.get_next_token = function(){
    // Scanner This method is responsible 
    
    if ( this.pos > this.text.length - 1 ) {
       return new Token( Type.EOF, "" );
    }
    
    this.current_char = text.charAt( this.pos );  

    var result;
    
    if( is_whitespace( this.text.charAt( this.pos ) ) ){
       this.skipWhiteSpace();
    }
    
    if( is_int( this.text.charAt( this.pos ) ) ) {
      return this.getNumber( this.text.charAt( this.pos ) );
      
    }
    
    if( is_add( this.current_char ) ){
       token = new Token( Type.PLUS, this.current_char );
       this.pos += 1;
       return token;
    }
    
    if( is_subtract( this.current_char ) ){
      token = new Token( Type.MINUS, this.current_char );
      this.pos += 1;
      return token;
    }
    
    this.error();
  }
  
  this.eat = function( token_type ) {
     if ( this.current_token.type === token_type ){
        this.current_token = this.get_next_token();
     } else {
        this.error();
     }
       
  }
  
  this.expr = function(){
     var right;
     var left;
     var op;
     var result;
     
     this.current_token = this.get_next_token();
     
     left = this.current_token;
     this.eat( Type.INTEGER );
   
     op = this.current_token;
     
     if( this.current_token === "+" ){
       this.eat( Type.MINUS );     
     } else {
       this.eat( Type.MINUS );
     }
    
     right = this.current_token;
     this.eat( Type.INTEGER );
         
     if( this.current_token === "+" ){
        result = left.value + right.value;
     } else {
        result = left.value - right.value;
     }
     
     return result;
  }
}

function is_int(str){
  return /[0-9]+/.test(str);
}

function is_add(str) {
  return /\+/.test(str);
}

function is_subtract( str ){
  return /\-/.test( str );
}

function is_whitespace( str ){
  return / /.test( str );
}

var interpreter = new Interpreter( "22-2" );
var result = interpreter.expr();
console.log( result );

var interpreter1 = new Interpreter( "2     -             2" );
var result = interpreter1.expr();
console.log( result );


