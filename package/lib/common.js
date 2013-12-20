// import dependencies
var execSync            = require('exec-sync');
var fs                  = require("fs");
var path                = require("path");
var request             = require('request');
var fs                  = require('fs');
var ProgressBar         = require("progress");
var AdmZip              = require('adm-zip');

function titpl(){
  // load data drom Titanium CLI upon object instantiation
  var tisdk                 = execSync('ti sdk -o json');
  var response              = JSON.parse(tisdk);

  this.repoURI    = 'https://github.com/ricardoalcocer/HackPRTest/archive/master.zip';
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
      download(that.repoURI,function(){
        console.log('Now ' + sdk);
      });
    }else{
      console.log('\nInvalid SDK version. Your currently installed SDKs are:');
      that.sdkVersions.forEach(function(thisSDK){
        console.log(thisSDK);
      })
    }
  }else{
      console.log('No sdk provided.  Will install to all.');
      
      // install templates for all SDKs
      download(that.repoURI,function(){
        console.log('Now All');
      });
  }
}

function download(repoURI,callback){
  var r = request(repoURI);
  
  // this should be /tmp
  var destpath='/Users/ralcocer/Desktop/';
  var destfile='titemplatesx.zip';
  var downloadedFile=destpath + destfile;
  //

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
      
      var zip = new AdmZip(downloadedFile),
      zipEntries = zip.getEntries();
      //console.log(zipEntries);
      zip.extractAllTo(destpath, /*overwrite*/true);
      
      callback();
    });
  });  

  r.on('error',function(err){
    console.log('Error downloading templates.');
    process.exit(code=0); // die
  })
}

exports.titpl=titpl;