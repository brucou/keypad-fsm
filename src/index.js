import { createStateMachine, COMMAND_RENDER, NO_OUTPUT } from "kingly"

// Define the state machine
// State monikers
const INIT = "OFF";
const PIN = "PIN";
const NO_PIN = "NO_PIN";
const DONE = "DONE";

// Event monikers
const START = "START";
const CLEAR_CLICKED = "CLEAR_CLICKED";
const SUBMIT_CLICKED = "SUBMIT_CLICKED";
const NUM_KEY_CLICKED = "NUM_KEY_CLICKED";

// Commands
const SUBMIT = "SUBMIT";

// State update
// Basically {a, b: {c, d}}, [{b:{e}]} -> {a, b:{e}}
// All Object.assign caveats apply
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function updateState(extendedState, extendedStateUpdates) {
  const extendedStateCopy = Object.assign({}, extendedState);
  return extendedStateUpdates.reduce((acc, x) => Object.assign(acc, x), extendedStateCopy);
}

export const events = [NUM_KEY_CLICKED, SUBMIT_CLICKED, CLEAR_CLICKED, START];
const states = {
  [INIT]: "",
  [PIN]: "",
  [NO_PIN]: "",
  [DONE]: "",
};
const initialControlState = INIT;
const initialExtendedState = {
  pin: ""
};
const transitions = [
  { from: INIT, event: START, to: NO_PIN, action: displayAndEmitNoPin },
  { from: NO_PIN, event: NUM_KEY_CLICKED, to: PIN, action: displayAndEmitPin },
  { from: PIN, event: CLEAR_CLICKED, to: NO_PIN, action: displayAndEmitNoPin },
  { from: PIN, event: NUM_KEY_CLICKED, to: PIN, action: displayAndEmitPin },
  { from: PIN, event: SUBMIT_CLICKED, to: DONE, action: displayAndSubmitPin },
];

// Actions
function displayAndEmitNoPin(extendedState, eventData, settings) {
  return {
    updates: [{pin:""}],
    outputs: [{
      command: COMMAND_RENDER,
      params: { pin:"" }
    }],
  }
}

function displayAndEmitPin(extendedState, eventData, settings) {
  const { pin } = extendedState;
  const digit = eventData;
  const newPin = pin + digit;

  return {
    updates: [{pin:newPin}],
    outputs: [{
      command: COMMAND_RENDER,
      params: { pin:newPin }
    }],
  }
}

function displayAndSubmitPin(extendedState, eventData, settings) {
  const { pin } = extendedState;

  return {
    updates: [],
    outputs: [{
      command: SUBMIT,
      params: { pin }
    }],
  }
}

export const fsmDef = {
  initialControlState,
  initialExtendedState,
  states,
  events,
  transitions,
  updateState
};
