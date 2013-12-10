/*
This script should:
1. Get your SDK path (if no SDK is specified, the first entry is used)
2. Download a zipfile with all app templates
3. Extract folders in zip file to [sdkpath]/templates/app
4. Export template names

If for example one template name is "navgroup", the user should be able to say:

ti create --template navgroup

which will result in creating a new project based on that template

*/
var child_process=require('child_process');
var zlib = require('zlib');
var templatesPath='/templates/app';
var args=[];

// get cl arguments
process.argv.forEach(function (val, index, array) {
  args.push(val);
});

// call ti info
child_process.exec('ti info -t titanium -o json',
  function (error, stdout, stderr) {
  	try{
  		var response=JSON.parse(stdout);
  		var sdks=response.titanium;

  		if (args[2]){
  			var sdkpath=sdks[args[2]].path;
	  		var escapedPath = sdkpath.replace(/(\s)/, "\\ ");
	  		console.log(escapedPath + templatesPath);  			
  		}else{
  			var keys=Object.keys(sdks);
	  		var sdkpath=sdks[keys[0]].path;
	  		var escapedPath = sdkpath.replace(/(\s)/, "\\ ");
	  		console.log(escapedPath + templatesPath);  			
  		}

  	}catch(err){
  		console.log('Error');
  	}
});