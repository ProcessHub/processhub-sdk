require('babel-core/register')({
	ignore: /node_modules\/(?!ProjectB)/
}); 

require = require("esm")(module/*, options*/)