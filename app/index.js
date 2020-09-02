import clock from "clock";
import document from "document";
import onHeartUpdate from './heart';
import { preferences } from "user-settings";
import { zeroPad, } from "../common/utils"; 
import { battery } from "power"; 
import userActivity from "user-activity";


const timeHandle = document.getElementById("timeLabel");
const batteryHandle = document.getElementById("batteryLabel"); 
const stepsHandle = document.getElementById("stepsLabel");
const caloriesHandle = document.getElementById("caloriesLabel");
const distanceHandle = document.getElementById("distanceLabel");

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
});

// Date 
const dateValue = document.getElementById("dateLabel");
clock.granularity = 'seconds';

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

clock.ontick = (evt) => {
  const now = evt.date; // get the actual instant
  let hours = now.getHours(); // separate the actual hours from the instant "now"
  let mins = now.getMinutes(); // separate the actual minute from the instant "now"
  let secs = now.getSeconds(); // separate the actual second from the instan "now"
  if (preferences.clockDisplay === "12h") { // check from your wach settings if you use 12h or 24h visualization
    // 12h format
    hours = hours % 12 || 12; 
  } else {
    // 24h format
    hours = zeroPad(hours); // when you use 24h in case hours are in one digit then I put a zero in front. i.e. 3 am -> 03
  }
  let minsZeroed = zeroPad(mins); // one digit mins get a zero in front
  let secsZeroes = zeroPad(secs); // one digit secs get a zero in front
  timeHandle.text = `${hours}:${minsZeroed}:${secsZeroes}`; // time in format hh:mm:ss is assigned in the timeHandle defined at line 13
  
  // Activity Values: adjusted type
  let stepsValue = (userActivity.today.adjusted["steps"] || 0); // steps value measured from fitbit is assigned to the variable stepsValue
  stepsHandle.text =  stepsValue;

  let caloriesValue = (userActivity.today.adjusted["calories"] || 0); // calories
  caloriesHandle.text =  caloriesValue;

  let distanceValue = (userActivity.today.adjusted["distance"] || 0); // distance
  distanceHandle.text =  distanceValue;

  // Battery Measurement
  let batteryValue = battery.chargeLevel; // measure the battery level and send it to the variable batteryValue
  
  // Assignment value battery
  batteryHandle.text = `${batteryValue} %`; // the string including the batteryValue is being sent to the batteryHandle set at line 14
}