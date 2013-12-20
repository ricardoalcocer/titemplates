/**
* TiTemplates
* Copyright (c) 2014 by Ricardo Alcocer All Rights Reserved.
* See http://alco.mit-license.org for information on licensing.
*/

//var unzip=require('unzip');
var appVersion 		= "1.0.0";
var colors 			= require('colors');
var program 		= require('commander');
//var common 			= require('./common');
var localTemplatesPath 	= '/templates/app';
var common 			= require('./common').titpl;
var titpl 			= new common();

printBanner();

// setup commander
program
        .version(appVersion, '-v, --version')
        .description('TiTemplates Command Line Interface')
        .usage('COMMAND [OPTIONS]')
        .option('-s, --sdk <sdkversion>', 'specify titanium sdk version')

program.command('install'.blue+' <sdkversion>'.white)
                .description(' install titemplates'.grey);

program.command('list'.blue)
                .description(' list installed templates'.grey);

program.parse(process.argv);
//

// if there were no arguments, then show help and exit
if (program.args.length === 0){
	console.log(program.helpInformation());
	process.exit(0);
}
//

// since there were arguments, see what the user wants
var command = program.args[0];
switch(command){
	case "list":
		titpl.listTemplates();
		break;
	case "install":
		// send the sdk provided (if any).  I'll validate inside the function
		titpl.installTemplates(program.sdk);
		break;
}
//

//
function printBanner(){
  console.log('TiTemplates - App Templates for Titanium'.cyan.bold);    
}
//