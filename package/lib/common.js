// import dependencies
var execSync            = require('exec-sync');
var fs                  = require("fs");
var path                = require("path");
var request             = require('request');
var fs                  = require('fs');
var ProgressBar         = require("progress");
var AdmZip              = require('adm-zip');
//var destpath            = '/Users/ralcocer/Desktop/'; // ending with Saul Hudson
var destpath            = '/tmp/'; // ending with Saul Hudson
var destfile            = 'titemplatesx.zip';
var tmpFolder           = generateUUID();

function titpl(){
  // load data drom Titanium CLI upon object instantiation
  var tisdk                 = execSync('ti sdk -o json');
  var response              = JSON.parse(tisdk);
  this.repoURI              = 'https://github.com/ricardoalcocer/HackPRTest/archive/master.zip';
  this.installedSDKs        = response.installed;
  this.localTemplatesPath   = '/templates/app';
  this.sdkVersions          = Object.keys(this.installedSDKs).sort().reverse();
  // 
}

titpl.prototype.listTemplates=function(){
  var that=this;  

  that.sdkVersions.forEach(function(thisSDKVersion){
  var thisSDKPath=that.installedSDKs[thisSDKVersion];
  fs.readdir(thisSDKPath + that.localTemplatesPath,function(err,files){
      console.log('\n' + thisSDKVersion);
      console.log('-----------------')
      if (typeof files !== 'undefined'){
        files.forEach(function(templateName){
          // consider only directories
          if (fs.lstatSync(thisSDKPath + that.localTemplatesPath + path.sep + templateName).isDirectory()){
            console.log('> ' + templateName);
          }
        })
      }else{
        console.log('No templates folder found');
      }
    });
  });  
}

titpl.prototype.installTemplates=function(sdk){
  that=this; 

  if (sdk){
    if (that.sdkVersions.indexOf(sdk) > 0){
      console.log('\n' + sdk + ' SDK location: \n' + that.installedSDKs[sdk]);
      console.log('\nInstalling templates to: \n' + that.installedSDKs[sdk] + that.localTemplatesPath);
      
      // install templates into given SDK
      download(that.repoURI,function(pathToPackage){
        //console.log('Now save the contents of ' + destpath + tmpFolder + ' to ' + that.installedSDKs[sdk] + that.localTemplatesPath);

        // now unpack
        unzip(pathToPackage,destpath + tmpFolder,that.installedSDKs[sdk] + that.localTemplatesPath,function(){
          console.log('Process completed!?');
        })
      });
    }else{
      console.log('\nInvalid SDK version. Your currently installed SDKs are:');
      that.sdkVersions.forEach(function(thisSDK){
        console.log(thisSDK);
      })
    }
  }else{
      console.log('\nInvalid SDK version. Your currently installed SDKs are:');
      that.sdkVersions.forEach(function(thisSDK){
        console.log(thisSDK);
      })
      
      // install templates for all SDKs
      //download(that.repoURI,function(pathToPackage){
      //  console.log('Now save the contents of ' + pathToPackage + ' to all sdks');
      //});
  }
}

function download(repoURI,callback){
  var r = request(repoURI);
  var downloadedFile=destpath + destfile;
  var outFilePipe=fs.createWriteStream(downloadedFile);

  r.on('response',  function (res) {
    var len = parseInt(res.headers['content-length'], 10);

    console.log();
    
    var progressFlags={
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: len
    }

    var bar = new ProgressBar('Downloading [:bar] :percent :etas', progressFlags);

    res.pipe(outFilePipe);

    r.on('data', function(chunk){
      bar.tick(chunk.length);
    });

    r.on('end', function(){
      console.log('\nUnpacking templates...');  
      callback(destpath + destfile);
    });
  });  

  r.on('error',function(err){
    console.log('Error downloading templates.');
    process.exit(code=0); // die mofo
  })
}

function unzip(pathToZip,pathToDestination,pathToSDK,callback){
  var zip = new AdmZip(pathToZip);
  var zipEntries = zip.getEntries();
  zip.extractAllTo(pathToDestination, /*overwrite*/true);

  //
  var ncp = require('ncp').ncp;

  ncp.limit = 16;
  //console.log('Copy ' + pathToDestination + ' to ' + pathToSDK);
  ncp(pathToDestination, pathToSDK, {clobber:true},function (err) {
   if (err) {
     return console.error(err);
   }
   callback();
  });
  //
}

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};

exports.titpl=titpl;