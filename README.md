#Dividend Extract

This is a Chrome extension that can be used to screen scrape dividend information 
from the web page:
[http://online.barrons.com/mdc/public/page/9_3022-dividends.html]

This first attempt will try to extract the data found in tables under the 
heading "DIVIDENDS DECLARATIONS" in the  "INCREASED" and "INITIAL" tables. 

The extract will collect the following data elements for each row:

1. Row Type
  * "heading" - row contain the table heading texts
  * "inreased" - row contains data of stock that increased its dividend
  * "initial" - row contains data of stock making an initial dividend
2. Company Name
3. Company Symbol
4. % Yield
5. New
6. Old
7. Period
8. Payable
9. Record
10. Ex-Dividend
11. Notes

An extracted row of information is collected by the content script from web page and 
each row of collected data is sent 
to the eventPage to be collected.  These rows are cached in an indexedDB
storage as browser persistence.  A user can request the collected rows to be 
downloaded as
a comma delimited file. 

##User Interface

A browser action icon is provided by the extension to enable the user to control system
behavior.

The popup screen pops up when the icon is clicked shows the following:

+ Source - bring up the source page in a new window.
+ Download - this will be greyed if the eventPage.js does not have dividend information.
+ Display - open a new window that shows the current dividend information.

The popup will grey Download and Display if the eventPage.js does not have dividend
information to output.  A color signal should also be shown in the pop-up.  Red for 
no data, and green for data available for output.

#Components

The system have the following components:

+ **Event Page** - knows the status of the extension and the system. acts as the central
   message processor for the whole extension. Responsible for remembering all the
   activities of the contentScript and the browser action.  Summarizes the reports into
   a useful set of data stored in IndexedDB cache. Responds to questions about the status
   of the system.  Performs the work necessary to deliver content the user commands require.
+ **Content Script** - is able to access the source page.  Responsible for reporting the content
   of the source page to the Event Page.
+ **Browser Action** - is a User Interface gadget resposible for acquiring and interpreting
   user commands.  Responsible for sending those commands to the Event Page. Responsible
   for querying the Event Page about the status of the system.
+ **Miscellaneous Web Pages** - is User Interface to fulfill commands initiated through
   Browser Action, but requires more elaborate interaction than the Browser Action can
   perform.  These web pages are initiated by Event Page.

##Communication with Event Page

###Content Script - Event Page
Event page is a central component where knowledge is accumulated and system state is known.
Communication between contentScript.js and eventPage.js will be conducted as Long Lived
type communication.  The communication is basically a report of the current contents of
the source page. When the content script is executed, it walks the DOM once and extracts
the Dividend information and communicates that to the event script. When all information
have been communicated.  The conneection should be terminated.

###Popup - Event Page
Popup asks Event Page if Dividend is Available.  Download and Display buttons are disabled
if not available.

If Download or Display buttons are enabled, the user click will result in a message to the
eventPage.js.



