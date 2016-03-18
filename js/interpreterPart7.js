/* 
  Study material: https://ruslanspivak.com/lsbasi-part7/
  Read to see Ruslan's code changes to the interpreter.
  The following code is my answer to Ruslan's blog exercises.
*/

// Version 0.7.0

/*

Exercises
-------------


*/

function AST( obj ){
 
}

function BinOp( left, op, right ){
  this.left = left;
  this.token = this.op = op;
  this.right = right;
}

function Num( token ){
   this.token = token;
   this.value = token.value;
}

function Token( type, value ) {
   this.type = type;
   this.value = value;
}

var mul_token = new Token( "MUL", "*" );
var plus_token = new Token( "PLUS", "+" );
var mul_node = BinOp(
  new Num( new Token( "INTEGER", 2) ),
  mul_token,
  new Num( new Token("INTEGER", 7) )
)

var add_node = BinOp(
  mul_node,
  plus_token,
  new Num( new Token("INTEGER", 3) )
)


















