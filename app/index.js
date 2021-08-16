import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { today } from 'user-activity';
import { display } from "display";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const heartRate = document.getElementById('hr');
const steps = document.getElementById('steps');
const cal = document.getElementById('cal');

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  myLabel.text = `${hours}:${mins}`;

}


if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    heartRate.text = `${hrm.heartRate}`;
    updateSteps();
    updateCals();

  });
  hrm.start();
  
  if (BodyPresenceSensor) {
  const body = new BodyPresenceSensor();
  body.addEventListener("reading", () => {
    if (!body.present) {
      hrm.stop();
    } else {
      hrm.start();
    }
  });
  body.start();
  }
}

function updateSteps() {
  steps.text = `${(today.adjusted.distance / 1609.344).toFixed(2) } mi`;
}

function updateCals() {
  let cals = (today.adjusted.calories);
  cal.text = `${cals} cal`;
}
