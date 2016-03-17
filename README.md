#Readme

This is the handlebars version of FreeCodeCamp Zipline project "[Javascript Calculator](http://www.freecodecamp.com/challenges/build-a-javascript-calculator)". Follow the link
to see all user stories for the [project](http://www.freecodecamp.com/challenges/build-a-javascript-calculator).

### User Stories
* User Story: I can add, subtract, multiply and divide two numbers.

* User Story: I can clear the input field with a clear button.

* User Story: I can keep chaining mathematical operations together until I hit the equal button, and the calculator will tell me the correct output.

### APIs 
* http://www.asciitable.com/ Used to map key inputs.


### Tutorials Sites for widgets
* I watched a video on interpreter for an overhead view on creating interpreters. [So you want to write an interpreter?](https://www.youtube.com/watch?v=LCslqgM48D4).  The talk is given by Alex Gaynor.

* Next, I read [Ruslan's Blog](https://ruslanspivak.com/lsbasi-part1/) on how to create an interpreter for my calculator.
  The blog is written in python. So I needed to change some things. Also, he has exercises/questions for his readers to solve at the end of his blogs.
  My solutions can be found in Interpreter.js files.

  
### Articles/Research
 * https://en.wikipedia.org/wiki/Interpreter_(computing)
 * https://en.wikipedia.org/wiki/Visitor_pattern#Related_design_patterns
 * http://www.hillside.net/plop/plop2003/Papers/Jones-ImplementingASTs.pdf
   - found under wiki [page](https://en.wikipedia.org/wiki/Abstract_syntax_tree) Further Reading section
 * https://en.wikipedia.org/wiki/Reverse_Polish_notation
 * https://en.wikipedia.org/wiki/Shunting-yard_algorithm
 * https://en.wikipedia.org/wiki/Parsing
 * http://stackoverflow.com/questions/2245962/is-there-an-alternative-for-flex-bison-that-is-usable-on-8-bit-embedded-systems/2336769#2336769 
  
### Art Direction
* calculator design inpired by [Alexandru Stoica]( https://www.behance.net/gallery/10697005/Flat-Calculator )

### Components

#### Header component
* data-bind current time
* show AM or PM
* show battery 
* show wifi 
 
#### Total_Display component
* input 
* Numbers align right

#### Numbers_Display component
* reflect numbers pressed into calculator
* data-bind to key input of mouseclick

#### Button component
* display Numbers
* hover event button darkens
* center text

#### Test Framework
* [mocha](https://mochajs.org/)
* All tests can be found under test folder

### Technologies Used
* javascript
* html
* css
* jquery
* bootstrap
* handlebars