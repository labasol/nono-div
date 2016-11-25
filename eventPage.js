"use strict";
// avoid creating global variables unintentionally

(function () {
  // Declarations
  let programName = "eventPage.js";
  // Need an object that holds all the ports that are open.
  // let connPort;
  let ro;
  let fileName = "dividend.txt"
  let crlf = "\r\n";

  function cQuote(s){
    if (typeof s === 'string') {
      return '"' + s + '"';
    } else {
      return s;
    };
  };
  function commaSeparatedReport() {
    let line = [];
    let length = ro.header.length;
    let nLength;
    let file;
    let i;
    let j;
    let comma = ",";


    line.push(cQuote(ro.extracted));
    for (i = 0; i < length; i++) { 
       line.push(cQuote(ro.header[i]));
    }
    file = line.join(comma) + crlf;
    length = ro.increased.length;
    for (i = 0; i < length; i++) {
      nLength = ro.increased[i].length;
      line = [];
      for (j = 0; j < nLength; j++) {
        line.push(cQuote(ro.increased[i][j]));
      }
      file = file + line.join(comma) + crlf;
    }
    length = ro.initial.length;
    for (i = 0; i < length; i++) {
      nLength = ro.initial[i].length;
      line = [];
      for (j = 0; j < nLength; j++) {
        line.push(cQuote(ro.initial[i][j]));
      }
      file = file + line.join(comma) + crlf;
    }
    return file;
  };

  function downloadReport(report) {
    let file = "data:text/plain;charset=utf-8,";
    let encoded = encodeURIComponent(report);
    file += encoded;
    let a = document.createElement('a');
    a.href = file;
    a.target = '_blank';
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  function processSingleIncomingMessage(request, sender, sendSingleResponse) {
    console.log(sender.tab ? "from content script" + sender.tab.url :
      "from the extension");
    if (request.type === "dividend") {
      ro = request.report;
      downloadReport(commaSeparatedReport());
      console.log(request);
      console.log(ro);
      sendSingleResponse({ response: "ok" });
    };
  };

  // function handleKnockKnockMessages(port){
  //   port.onMessage.addListener(processKnockKnockMessage);
  // }

  // function connectLongLivedConnection(port) {
  //   console.log(port.name);
  //   switch(port.name) {
  //     case "knockknock":
  //       handleKnockknockMessages(port);
  //       break;
  //     case "bangles":
  //       console.log("Handle bangles Messages");
  //       break;
  //     default:
  //       console.log("Handle " + port.name + "Unexpected");
  //   }
  // }

  // Exectution
  chrome.runtime.onMessage.addListener(processSingleIncomingMessage);
  // chrome.runtime.onConnect.addListener(connectLongLivedConnection);

  console.log(programName + " was executed");
} ());