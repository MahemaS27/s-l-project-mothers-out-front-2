// Client ID and API key from the Developer Console
var CLIENT_ID = '278848919786-bvr9hekqhc7jtr9l1s1i1c77go091fdc.apps.googleusercontent.com';
// var CLIENT_SECRET = 'bFaJScch0lMxdngVY5m0ww7g';
var API_KEY = 'AIzaSyCO4WksnX_r3rU2GZdXz3YICC_gOPVtVvY';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

// Spreadsheet ID from Mothers Out Front spreadsheet
var SPREADSHEET_ID = '1PI-Ouc8v2fXHk0WAMRx6RF0lLiMBWzhIdIKEa8TaUbo';

// All states with data
var STATES = ['MA', 'NY', 'CA', 'VA', 'CO', 'MI', 'WA', 'AL', 'NH', 'OH', 'PA'];

// Instantiate global variables for each state
var MA;
var NY;
var CA;
var VA;
var CO;
var MI;
var WA;
var AL;
var NH;
var OH;
var PA;

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    getNatlData()
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the National data from our Mothers Out Front spreadsheet:
 * https://docs.google.com/spreadsheets/d/1PI-Ouc8v2fXHk0WAMRx6RF0lLiMBWzhIdIKEa8TaUbo/edit#gid=703770024
 */
function getNatlSheetData() {
   gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Natl Monthly Cover Page!A38:U',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
        for (i = 0; i < range.values.length; i++) {
          var row = range.values[i];
          // Print the desired columns
          appendPre(row[1] + ', ' + row[2]);
        }
    } else {
        appendPre('No data found.');
    }
  }, function(response) {
      appendPre('Error: ' + response.result.error.message);
    });
}

/**
 * Calculates and gets the 2D array for Washington.
 * Requires the summation of data from two sheets.
 * 
 */
function getWAData() {
  // Instatiate arrays for output and the two counties
  var output = [];
  var date = ['Date'];
  var supporterStep = ['\nSupporterStep'];
  var volunteerStep = ['\nVolunteerStep'];
  var leadingStep = ['\nLeadingStep'];
  var totMembers = ['\nTotalMembers'];
  var supporterStep1 = [];
  var volunteerStep1 = [];
  var leadingStep1 = [];
  var totMembers1 = [];
  var supporterStep2 = [];
  var volunteerStep2 = [];
  var leadingStep2 = [];
  var totMembers2 = [];

  // Get the first county spreadsheet
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Exp, Seattle, WA!A45:E',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      for (i = 1; i < range.values.length; i++) {
        var row = range.values[i];
        // Add the desired columns to the correct array
        supporterStep1.push(parseInt(row[1]))
        volunteerStep1.push(parseInt(row[2]))
        leadingStep1.push(parseInt(row[3]))
        totMembers1.push(parseInt(row[4]))
      }
      // Get the second county spreadsheet
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Exp, Snohomish, WA!A45:E',
      }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
          for (i = 1; i < range.values.length; i++) {
            var row = range.values[i];
            // Add the desired columns to the correct array
            date.push(new Date(row[0]))
            supporterStep2.push(parseInt(row[1]))
            volunteerStep2.push(parseInt(row[2]))
            leadingStep2.push(parseInt(row[3]))
            totMembers2.push(parseInt(row[4]))
          }
          // Sum the arrays to get WA total values
          for (i = 1; i < supporterStep2.length; i++) {
            supporterStep.push(supporterStep1[i] + supporterStep2[i])
            volunteerStep.push(volunteerStep1[i] + volunteerStep2[i])
            leadingStep.push(leadingStep1[i] + leadingStep2[i])
            totMembers.push(totMembers1[i] + totMembers2[i])
          }

          // Add all arrays to output array to create 2D array
          output.push(date)
          output.push(supporterStep)
          output.push(volunteerStep)
          output.push(leadingStep)
          output.push(totMembers)
          WA = output;
          return WA;
        } else {
          appendPre('No data found.');
          throw 'No data found.';
        }
      }, function(response) {
        appendPre('Error: ' + response.result.error.message);
        throw 'Error: ' + response.result.error.message;
      });
    } else {
      appendPre('No data found.');
      throw 'No data found.';
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
    throw 'Error: ' + response.result.error.message;
  });
}

