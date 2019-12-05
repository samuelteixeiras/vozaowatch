import clock from "clock";
import document from "document";
import onHeartUpdate from './heart';


let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");
let i = 1; 
let initialSecs;
let newSec = 0;

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds, angle) {
  return (360 / 60) * seconds + angle;
}


// Rotate the hands every 100ms
function updateClock() {
  
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();
  initialSecs = secs;
  

  if( initialSecs != newSec ) {
    newSec = initialSecs;
    i = 0;
  }

  let angle =  (6 / 10) * i;
    
  if( i > 10) {
    i = 1;
  }
  i++;


  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs, angle);
  }

setInterval(updateClock, 100);

// Heart Rate
const heartrateHandle = document.getElementById("heartrateLabel");
onHeartUpdate(({ bpm, zone: rawZone }) => {
  if (bpm === '--') {
    heartrateHandle.text  = '--';
    return;
  }

  let zone = '';
  if (rawZone && rawZone !== 'out-of-range') {
    zone = ` ${rawZone}`;
  }
  heartrateHandle.text  = `${bpm}`;
  //heartrateHandle.text  = `${bpm} bpm${zone}`;
});


// Date 
const dateValue = document.getElementById("dateLabel");
clock.granularity = 'minutes';
clock.addEventListener('tick', (evt) => {
  const date = evt.date;
  dateValue.text = getDateValue(date);
});

function getDateValue(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return [
    days[date.getDay()],
    date.getDate(),
  ].join(' ');
}