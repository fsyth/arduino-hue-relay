#!/usr/bin/env nodejs

/*jshint node: true, laxcomma: true*/

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var SerialPort = require('serialport');

var sp = new SerialPort('/dev/ttyACM0', {
  baudrate: 9600
});

var lastKnown = -1;

sp.on('open', function () {
  console.log('Serial Port opened.');
  
  var fc = 0;
  
  sp.on('data', function (data) {
    if (fc++ % 100 === 0 && data[0] !== lastKnown) {
      //console.log('Serial Port response: ' + data[0]);
      
      var settings = {};
      
      if (data[0] === 0) {
        settings.on = false;
      } else {
        settings.bri = data[0];
        if (lastKnown === 0) {
          settings.on = true;
        }
      }
      
      var postStr = JSON.stringify(settings);
      //console.log(postStr);
      
      var xhr = new XMLHttpRequest();
      
      xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          var res = JSON.parse(this.responseText);
          console.log(res[0]);
          lastKnown = data[0];
        }
      };
      
      xhr.onerror = function () {
        console.log(this.error);
      };
      
      xhr.open('PUT', 'http://192.168.0.14/api/dyjO-XNXvcP0PhkwflklW95qr-zkLdsgnrjV4VbI/lights/2/state');
      xhr.send(postStr);
    }
  });
});