//////////////////////////////////// END OF AUTHENTICATION AND HELPERS ///////////////////////////////////////////////////////////
//////////////////////////////////// MAIN FUNCTIONS BELOW ////////////////////////////////////////////////////////////////////////

/**
 * Gets a 2D array of membership for the desired state.
 * 
 * @param {string} state
 */
function getStateData(state) {
  // Ensure this is a valid state
  if (!STATES.includes(state)) {
    appendPre('Error: Invalid State Choice');
    throw 'Error: Invalid State Choice';
  }

  // Instatiate arrays
  var output = [];
  var date = [];
  var supporterStep = [];
  var volunteerStep = [];
  var leadingStep = [];
  var totMembers = [];

  // WA is an anomoly that requires extra calculation
  if (state === 'WA') {
    output = getWAData();
    return output;
  }

  // Get the sheet range for the desired state
  var sheetRange;
  switch(state) {
    case 'MA':
      sheetRange = 'MA!A45:E';
      break;
    case 'NY':
      sheetRange = 'NY!C48:G';
      break;
    case 'CA': 
      sheetRange = 'CA!C55:H';
      break;
    case 'VA':
      sheetRange = 'VA!B54:F183';
      break;
    case 'CO':
      sheetRange = 'Colorado!A45:E';
      break;
    case 'MI':
      sheetRange = 'Michigan!A45:E';
      break;
    case 'AL':
      sheetRange = 'Exp, Lee County, AL!A45:E';
      break;
    case 'NH':
      sheetRange = 'Exp, New Hampshire!A45:E';
      break;
    case 'OH':
      sheetRange = 'Exp, Yellow Springs, OH!A45:E';
      break;
    case 'PA':
      sheetRange = 'Exp, Pennsylvania!A45:E';
      break;
  }
  
  // Get the spreadsheet
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetRange,
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      // Add headers to each array
      date.push('Date')
      supporterStep.push('\nSupporterStep')
      volunteerStep.push('\nVolunteerStep')
      leadingStep.push('\nLeadingStep')
      totMembers.push('\nTotalMembers')
    
      for (i = 1; i < range.values.length; i++) {
        var row = range.values[i];
        // Add the desired columns to the correct array
        date.push(new Date(row[0]))
        supporterStep.push(parseInt(row[1]))
        volunteerStep.push(parseInt(row[2]))
        leadingStep.push(parseInt(row[3]))
        // CA is anomoly
        if (state === 'CA') {
          totMembers.push(parseInt(row[5]))
        } else {
          totMembers.push(parseInt(row[4]))
        }
      }
      // Add all arrays to output array to create 2D array
      output.push(date)
      output.push(supporterStep)
      output.push(volunteerStep)
      output.push(leadingStep)
      output.push(totMembers)
      return output;
    } else {
      appendPre('No data found.');
      throw 'No data found.';
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
    throw 'Error: ' + response.result.error.message;
  });
  return output;
}

/**
* This getter gets national data through calculation. This function
* sums all of the state data to get national data.
* 
*/
function getNatlData() {
  // Get the arrays for each state
  MA = getStateData('MA');
  NY = getStateData('NY');
  CA = getStateData('CA');
  VA = getStateData('VA');
  CO = getStateData('CO');
  MI = getStateData('MI');
  WA = getStateData('WA');
  AL = getStateData('AL');
  NH = getStateData('NH');
  OH = getStateData('OH');
  PA = getStateData('PA');

  // for (i = 0; i < MA[0].length; i++) {

  // }
}