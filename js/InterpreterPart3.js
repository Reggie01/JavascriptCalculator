/* 
  Study material: http://ruslanspivak.com/lsbasi-part3/ 
  Read to see Ruslan's code changes to the interpreter.
*/

// Version 0.2.0

var Type = {
  INTEGER: "INTEGER",
  PLUS: "PLUS",
  MINUS: "MINUS",
  MULTIPLY: "MULTIPLY",
  DIVIDE: "DIVIDE",
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

// Regex for Interpreter
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

function is_op( str ){
   return /[*/+-]/.test( str );
}

function is_multipy( str ) {
  return /\*/.test( str );
}

function is_divide( str ){
  return /\//.test( str );
}

function Interpreter( text ){
  
  this.text = text;
  this.pos = 0;
  this.current_token = null;
  this.current_char = this.text[this.pos];
  this.current_tokens = [];
  
  this.error = function() {
     throw new InterpreterError( "Error parsing input." );
  }
  
  this.advance = function() {
     this.pos += 1;
     if ( this.pos > this.text.length - 1 ) {
        this.current_char = null;
     } else {
        this.current_char = this.text[this.pos];
     }
  }
  
  this.getNumber = function() {
     var num = "";

     while( is_int( this.current_char ) ){
        num += this.current_char;
        this.advance();
     }

     return num;
  }
  

  this.skipWhiteSpace = function() {
     while( is_whitespace( this.current_char ) ){
        this.advance();
     }
  }
  
  this.get_next_token = function(){
    // Scanner 
    
    while( this.current_char ) {
      if( is_whitespace( this.current_char ) ){
       this.skipWhiteSpace();
       continue;
      }
      
      if( is_int( this.current_char ) ) {
        return new Token( Type.INTEGER, parseInt( this.getNumber(), 10 ) );     
      }
      
      if( is_add( this.current_char ) ){
        this.advance();
        return new Token( Type.PLUS, "+" );;
      }
      
      if( is_subtract( this.current_char ) ){
        this.advance();
        return new Token( Type.MINUS, "-" );;
      }
       
      if( is_multipy( this.current_char ) ) {
         this.advance();
         return new Token( Type.MULTIPLY, "*" );
      }
      
      if( is_divide( this.current_char) ){
         this.advance();
         return new Token( Type.DIVIDE, "/" );
      }
      
      this.error();
      
    }
        
     return new Token( Type.EOF, "" );
    
  }
  
  this.eat = function( token_type ) {
     if ( this.current_token.type === token_type ){
        this.current_tokens.push( this.current_token );
        this.current_token = this.get_next_token();
     } else {
        this.error();
     }
       
  }
  
  this.term = function() {
     // Return an INTEGER token value
     var token = this.current_token;
     this.eat( token.type );
     return token.value;
  }
  
  this.expr = function(){
     // Arithmetic expression parser/interpreter.
     // set current token to the first token taken from the input
     this.current_token = this.get_next_token();
    
     var result = this.term();

     /* while( this.current_token.type === "PLUS" || this.current_token.type === "MINUS" ){
        var token = this.current_token;
        if( token.type == Type.PLUS ){
           this.eat( Type.PLUS )
           result += this.term();
        } else if( token.type == Type.MINUS ){
           this.eat( Type.MINUS );
           result -= this.term();
        }
     } */
     
     /*
       Q2. Modify the source code of the calculator to interpret arithmetic expressions that contain only multiplication and division, for example “7 * 4 / 2 * 3”
     */
      while( this.current_token.type === "MULTIPLY" || this.current_token.type === "DIVIDE" ){
        var token = this.current_token;
        if( token.type == Type.MULTIPLY ){
           this.eat( Type.MULTIPLY )
           result *= this.term();
        } else if( token.type == Type.DIVIDE ){
           this.eat( Type.DIVIDE );
           result /= this.term();
        }
      }
      
     
     return result;
  }
}

var interpreter = new Interpreter( "22+2" );
var result = interpreter.expr();
console.log( result );

var interpreter1 = new Interpreter( "2     -             2" );
var result = interpreter1.expr();
console.log( result );

var interpreter1 = new Interpreter( "3    +             2" );
var result = interpreter1.expr();
console.log( result );

var multiplyInterpreter = new Interpreter( "3    *             2" );
var result = multiplyInterpreter.expr();
console.log( result );

var divideInterpreter = new Interpreter( "3    /             2" );
var result = divideInterpreter.expr();
console.log( result );

var multiplyInterpreter1 = new Interpreter( "10   /             2" );
var result = multiplyInterpreter1.expr();
console.log( result );