var latchedNotes = {};
var toggleState = {};

function HandleMIDI(event) {
    if (event instanceof NoteOn || event instanceof NoteOff) {
        handleNoteEvent(event);
    } else if (event instanceof ControlChange) {
        handleCCEvent(event);
    } else {
        event.send();
    }
}

function handleNoteEvent(event) {
    if (event instanceof NoteOn) {
        if (latchedNotes[event.pitch]) {
            delete latchedNotes[event.pitch];
            var offEvent = new NoteOff(event);
            offEvent.send();
        } else {
            latchedNotes[event.pitch] = true;
            event.send();
        }
    } else {
        if (!latchedNotes[event.pitch]) {
            event.send();
        }
    }
}

function handleCCEvent(event) {
    var padCCs = [16, 36, 37, 38, 39, 40, 41, 42, 43]; // Example CC numbers for pads
    if (padCCs.includes(event.number)) {
        Trace("33: Pad CC event: " + event + " ||  toggleState: " + toggleState[event.number]);

        if (event.value == 127) {
            // Pad press event
            toggleState[event.number] = !toggleState[event.number];
            if (toggleState[event.number]) {
                event.value = 127;
            } else {
                event.value = 0;
            }
        } else if (event.value == 0) {
            // Pad release event, ignore it
            return;
        }

        Trace("49: Pad CC event: " + event + " ||  toggleState: " + toggleState[event.number]);
        event.send();
    } else {
        event.send();
    }
}

function Reset() {
    latchedNotes = {};
    toggleState = {};
}

function ProcessMIDI() {
    // Implement any timing-related logic if needed
}
