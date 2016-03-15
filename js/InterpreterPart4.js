/* 
  Study material: https://ruslanspivak.com/lsbasi-part4/ 
  Read to see Ruslan's code changes to the interpreter.
  The following code is my answer to Ruslan's blog exercises.
*/

// Version 0.4.0
/*
    Exercises from blog
    1. Write a grammar that describes arithmetic expressions containing any number of +, -, *, or / operators. With the grammar you should be able to derive expressions like “2 + 7 * 4”, “7 - 8 / 4”, “14 + 2 * 3 - 6 / 2”, and so on.
    2. Using the grammar, write an interpreter that can evaluate arithmetic expressions containing any number of +, -, *, or / operators. Your interpreter should be able to handle expressions like “2 + 7 * 4”, “7 - 8 / 4”, “14 + 2 * 3 - 6 / 2”, and so on.
*/

/*
    Exercise from blog answer 1
    BNF
    expr: factor((MUL|DIV|ADD|SUBTRACT) factor)*
    factor: INTEGER
*/
  
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

function isOperatorType( type ){
   return /(MULTIPLY|DIVIDE|ADD|SUBTRACT)/.test( type );
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
       
       if( isMultiplyOp( this.currentChar ) ) {
          this.tokens.push( new Token( Type.MULTIPLY, "*" ) );
          this.advance();
          continue;
       }
       
       if( isDivideOp( this.currentChar ) ) {
          this.tokens.push( new Token( Type.DIVIDE, "/" ) );
          this.advance();
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

var lexer = new Lexer( "7 * 3 + 2 - 1" );
//console.log( lexer.createTokens() );   


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
        -- expr 
          parse a series of tokens, checking that structure is correct
          ex. 2 + 2 or 6 - 4 + 3
        -- factor
          verify current token is an integer
       -- verifyToken
         verify current token matches token type if true increment position, assign current token to token in tokens array at index position
      Return True/False
  
*/

/*
      language grammar
      expr: factor((MUL|DIV|ADD|SUBTRACT) factor)/*
      factor: INTEGER
*/

function Parser( tokens ) {
   
   var tokens = tokens;
   var position = 0;
   var currentToken = tokens[position];

   var verifyToken = function( tokenType ) {
      if( currentToken.type === tokenType ){
        position += 1;
        currentToken = tokens[position]; 
      } else {
         throw new Error("parser did not recognize structure");
      }
   }
   
   var factor = function() {
      verifyToken( Type.INTEGER );
   }
   
   this.expr = function(){
     var result = factor();
     
     while( isOperatorType( currentToken.type ) ){
       
       if( currentToken.type === "ADD" ){
         verifyToken( Type.ADD );
         factor();
       } else if( currentToken.type === "SUBTRACT" ) {
          verifyToken( Type.SUBTRACT );
          factor();
       } else if( currentToken.type === "MULTIPLY" ){
          verifyToken( Type.MULTIPLY );
          factor();
       } else if( currentToken.type === "DIVIDE" ){
          verifyToken( Type.DIVIDE );
          factor();
       }
       
     }
     
     if( currentToken.type === "EOF" ){
        return true;
     }
     return true;     
   }
   
  
}
  
var lexer = new Lexer( "7 * 3 + 2 - 1" );
var tokens = lexer.createTokens();        
var parser = new Parser( tokens );
console.log( parser.expr() );
    
var lexer1 = new Lexer( "7 +  + 3 + 2 - 1" );
var tokens1 = lexer1.createTokens();        

var parser1 = new Parser( tokens1 );
// Should throw parsing error
//console.log( parser1.expr() );
     
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

/*
      language grammar
      expr: factor((MUL|DIV|ADD|SUBTRACT) factor)/*
      factor: INTEGER
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
   
   var factor = function() {
      var token = currentToken;
      advance();
      return token.value;
   }
   
   this.expr = function(){

     var result = factor();
     
     while( isOperatorType( currentToken.type ) ){
       
       if( currentToken.type === "ADD" ){
         factor();
         result += factor();
       } else if( currentToken.type === "SUBTRACT" ) {
          factor();
          result -= factor();
       } else if( currentToken.type === "MULTIPLY" ){
          factor();
          result *= factor();
       } else if( currentToken.type === "DIVIDE" ){
          factor();
          result /= factor();
       }
       
     }
     
     if( currentToken.type === "EOF" ){
        return result;
     }
     //return true;     
   }
     
}
     
var lexer = new Lexer( "7 + 3 + 2 - 1" );
var tokens = lexer.createTokens();        

var parser = new Parser( tokens );

if( parser.expr() ){
   var interpreter = new Interpreter( tokens );
   console.log( interpreter.expr() );  
}      

var lexer1 = new Lexer( "7 - 3 - 2 - 1" );
var tokens = lexer1.createTokens();        

var parser1 = new Parser( tokens );

if( parser1.expr() ){
   var interpreter1 = new Interpreter( tokens );
   console.log( interpreter1.expr() );  
}  


     
     
     