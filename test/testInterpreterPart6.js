var assert = require('assert');
var interpreter = require( "../js/interpreterPart6.js" );

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

describe('Regex Helpers Part 6', function() {
  describe('regexHelpers.isWhiteSpace()', function () {
    it('should return true', function () {
      assert.equal( true, interpreter.regexHelpers.isWhiteSpace(" ") );
    });
  });
});

describe('Regex Helpers Part 6', function() {
  describe('regexHelpers.isInteger()', function () {
    it('should return true', function () {
      assert.equal( true, interpreter.regexHelpers.isInteger("1") );
    });
  });
});

describe('Regex Helpers Part 6', function() {
  describe('regexHelpers.isAdditionOp()', function () {
    it('should return true', function () {
      assert.equal( true, interpreter.regexHelpers.isAdditionOp("+") );
    });
  });
});

describe('Regex Helpers Part 6', function() {
  describe('regexHelpers.isSubtractOp()', function () {
    it('should return true', function () {
      assert.equal( true, interpreter.regexHelpers.isSubtractOp("-") );
    });
  });
});

describe('Regex Helpers Part 6', function() {
  describe('regexHelpers.isMultiplyOp()', function () {
    it('should return true', function () {
      assert.equal( true, interpreter.regexHelpers.isMultiplyOp("*") );
    });
  });
});

describe('Regex Helpers Part 6', function() {
  describe('regexHelpers.isDivideOp()', function () {
    it('should return true', function () {
      assert.equal( true, interpreter.regexHelpers.isDivideOp("/") );
    });
  });
});

describe('Regex Helpers Part 6', function() {
  describe('regexHelpers.isLParenOp()', function () {
    it('should return true', function () {
      assert.equal( true, interpreter.regexHelpers.isLParenOp("(") );
    });
  });
});

describe('Regex Helpers Part 6', function() {
  describe('regexHelpers.isRParenOp()', function () {
    it('should return true', function () {
      assert.equal( true, interpreter.regexHelpers.isRParenOp(")") );
    });
  });
});

describe('Lexer Part 6', function() {
  describe('Lexer.init()', function () {
    it('should return true', function () {
      var lexer = interpreter.Lexer( interpreter.regexHelpers );
      assert.equal( typeof {}, typeof lexer );
      lexer.init("2 + 2");
      assert.equal( "2 + 2", lexer.getText() );
    });
  });
});

describe('Lexer Part 6', function() {
  describe('Lexer.helpers()', function () {
    it('should return true', function () {
      var lexer = interpreter.Lexer( interpreter.regexHelpers ).helpers();
      assert.equal( true, lexer.isRParenOp(")") );
    });
  });
});

describe('Lexer Part 6', function() {
   describe('Lexer.createTokens()', function () {
     it('should return token type Integer', function () {
       var lexer = interpreter.Lexer( interpreter.regexHelpers );
       lexer.init("2");
       var tokens = lexer.createTokens();
       assert.equal( "INTEGER", tokens[0].type );
     });
   });
});


describe('Lexer Part 6', function() {
   describe('Interpreter.expr()', function () {
     it('should return 4', function () {
       var lexer1 = interpreter.Lexer( interpreter.regexHelpers );
       lexer1.init("2+2");
       var tokens = lexer1.createTokens();
       assert.equal( 4, tokens.length );
       var interpret = interpreter.Interpreter();
       interpret.init( tokens );
       assert.equal( 4, interpret.expr() );
     });
   });
});

describe('Lexer Part 6', function() {
   describe('Interpreter.expr("2+2*3), verify operator precedence', function () {
     it('should return 4', function () {
       var lexer = interpreter.Lexer( interpreter.regexHelpers );
       lexer.init("2+2*3");
       var tokens = lexer.createTokens();
       assert.equal( 6, tokens.length );
       var interpret = interpreter.Interpreter();
       interpret.init( tokens );
       assert.equal( 8, interpret.expr() );
     });
   });
});

describe('Lexer Part 6', function() {
   describe('Interpreter.expr("(2+3)*3"), verify operator precedence with parens', function () {
     it('should return 15', function () {
       var lexer = interpreter.Lexer( interpreter.regexHelpers );
       lexer.init("(2+3)*3");
       var tokens = lexer.createTokens();
       assert.equal( 8, tokens.length );
       var interpret = interpreter.Interpreter();
       interpret.init( tokens );
       assert.equal( 15, interpret.expr() );
     });
   });
});

describe('Lexer Part 6', function() {
   describe('Interpreter.expr("7 + 3 * (10 / (12 / (3 + 1) - 1))"), verify operator precedence with multiple parens', function () {
     it('should return 22', function () {
       var lexer = interpreter.Lexer( interpreter.regexHelpers );
       lexer.init("7 + 3 * (10 / (12 / (3 + 1) - 1))");
       var tokens = lexer.createTokens();
       assert.equal( 20, tokens.length );
       var interpret = interpreter.Interpreter();
       interpret.init( tokens );
       assert.equal( 22, interpret.expr() );
     });
   });
});

7 + 3 * (10 / (12 / (3 + 1) - 1))

