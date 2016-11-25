"use strict";
// avoid making global variables unintentionally

//TODO:
// 1. add badge the shows how many companies are in the current cache.


// browser.js - supports the functions of bowser.html
(function () {
  var programName = "browser.js";
  var btn_source = document.getElementById("req-source");
  var btn_extract = document.getElementById("req-extract");
  var btn_download = document.getElementById("req-download")
  var btn_clear = document.getElementById("req-clear");

  function processSourceRequest(evt) {
    console.log(programName + " Source Button clicked");
    // console.log(evt);
  }
  function processExtractRequest(evt) {
    console.log(programName + " Extract Button clicked");

  }
  function processDownloadRequest(evt) {
    console.log(programName + " Download Button clicked");

  }
  function processClearRequest(evt) {
    console.log(programName + " Clear Button clicked");

  }

  console.log(programName + " was executed");
  btn_source.addEventListener("click", processSourceRequest);
  btn_extract.addEventListener("click", processExtractRequest);
  btn_download.addEventListener("click", processDownloadRequest);
  btn_clear.addEventListener("click", processClearRequest);


} ());