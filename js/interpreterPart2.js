/* 
  Study material: http://ruslanspivak.com/lsbasi-part2/ 
  Read to see Ruslan's code changes to the interpreter.
*/

// Version 0.1.0

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

/*
    --Q1 Extend the calculator to handle multiplication of two integers
    Regex test for multiplication symbol
*/
function is_multipy( str ) {
  return /\*/.test( str );
}

/*
    --Q2 Extend the calculator to handle division of two integers
    Regex for finding division symbol
*/
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
  
  // Added advance method from Ruslan's blog
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
    // Scanner This method is responsible 
    
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
      
      /*
       --Q1 Extend the calculator to handle multiplication of two integers
       check current character is the multiplication symbol & advance current character
     */ 
      if( is_multipy( this.current_char ) ) {
         this.advance();
         return new Token( Type.MULTIPLY, "*" );
      }
      
      /*
       --Q2 Extend the calculator to handle division of two integers
       check current character is the division symbol & advance current character
     */
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
  
  /*
     --Q3 Modify the code to interpret expressions containing an arbitrary number of additions and subtractions, for example “9 - 5 + 3 + 11”
     I loop through all the tokens until I reach the "EOF" token
  */
  this.executeExpression = function( tokens ){
    var curr_Token = tokens[0];
    var sum = 0;
    var pos = 0;
    while( curr_Token.type !== "EOF" ){
       if(curr_Token.type === "INTEGER") {
         sum += curr_Token.value;        
       }
       else if( curr_Token.type === "PLUS" ){
          pos += 1;
          curr_Token = tokens[pos];
          sum += curr_Token.value;
       } else if( curr_Token.type === "MINUS" ){
          pos += 1;
          curr_Token = tokens[pos];
          sum -= curr_Token.value;
       } else if( curr_Token.type === "MULTIPLY" ){
          pos += 1;
          curr_Token = tokens[pos];
          sum  *= curr_Token.value;
       } else if( curr_Token.type === "DIVIDE" ){
          pos += 1;
          curr_Token = tokens[pos];
          sum /= curr_Token.value;
       }
       
       pos += 1;
       curr_Token = tokens[pos];       
    }    

     return sum;
  }
  
  this.expr = function(){
     var right;
     var left;
     var op;
     var result;
     
     this.current_token = this.get_next_token();
     
     while( this.current_token.type !== "EOF" ){
        // Check for Integer token
        if( this.current_token.type === "INTEGER" ){
           // eat current token and get next token
           this.eat( this.current_token.type );
           // Check that next token is op 
           if( !is_op( this.current_token.value ) && this.current_token.type !== "EOF" ) {
              console.log("error parsing..." );
           }
        }
        // Check for operator { +, -, *, / } 
        else if( is_op( this.current_token.value ) ){
           // eat current token and get next token
           this.eat( this.current_token.type );
           // 
           if( this.current_token.type !== "INTEGER" && this.current_token.type !== "EOF" ){
              console.log("error parsing..." );
              return "error parsing";
           }
        }
     }
     this.current_tokens.push( this.current_token );
     
     /*
         --Q3 Modify the code to interpret expressions containing an arbitrary number of additions and subtractions, for example “9 - 5 + 3 + 11”
         I loop through all the tokens until I reach the "EOF" token
     */
     return this.executeExpression( this.current_tokens );
     
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

var divideInterpreter = new Interpreter( "3 / 3" );
var result = divideInterpreter.expr();
console.log( result );

var divideInterpreter = new Interpreter( "3 / + 3" );
var result = divideInterpreter.expr();
console.log( result );

var divideInterpreter = new Interpreter( "33 33 - 33" );
var result = divideInterpreter.expr();
console.log( result );
