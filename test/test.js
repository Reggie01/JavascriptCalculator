var assert = require('assert');
var interpreter = require( "../js/interpreterPart5.js" );
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

console.log( interpreter );

describe( "Token", function() {
   describe( "Token constructor", function() {
      it("should return type Integer", function() {
         var token = new interpreter.Token("INTEGER", 2);
         assert.equal( "INTEGER", token.type )
      });
   });
});

describe( "Whitespace", function() {
   describe( "isWhiteSpace", function() {
      it("should return true", function() {        
         assert.equal( true, interpreter.isWhiteSpace(" " ) );
      });
   });
});

describe( "Integer", function() {
   describe( "isInteger", function() {
      it("should return true", function() {        
         assert.equal( true, interpreter.isInteger("5") );
      });
   });
});

describe( "Addition", function() {
   describe( "isAdditionOp", function() {
      it("should return true", function() {        
         assert.equal( true, interpreter.isAdditionOp("+") );
      });
   });
});

describe( "Subtraction", function() {
   describe( "isSubtractOp", function() {
      it("should return true", function() {        
         assert.equal( true, interpreter.isSubtractOp("-") );
      });
   });
});

describe( "Multiplication", function() {
   describe( "isMultiplicationOp", function() {
      it("should return true", function() {        
         assert.equal( true, interpreter.isMultiplicationOp("*") );
      });
   });
});

describe( "Division", function() {
   describe( "isDivisionOp", function() {
      it("should return true", function() {        
         assert.equal( true, interpreter.isDivisionOp("/") );
      });
   });
});

describe( "Lexer", function() {
   describe( "Lexer.createTokens", function() {
      it("should return true", function() {        
         var token = new interpreter.Token("INTEGER", 2);
         assert.equal( token.value, new interpreter.Lexer("2 + 2").createTokens()[0].value );
      });
   });
});

describe( "Lexer", function() {
   describe( "Lexer.createTokens", function() {
      it("should return true", function() {        
         var token = new interpreter.Token("INTEGER", 2);
         assert.equal( "Error: parsing error", new interpreter.Lexer("2 + ^ 2").createTokens() );
      });
   });
});