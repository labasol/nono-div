"use strict";
// avoid creating global variables unintentionally

(function () {
  //  Important assumptions about the page:
  //    +Table of interest is the 7th table of the document
  //    +Table rows demarcating rows of interest are rows with only one
  //      child with values: "INCREASED", "INITIAL", and "REGULAR"
  //      in that order.
  //    +All rows between "INCREASED" and "INITIAL" are reported in
  //      ro.increased.  All rows between "INITIAL" and "REGULAR" are
  //      reported in ro.  

  let programName = "contentScript.js";

  let ttabs = document.getElementsByTagName("table").item(6);
  //  get a reference to the seventh table[6] in the document

  let trows = {
    header: [],
    increased: [],
    initial: [],
    ignore: []
  };  // collection in preparation to reporting
  console.log(trows);

  let ro = {
    extracted: "",
    header: [],
    increased: [],
    initial: []
  }; // report object

  let colStat = trows.header;
  console.log(colStat);

  function collectTableRows() {
    //  returns true if table appears to contain dividend information 
    //  false otherwise
    //  Side-effect: trows contains node references. Array of "td" nodes for "header"
    //    and array of "tr" nodes for "increased"
    let tbody = ttabs.childNodes.item(1);  // tbody element is 2nd node

    if (!tbody) return false;
    if (tbody.hasChildNodes()) {
      let nNodes = tbody.childNodes.length;
      for (let i = 0; i < nNodes; i++) {
        var n = tbody.childNodes[i];
        if (n.nodeType !== 1) continue;
        // we only care about element nodes nodeType === 1
        // console.log("collectTableRows: Found element node " + i + " name: " 
        // + n.nodeName, "length: " + n.childNodes.length);
        // console.log(n);
        let ntd = n.childNodes; // nodes under tr - interested in td.
        if (ntd.length === 21) {
          console.log("process dividend rows");
          colStat.push(ntd);
        } else if (ntd.length === 3) {
          let text = ntd.item(1).innerText;
          console.log("process marker row [" + text + "]");
          if (text === "INCREASED") {
            // set up the increased collection point
            colStat = trows.increased;
          } else if (text === "INITIAL") {
            // set up the initial collection point
            colStat = trows.initial;
          } else {
            // set up the ignore collection point
            colStat = trows.ignore;
          }
        } else if (ntd.length === 11) {
          //  first table row must begin with "AMOUNT"
          if (!ntd.item(4).innerText.startsWith("AMOUNT")) {
            console.log("first row test failed. found" + ntd.item(4).innerText);
            return false;
          }
          // console.log("verify header row");
          // console.log(ntd);
        } else {
          console.log('Unrecognized "tr" element ' + ntd.length);
          console.log(n);
        }
        // console.log(ntd);
      }
    } else {
      return false;
    }
    return true;
  };

  function extractText(source, target) {
    // source - is a NodeList with the list of "td"
    // target - is an array where the texts will be collected.
    target.push(source[1].innerText);
    target.push(source[3].innerText);
    target.push(source[5].innerText);
    target.push(source[7].innerText);
    target.push(source[9].innerText);
    target.push(source[11].innerText);
    target.push(source[13].innerText);
    target.push(source[15].innerText);
    target.push(source[17].innerText);
    target.push(source[19].innerText);
  }
  function submitDividendReport() {
    // start making the report object 
    // place Date / Time stamp
    // Compose the header array.
    let timeStamp = new Date();
    let options = {
      weekday: "long", year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    }
    console.log("buildReportHeader timestamp: " 
      + timeStamp.toLocaleDateString("en-us", options));
    // fill out header
    ro.extracted = timeStamp.toISOString();
    extractText(trows.header[0], ro.header);
    // fill out INCREASED
    let iLength = trows.increased.length;
    let d;
    for (let i = 0; i < iLength; i++) {
      d = [];
      d.push("INCREASED");
      extractText(trows.increased[i], d)
      ro.increased.push(d);
    }
    // fill out INITIAL
    iLength = trows.initial.length;
    for (let i = 0; i < iLength; i++) {
      d = [];
      d.push("INITIAL");
      extractText(trows.initial[i], d)
      ro.increased.push(d);
    }
    chrome.runtime.sendMessage({type: "dividend", report: ro},
      function(response){
        console.log(response);
      });  // submit to eventPage.js
  }

  if (collectTableRows()) {
    submitDividendReport();
  } else {
    // Tell eventPage.js that extension and page are out of sync.
  }
  console.log(trows);
  console.log(ro);
  console.log("contentPage was executed");

} ());