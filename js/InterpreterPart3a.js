/* 
  Study material: http://ruslanspivak.com/lsbasi-part3/ 
  Read to see Ruslan's code changes to the interpreter.
  The following code is my answer from Ruslan's blog exercises.
*/

// Version 0.2.0
/* 
   Q3/Exercise from Ruslan's blog
   Write an interpreter that handles arithmetic expressions like “7 - 3 + 2 - 1” from scratch. Use any programming language you’re comfortable with and write it off the top of your head without looking at the examples. When you do that, think about components involved: a lexer that takes an input and converts it into a stream of tokens, a parser that feeds off the stream of the tokens provided by the lexer and tries to recognize a structure in that stream, and an interpreter that generates results after the parser has successfully parsed (recognized) a valid arithmetic expression. String those pieces together. Spend some time translating the knowledge you’ve acquired into a working interpreter for arithmetic expressions.
   
   This exercise is the longest one that has been assigned so far. I chose to use 3 classes. Lexer, Parser and Interpreter.
   I found the code easier to understand than combining the parser and interpreter together.
/* 
  Token class
    Parameters
      -- value
      -- type
    local variables
      -- value: type STRING
      -- type: type STRING
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
       position: type NUMBER
       current char: type STRING
       tokens: type ARRAY
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
          continue;
       }
       
       if( isAdditionOp( this.currentChar ) ){
          this.tokens.push( new Token( Type.ADD, "+") );
          this.advance();
          continue;
       }
       
       if( isSubtractionOp( this.currentChar ) ){
          this.tokens.push( new Token( Type.SUBTRACT, "-" ) );
          this.advance();
          continue;
       }
       
       throw new Error( "character not recognized, token not created" );
     }
     
     this.tokens.push( new Token( Type.EOF, "EOF" ) );
     return this.tokens;
  }
  
}
       
var lexer = new Lexer( "2 + 2" );
// console.log( lexer.createTokens() );
       
var lexer = new Lexer( "7 - 3 + 2 - 1" );
// console.log( lexer.createTokens() );   

// var lexer = new Lexer( "7 * 3 + 2 - 1" );
// console.log( lexer.createTokens() );   


/*
    Parser
      Purpose
        -- tries to recognize a structure in that stream      
      Parameter 
        -- tokens type Array
      local variables
        -- position: type Number 
        -- tokens: type Array of objects
        -- currentToken: type object
      Functions
        -- parse 
          parse a series of tokens, checking that structure is correct
          ex. 2 + 2 or 6 - 4 + 3
        -- advance
          advance position and re-assign current token
        -- verifyInteger
          verify current token is an integer
      Return True/False
*/
function Parser( tokens ) {
   
   var tokens = tokens;
   var position = 0;
   var currentToken = tokens[position];

   
   var advance = function() {
      position += 1;
      currentToken = tokens[position];
   }
   
   var verifyInteger = function(){
    return isInteger( currentToken.value );
   }
   
   this.parse = function(){
     
     if( verifyInteger() ){
        advance();
     }
     
     while( currentToken.type !== "EOF" ){
       if( currentToken.type === "ADD" || currentToken.type === "SUBTRACT" ){
         advance();
         if( verifyInteger() ){
           advance();      
         } else {
            return new Error("parser did not recognize structure");
         }
       }
      
     }
     return true;     
   }
   
  
}
  
var lexer = new Lexer( "7 + 3 + 2 - 1" );
var tokens = lexer.createTokens();        

var parser = new Parser( tokens );
    
var lexer = new Lexer( "7 +  + 3 + 2 - 1" );
var tokens = lexer.createTokens();        

// Should return: [Error: parser did not recognize structure]
var parser = new Parser( tokens );
// console.log( parser.parse() );
     
/*
  Interpreter
    Purpose
      -- If parser results are correct evaluate tokens
    Parameter
      tokens: type ARRAY of tokens
    Local Variables
      current token: type OBJECT
      position: type NUMBER
      tokens: type ARRAY of tokens
      sum: type NUMBER
    Functions
      advance 
        -- increment position by 1,  assign current token to tokens at index = position
      evaluateExpression
        -- while current token is not equal to token type "EOF" , 
            check for current token type operation, advance current token, perform operation, and advance current token
    Return sum
*/

function Interpreter( tokens ){
   var tokens = tokens;
   var position = 0;
   var currentToken = tokens[position];
   var sum = 0;
   
   var advance = function(){
      position += 1;
      currentToken = tokens[position];
   }
   
   sum = currentToken.value;
   advance();
   
   this.evaluateExpression = function() {
     while( currentToken.type !== "EOF" ){
      
      if( currentToken.type == "ADD" ){
         advance();
         sum += currentToken.value;
         advance();
      } else if( currentToken.type === "SUBTRACT" ) {
         advance();
         sum -= currentToken.value;
         advance();
      }

     } 
     
     return sum;
   }
     
}
     
var lexer = new Lexer( "7 + 3 + 2 - 1" );
var tokens = lexer.createTokens();        

var parser = new Parser( tokens );

if( parser.parse() ){
   var interpreter = new Interpreter( tokens );
   console.log( interpreter.evaluateExpression() );  
}      

var lexer1 = new Lexer( "7 - 3 - 2 - 1" );
var tokens = lexer1.createTokens();        

var parser1 = new Parser( tokens );

if( parser1.parse() ){
   var interpreter1 = new Interpreter( tokens );
   console.log( interpreter1.evaluateExpression() );  
}  


     
     
     