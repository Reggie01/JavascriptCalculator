/* 
  Study material: https://ruslanspivak.com/lsbasi-part5/
  Read to see Ruslan's code changes to the interpreter.
  The following code is my answer to Ruslan's blog exercises.
*/

// Version 0.4.0

/*
Write an interpreter as described in this article off the top of your head, without peeking into the code from the article. Write some tests for your interpreter, and make sure they pass.

Extend the interpreter to handle arithmetic expressions containing parentheses so that your interpreter could evaluate deeply nested arithmetic expressions like: 7 + 3 * (10 / (12 / (3 + 1) - 1))
*/

/*
    Token Class
    Purpose: create token
    -- constructor
      takes two parameters type and value
    -- Local/Class variables
      type: type String
      value: type String or Number
*/

function Token( type, value ){
   this.type = type;
   this.value = value;
}

/*
    Token Types
      -- object with token name strings
*/
  Type = {
     INTEGER: "INTEGER",
     ADD: "ADD",
     SUBTRACT: "SUBTRACT",
     MULTIPLY: "MULTIPLY",
     DIVIDE: "DIVIDE",
     LPAREN: "LPAREN",
     RPAREN: "RPAREN",
     EOF: "EOF"
  }


/*
    Regex Helpers
*/
function isWhiteSpace( character ){
   return / /.test( character );
}

function isInteger( character ){
   return /\d+/.test( character );
}

function isAdditionOp( character ){
   return /\+/.test( character );
}

function isSubtractOp( character ){
   return /\-/.test( character );
}

function isMultiplicationOp( character ){
   return /\*/.test( character );
}

function isDivisionOp( character ){
   return /\//.test( character );
}

function isLeftParenOp( character ){
   return /\(/.test( character );
}

function isRightParenOp( character ){
   return /\)/.test( character );
}

/*
    Lexer Class
      Purpose
        --convert text to tokens
      Paramters/Constructor
        text: type String
      Local/Class Variables
        tokens: type Array of objects
        position: type Number
        currentChar: type String
        text: type String
      Local functions
        advance
          -- increment position by one and reassign currentChar to tokens at index equal to position
        createInteger
          -- while current character is number add to a sum, then return 
        checkWhiteSpace
          -- while current character is whitespace, call advance function
      Global function
        createTokens
          -- while current character is not null, create tokens from currentChar
      Return
        -- return an array of tokens
*/
function Lexer( text ){
   var text = text;
   var position = 0;
   var currentChar = text[0];
   var tokens = [];
   
   var advance = function() {
      position += 1;
      if( position >= text.length ){
         currentChar = null;
      } else {
         currentChar = text[position];
      }      
   };
   
   var createInteger = function(){
     var sum = 0;
     while( isInteger( currentChar ) ){
        sum += currentChar;
        advance();
     }
     return sum;
   };
   
   var checkWhiteSpace = function() {
      while( isWhiteSpace( currentChar ) ){
         advance();
      }
   };
   
   this.createTokens = function() {
     
     while( currentChar !== null ){
        if( isWhiteSpace( currentChar ) ){
           checkWhiteSpace();
        }
        
        if( isInteger( currentChar ) ){
           tokens.push( new Token( Type.INTEGER, parseInt( createInteger( currentChar ) ) ) );
           continue;
        }
        
        if( isAdditionOp( currentChar ) ) {
           tokens.push( new Token( Type.ADD, "+" ) );
           advance();
           continue;
        }
        
        if( isSubtractOp( currentChar ) ){
           tokens.push( new Token( Type.SUBTRACT, "-" ) );
           advance();
           continue;
        }
        
        if( isMultiplicationOp( currentChar ) ){
           tokens.push( new Token( Type.MULTIPLY, "*" ) );
           advance();
           continue;
        }
        
        if( isDivisionOp( currentChar ) ){
           tokens.push( new Token( Type.DIVIDE, "/" ) );
           advance();
           continue;
        }
        
        if( isLeftParenOp( currentChar ) ){
           tokens.push( new Token( Type.LPAREN, "(" ) );
           advance();
           continue;
        }
        
        if( isRightParenOp( currentChar ) ){
           tokens.push( new Token( Type.RPAREN, ")" ) );
           advance();
           continue;
        }
        
        try {
          throw new Error('parsing error');
        } catch (e) {
          //console.log(e.name + ': ' + e.message);
          return e.name + ': ' + e.message;
        } 
     }
     
     if( currentChar === null ){
        tokens.push( new Token( Type.EOF ) );
     }
     return tokens;
   }
}



/* 
    Parser/Interpreter Class
      Purpose
        -- syntax analyzer - check the structure of the tokens form a coherent expression, then interpret
      Local Variables
        -- position: type Number
        -- currentToken: type object
        -- tokens: type Array of objects
      Local Functions
        -- term
          follow grammar rule factor((MUL|DIV) factor)*
        -- factor
          follow grammar rule INTEGER | ( expr )
        -- advanceToken
          increment position by 1 and assign current token to 
        -- verifyToken
          verify token is correct if not throw error         
      Global Function
        -- expr
          follow grammar rule term((ADD|SUB) term)*      
         
      Grammar:
      Rule  Production
      -----   --------------
      expr: term((ADD|SUB) term)*
      term: factor((MUL|DIV) factor)*
      factor: INTEGER | ( expr )
*/

function Parser( tokens ) {
   var tokens = tokens;
   var position = 0;
   var currentToken = tokens[0];
   var self = this;
   
   var advance = function(){
      position += 1;
      currentToken = tokens[position];      
   };
   
   var verifyToken = function( type) {
      if(currentToken.type === type ) {
         advance();
      } else {
         throw new Error( "parsing error" );
      }
   };
   
   // expr: term((ADD|SUB) term)*
   self.expr = function() {
      var result = term();

      while( /(ADD|SUBTRACT)/.test( currentToken.type ) ){
         if( currentToken.type === "ADD" ){
            verifyToken( "ADD" );
            result += term();
         } else if( currentToken.type === "SUBTRACT" ){
            verifyToken( "SUBTRACT" );
            result -= term();
         }
      }
      
      return result;
   }
   
   // term: factor((MUL|DIV) factor)*
   var term = function(){
      var result = factor();

      while( /(MULTIPLY|DIVIDE)/.test( currentToken.type ) ){
         if( /MULTIPLY/.test( currentToken.type) ){
            verifyToken( "MULTIPLY" );
            result *= factor();
         } else if( /DIVIDE/.test( currentToken.type ) ) {
            verifyToken( "DIVIDE" );
            result /= factor();
         }
      }
      
      return result;
      
   }
   
   // factor: INTEGER | ( expr )
   var factor = function(){
      var result = "";
      
      if( currentToken.type === "LPAREN" ){
         verifyToken( "LPAREN" );
         result = self.expr();
         verifyToken( "RPAREN" );
      } else if( currentToken.type === "INTEGER" ) {        
         result = currentToken.value;
         verifyToken( "INTEGER" );
      }
      
      return result;
   }  
    
}
         
module.exports = {
  Token: Token,
  isWhiteSpace: isWhiteSpace,
  isInteger: isInteger,
  isAdditionOp: isAdditionOp,
  isSubtractOp: isSubtractOp,
  isMultiplicationOp: isMultiplicationOp,
  isDivisionOp: isDivisionOp,
  Lexer: Lexer,
  Parser: Parser
} 

/*
    Interpreter Class
*/

