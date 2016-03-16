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
         assert.equal( 2, new interpreter.Lexer("2 + 2").createTokens()[0].value );
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

describe( "Lexer create RPAREN", function() {
   describe( "Lexer.createTokens", function() {
      it("should return true", function() {        
         var token = new interpreter.Token("INTEGER", 2);
         assert.equal( "LPAREN", new interpreter.Lexer("(1)").createTokens()[0].type );
         assert.equal( "1", new interpreter.Lexer("(1)").createTokens()[1].value );
         assert.equal( "RPAREN", new interpreter.Lexer("(1)").createTokens()[2].type );
      });
   });
});

describe( "Parser", function() {
   describe( "Parser.expr( '1' )", function() {
      it("should return 1", function() {        
         var tokens = new interpreter.Lexer( "1" ).createTokens();
         var parser = new interpreter.Parser( tokens );
         assert.equal( 1, parser.expr() );
      });
   });
});

describe( "Parser", function() {
   describe( "Parser.expr( '2 + 2')", function() {
      it("should return 4", function() {        
         var tokens = new interpreter.Lexer( "2+2" ).createTokens();
         var parser = new interpreter.Parser( tokens );
         assert.equal( 4, parser.expr() );
      });
   });
});

describe( "Parser", function() {
   describe( "Parser.expr( '2 + 2 * 3')", function() {
      it("should return 8", function() {        
         var tokens = new interpreter.Lexer( "2 + 2 * 3" ).createTokens();
         var parser = new interpreter.Parser( tokens );
         assert.equal( 8, parser.expr() );
      });
   });
});

describe( "Parser", function() {
   describe( "Parser.expr( '(2 + 2) * 3')", function() {
      it("should return 12", function() {        
         var tokens = new interpreter.Lexer( "(2 + 2) * 3" ).createTokens();
         var parser = new interpreter.Parser( tokens );
         assert.equal( 12, parser.expr() );
      });
   });
});
