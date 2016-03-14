/* 
  Study material: http://ruslanspivak.com/lsbasi-part3/ 
  Read to see Ruslan's code changes to the interpreter.
  The following code is my answer from Ruslan's blog exercises.
*/

// Version 0.2.0
/* 
   Q3/Exercise from Ruslan's blog
   Write an interpreter that handles arithmetic expressions like “7 - 3 + 2 - 1” from scratch. Use any programming language you’re comfortable with and write it off the top of your head without looking at the examples. When you do that, think about components involved: a lexer that takes an input and converts it into a stream of tokens, a parser that feeds off the stream of the tokens provided by the lexer and tries to recognize a structure in that stream, and an interpreter that generates results after the parser has successfully parsed (recognized) a valid arithmetic expression. String those pieces together. Spend some time translating the knowledge you’ve acquired into a working interpreter for arithmetic expressions.

/* 
  Token class
    Parameters
      -- value
      -- type
    local variables
      -- value
      -- type
*/

function Token( type, value ){
   this.type = type;
   this.value = value;
}

/*
  Token Types
  -- object literal
*/
var Type = {
   INTEGER: "INTEGER",
   MULTIPLY: "MULTIPLY",
   DIVIDE: "DIVIDE",
   ADD: "ADD",
   SUBTRACT: "SUBTRACT",
   EOF: "EOF"
}

/* 
  Regex for types
    -- *,/,+,-
    -- whiteSpace
    -- 0-9 integer
*/

function isInteger( num ){
   return /[0-9]/.test( num );
}

function isMultiplyOp( character ){
   return /\*/.test( character );
}

function isDivideOp( character ) {
   return /\//.test( character );
}

function isAdditionOp( character ){
   return /\+/.test( character );
}

function isSubtractionOp( character ){
   return /\-/.test( character );
}

function isOperator( character ){
   return /[*\+-]/.test( character );
}

function isWhiteSpace( character ){
   return / /.test( character );
}

/*
   Lexer class
     Purpose
       Create tokens from text.
     Parameter
       type String
     Variables
       position - type INTEGER
       current char - type STRING
       tokens - array of tokens
     Functions
       advance - advance current position
       createInteger - create an Integer from a string of text
       createTokens - create token from current character
       checkForWhiteSpace - check if current char is whitespace.
*/

function Lexer( text ){
  this.text = text;
  this.position = 0;
  this.currentChar = this.text.charAt( this.position );
  this.tokens = [];
  this.EOF = false;
  
  this.advance = function(){
    this.position += 1;
    
    if( this.position >= this.text.length ){
       this.currentChar = null;
       this.EOF = true;
    } else {
       this.currentChar = this.text.charAt( this.position );     
    }

  }
  
  this.createInteger = function(){
    var sum = "";
    while( isInteger( this.currentChar ) ){
      sum += this.currentChar;
      this.advance();
    }
    return sum;
  }
  
  this.checkForWhiteSpace = function( currentChar ) {
   while( isWhiteSpace( this.currentChar ) ){
      this.advance();
   }
  }
  
  this.createTokens = function() {
     
     while( this.EOF !== true ){
       if( isWhiteSpace( this.currentChar ) ) {
          this.checkForWhiteSpace();
       }
       
       if( isInteger( this.currentChar ) ){
          this.tokens.push( new Token( Type.INTEGER, parseInt( this.createInteger(), 10 ) ) );
       }
       
       if( isAdditionOp( this.currentChar ) ){
          this.tokens.push( new Token( Type.ADD, "+") );
          this.advance();
       }
       
       if( isSubtractionOp( this.currentChar ) ){
          this.tokens.push( new Token( Type.SUBTRACT, "-" ) );
          this.advance();
       }
       
     }
     
     this.tokens.push( new Token( Type.EOF, "EOF" ) );
     return this.tokens;
  }
  
}
       
var lexer = new Lexer( "2 + 2" );
console.log( lexer.createTokens() );
       
var lexer = new Lexer( "7 - 3 + 2 - 1" );
console.log( lexer.createTokens() );   

/*
    Parser
    

*/
function Parser( tokens ) {
 
}  
     
     
     
     
     
     
     
     
     
     