﻿/* 
  Study material: https://ruslanspivak.com/lsbasi-part6/
  Read to see Ruslan's code changes to the interpreter.
  The following code is my answer to Ruslan's blog exercises.
  
  
  Exercises
  -------------
  Write your own version of the interpreter of arithmetic expressions as described in this article. Remember: repetition is the mother of all learning.
*/

// Version 0.4.5

/*
    Token class
*/
function Token( type, value ){
 this.type = type;
 this.value = value;
}

/*
    Token types
*/
var Type = {
   NUMBER: "NUMBER",
   ADDITION: "ADDITION",
   SUBTRACTION: "SUBTRACTION",
   MULTIPLICATION: "MULTIPLICATION",
   DIVISION: "DIVISION",
   EOF: "EOF",
   LPAREN: "LPAREN",
   RPAREN: "RPAREN"
}

/*
    Regex Helpers
*/

var regexHelpers = ( function() {
  return {
     isWhiteSpace: function( character ){
       return / /.test( character ); 
     },
     isInteger: function( character ){
       return /\d+/.test( character );
     },
     isAdditionOp: function( character ){
       return /\+/.test( character );
     },
     isSubtractOp: function( character ){
       return /\-/.test( character );
     },
     isMultiplyOp: function( character ){
       return /\*/.test( character );
     },
     isDivideOp: function( character ){
       return /\//.test( character );
     },
     isLParenOp: function( character ){
        return /\(/.test( character );
     },
     isRParenOp: function( character ){
        return /\)/.test( character );
     },
     isDecimal: function( character ) {
       return /^\.$/.test( character );
     }
  }
}());

/*
    Lexer Class
      Purpose
        -- turn text into tokens
      Local variables
        -- position: type Number
        -- currentChar: type String
        -- text: type String
        -- tokens: type Array of objects
      Local Function
        -- advance
          increment position by 1 and assing currentChar to text index at position
        -- createNumber
          local variable: sum type String
          while current character is a number add to sum, advance(), return sum 
        -- skipWhiteSpace
          if whitespace advance() 
        -- createTokens
          while currentChar != null, create tokens
*/
var Lexer = function( regexHelpers ) {
  var tokens = [];
  var position = 0;
  var currentChar;
  var text;
  var helpers = regexHelpers;
  
  var advance = function() {
     position += 1;
     if ( position >= text.length ){
        currentChar = null;
     } else {
       currentChar = text.charAt( position );
     }
     
  };
  
  var createNumber = function() {
     var sum = "";
     while( helpers.isInteger( currentChar ) || helpers.isDecimal( currentChar ) ){
        sum += currentChar;
        advance();
     }
    
     if( sum.indexOf( "." ) !== -1 ) {
          try {
               sum = parseFloat( sum );
          } catch( e ) {
               throw new Error("lexer error");
          }
     } else {
          sum = parseInt( sum, 10 );
     }
     return sum;
  };
  
  var skipWhiteSpace = function() {
     while( helpers.isWhiteSpace( currentChar ) ){
        advance();
     }
  }
  
  return {
     init: function( str ) {
        text = str;
        currentChar = text.charAt(position);
     },
     getText: function() {
        return text;
     },
     createTokens: function() {
        while( currentChar !== null ){
           if( helpers.isWhiteSpace( currentChar ) ){
              advance();
           }
           
           if ( helpers.isDecimal( currentChar ) ) {
               tokens.push( new Token( Type.NUMBER, createNumber( currentChar ) ) );
               continue;
           }
           
           if( helpers.isInteger( currentChar ) ){
              tokens.push( new Token( Type.NUMBER, createNumber( currentChar ) ) );
              continue;
           }
           
           if( helpers.isAdditionOp( currentChar ) ){
              tokens.push( new Token( Type.ADDITION, "+" ) );
              advance();
              continue;
           }
           
           if( helpers.isSubtractOp( currentChar ) ) {
              tokens.push( new Token( Type.SUBTRACTION, "-" ) );
              advance();
              continue;
           }
           
           if( helpers.isMultiplyOp( currentChar ) ){
              tokens.push( new Token( Type.MULTIPLICATION, "*" ) );
              advance();
              continue;
           }
           
           if( helpers.isDivideOp( currentChar ) ){
              tokens.push( new Token( Type.DIVISION, "/" ) );
              advance();
              continue;
           }
           
           if( helpers.isLParenOp( currentChar ) ){
              tokens.push( new Token( Type.LPAREN, "(" ) );
              advance();
              continue;
           }
           
           if( helpers.isRParenOp( currentChar ) ){
              tokens.push( new Token( Type.RPAREN, ")" ) );
              advance();
              continue;
           }
           
           throw new Error("lexer error");
        }
        if( currentChar === null ){
           tokens.push( new Token( Type.EOF, "EOF" ) );
        } else {
           throw new Error("lexer error");
        }
        
        return tokens;
     }, 
     helpers: function() {
        return helpers;
     }     
  }
};


/*
    Interpreter/Parser
      Purpose
        verify expression is valid, then evaluate token values
      Local Varibles
        current token: type Object
        position: type Number
        tokens: type Array of Objects
      Local functions
        init
          parameter tokensArr
          assign tokensArr to local variable tokens
        advance
          increment position by 1 and assign current token to tokens at index == position
        term
          follow grammar term: factor((MUL|DIV) factor)*
        factor
          follow grammar factor: NUMBER | LPAREN expr RPAREN
        verifyToken
          verify current token is correct
      Global function
        expr
          follow grammar expr: term((ADD|SUB) term)*
*/

var Interpreter = function() {
   var position = 0;
   var tokens;
   var currentToken;
   
   var advance = function() {
      position += 1;
      currentToken = tokens[position];
   };
   
   var verifyToken = function( type ) {
      if( currentToken.type === type ){
        advance();
      } else {
         throw new Error( "parsing error" );
      }
   };
   
   var term = function() {
      var result = factor();
      
      while( currentToken.type === "MULTIPLICATION" || currentToken.type === "DIVISION" ){
         if( currentToken.type === "MULTIPLICATION" ){
            verifyToken( "MULTIPLICATION" );
            result *= factor();
         } else if( currentToken.type === "DIVISION" ){
            verifyToken( "DIVISION" );
            result /= factor();
         }
      }
      
      return result;
   }
   
   var factor = function() {
      var result = "";
     
      if( currentToken.type === "NUMBER" ){
         result = currentToken.value;
         verifyToken( "NUMBER" );
      } else if ( currentToken.type === "LPAREN" ){
         verifyToken( "LPAREN" );
         result = expr();
         verifyToken("RPAREN");
      }
     
      return result;
   }
   
   var expr = function() {
           
     var result = term();
         
     while( currentToken.type === "ADDITION" || currentToken.type === "SUBTRACTION" ){
       if( currentToken.type === "ADDITION" ) {
         verifyToken( "ADDITION" );
         result += term();
       } else if( currentToken.type === "SUBTRACTION" ) {
         verifyToken( "SUBTRACTION" );
         result -= term();
       }
     }
     
     return result;
   }
   
   return {
      init: function( tokensArr ) {
         tokens = tokensArr;
         currentToken = tokens[position];
      },
      getTokens: function() {
       return tokens;
      },
      expr: expr
   }
};


// TODO: add unary operator

// module.exports = {
   // regexHelpers: regexHelpers,
   // Lexer: Lexer,
   // Interpreter: Interpreter
// }