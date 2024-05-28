var latchedNotes = {};
var delayedOffEvents = []; // Array to hold delayed NoteOff events
var releaseDelay = 20; // Delay in milliseconds for releasing the note

var noteNames = [
    "C0", "C#0", "D0", "D#0", "E0", "F0", "F#0", "G0", "G#0", "A0", "A#0", "B0",
    "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
    "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
    "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
    "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
    "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
    "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
    "C8", "C#8", "D8", "D#8", "E8", "F8", "F#8", "G8", "G#8", "A8", "A#8", "B8"
];

// Define user-controllable parameters
var PluginParameters = [
    {
        name: "Low Key",
        type: "menu",
        valueStrings: noteNames,
        defaultValue: 24 // Default to C1
    },
    {
        name: "High Key",
        type: "menu",
        valueStrings: noteNames,
        defaultValue: 59 // Default to B2
    }
];

function HandleMIDI(event) {
    var lowKey = GetParameter("Low Key");
    var highKey = GetParameter("High Key");

    if (event instanceof NoteOn && event.pitch >= lowKey && event.pitch <= highKey) {
        toggleLatch(event);
    } else if (event instanceof NoteOff && event.pitch >= lowKey && event.pitch <= highKey) {
        if (!latchedNotes[event.pitch]) {
            event.send();
        }
    } else {
        event.send();
    }
}

function toggleLatch(event) {
    if (!latchedNotes[event.pitch]) {
        releaseAllLatchedNotesWithDelay();
    }

    if (latchedNotes[event.pitch]) {
        delete latchedNotes[event.pitch];
        event.send();
    } else {
        latchedNotes[event.pitch] = true;
        event.send();
    }

    traceLatchedKeys();
}

function releaseAllLatchedNotesWithDelay() {
    for (var pitch in latchedNotes) {
        if (latchedNotes.hasOwnProperty(pitch)) {
            var noteOff = new NoteOff();
            noteOff.pitch = parseInt(pitch);
            delayedOffEvents.push({event: noteOff, delay: releaseDelay});
        }
    }
    latchedNotes = {};
}

function ProcessMIDI() {
    delayedOffEvents.forEach(function (delayedEvent, index) {
        if (delayedEvent.delay <= 0) {
            delayedEvent.event.send();
            delayedOffEvents.splice(index, 1);
        } else {
            delayedEvent.delay -= 1; // Decrease the delay count
        }
    });
}

function Reset() {
    releaseAllLatchedNotes();
}

function traceLatchedKeys() {
    var latchedKeysString = Object.keys(latchedNotes).map(function (pitch) {
        return noteNames[pitch];
    }).join(", ");
    Trace("Latched Keys: " + latchedKeysString);
}
