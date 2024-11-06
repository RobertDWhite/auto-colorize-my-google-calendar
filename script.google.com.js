const DEBUG = true;

// Color mapping for IDs
const colorIDs = {
  'lavender': '1',        // ID 1
  'sage': '2',            // ID 2 - light green
  'grape': '3',           // ID 3 - purple
  'flamingo': '4',        // ID 4 - pinkish
  'yellow': '5',          // ID 5 - also banana
  'orange': '6',          // ID 6 - also tangerine
  'peacock': '7',         // ID 7 - light blue
  'graphite': '8',        // ID 8 - gray
  'blueberry': '9',       // ID 9 - blueish purple
  'green': '10',          // ID 10
  'tomato': '11'          // ID 11 - also red
  // see current available colors here: https://google-calendar-simple-api.readthedocs.io/en/latest/colors.html
};

function colorizeCalendar() {
  // date modifications should occur here
  // use these dates to go back forever and all the way to the future..
  // great for a first run
  // comment out for automation
  // ---------------------------------------------------------------
  const startDate = new Date(0); // Epoch
  const endDate = new Date(253402300799999); // Far future date
  // ---------------------------------------------------------------

  // use these dates for automation
  // when an event is added, go back up to 1 week in time up to one year from now to process colors
  // uncomment for usage
  // ---------------------------------------------------------------
  //const now = new Date();
  //const startDate = new Date(now.setDate(now.getDate() - 7)); // One week ago
  //const endDate = new Date(now.setFullYear(now.getFullYear() + 1)); // One year from now
  // ---------------------------------------------------------------

  // extract companyname.com from our email
  const myOrg = CalendarApp.getDefaultCalendar().getName().split("@")[1];
  
  // get all calendar events
  var calendarEvents = CalendarApp.getDefaultCalendar().getEvents(startDate, endDate);

  if (DEBUG) {
    console.log("Calendar default org: " + myOrg);
  }

  for (var i = 0; i < calendarEvents.length; i++) {
    colorizeByRegex(calendarEvents[i], myOrg); // Process EVERY event
  }
}

function colorizeByRegex(event, myOrg) {
  const eventTitle = event.getTitle().toLowerCase();
  const guests = event.getGuestList(true); // true includes the organizer
  const externalParticipants = getExternalParticipants(guests, myOrg);

  // prioritize external participants for customer colorings
  for (const participant of externalParticipants) {
    // ---------------------------------------------------------------
    // add a customer here
    // replace the names of the events such as CUSTOMER1 <> OURCOMPANYNAME
    // add customer1 as a name check, add domain
    if (/customer1/.test(eventTitle) || participant.includes("customer1.com") || /customer 1/.test(participant)) {
      console.log("Colorizing customer1 found: " + eventTitle);
      setEventColor(event, 'yellow');
      return;
    }

    // add a customer here
    if (/customer2/.test(eventTitle) || participant.includes("customer2.com") || /customer 2/.test(participant)) {
      console.log("Colorizing customer2 found: " + eventTitle);
      setEventColor(event, 'lavender');
      return;
    }

    // add a customer here
    if (/customer3/.test(eventTitle) || participant.includes("customer3.com") || /customer 3/.test(participant)) {
      console.log("Colorizing customer3 found: " + eventTitle);
      setEventColor(event, 'blueberry');
      return;
    }

    // add a customer here
    if (/customer4 /.test(eventTitle) || participant.includes("customer4.com")) {
      console.log("Colorizing customer4 found: " + eventTitle);
      setEventColor(event, 'flamingo');
      return;
    }

    // add a customer here
    if (/partner1/.test(eventTitle) || /partner1/.test(eventTitle) || participant.includes("partner1.com") || /partner 1/.test(participant)) {
      console.log("Colorizingpartner1 found: " + eventTitle);
      setEventColor(event, 'tomato');
      return;
    }
    // ---------------------------------------------------------------

  }
  
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // check for company name (internal) events only after checking external participants
  if (/company name/.test(eventTitle) || /customer success/.test(eventTitle) || /cs accounts/.test(eventTitle) || /all hands/.test(eventTitle))  {
    console.log("Colorizing internal (companyname)) found: " + eventTitle);
    setEventColor(event, 'green'); // Set to green for company name
    return;
  }

  // If no specific keywords matched, check for company name emails
  const hasCOMPANYNAMEEmail = externalParticipants.some(participant => participant.endsWith("@companyname.com"));
  if (hasCOMPANYNAMEEmail) {
    console.log("Colorizing event with company name email found: " + eventTitle);
    setEventColor(event, 'green'); // Set to green for company name email
    return;
  }

  // If no specific keywords matched, label as external
  if (externalParticipants.length > 0) {
    console.log("Colorizing external event found: " + eventTitle);
    setEventColor(event, 'sage');
    return;
  }

  // check for interviews
  if (/interview/.test(eventTitle)) {
    console.log("Colorizing interview found: " + eventTitle);
    setEventColor(event, 'sage');
    return;
  }

  // check for training
  // this can be edited to search for any relevant information you want to track
  // replace "training" and "vendor" with your relevant Title searches
  if (/training/.test(eventTitle) || /vendor/.test(eventTitle)) {
    console.log("Colorizing training found: " + eventTitle);
    setEventColor(event, 'grape');
    return;
  }
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------

  // No match found, therefore no colorizing
  else {
    console.log("No matching rule for: " + eventTitle);
  }
}

// external users
function getExternalParticipants(guests, myOrg) {
  return guests
    .map(guest => guest.getEmail().toLowerCase())
    .filter(email => email.split("@")[1] !== myOrg); // Filter external participants
}

function setEventColor(event, color) {
  const colorID = colorIDs[color]; // Get the color ID
  if (colorID) {
    try {
      event.setColor(colorID); // Use the color ID
      console.log("Color set to: " + color); // Log the color name
    } catch (e) {
      console.error("Error setting color: " + e.message);
    }
  } else {
    console.error("Invalid color: " + color);
  }
}

// run manually if needed
function runColorCalendarEvents() {
  colorizeCalendar(); // Call the main function to color events
}
