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
  
  /* 
   --Q 1. Modify the code to allow multiple-digit integers in the input, for example “12+3”
  
    Loop Check if text[pos] is a number.
      if true at character at text[pos] to string
      Increment position by 1
    
   Return new token created from num string.
  */
  this.getNumber = function() {
     var num = "";

     while( is_int( this.text.charAt( this.pos ) ) ){
        num += this.text.charAt( this.pos );
        this.pos += 1;
     }

     return new Token( Type.INTEGER, parseInt( num, 10 ) );
  }
  
  /*
      --Q 2. Add a method that skips whitespace characters so that your calculator can handle inputs with whitespace characters like ” 12 + 3”
     
      While whitespace is true
        Increment position by 1
      Assign current character to character at position in text.  text[ position ]
  */
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

/*     if ( is_int( current_char )){
       token = new Token( Type.INTEGER, parseInt( current_char, 10 ) );
       this.pos += 1;
       return token;
    } */
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
   
     // op = this.current_token;
     // this.eat( Type.MINUS );     
     
     
     /*
       --Q 3. Modify the code and instead of ‘+’ handle ‘-‘ to evaluate subtractions like “7-5”
       I commented the code for addition. Then added the code below for subtraction.
     */
     op = this.current_token;
     this.eat( Type.MINUS );
     
     right = this.current_token;
     this.eat( Type.INTEGER );
     
     result = left.value - right.value;
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


