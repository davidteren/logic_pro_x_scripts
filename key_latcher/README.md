# KeyLatcher


This Apple Logic Pro MIDI Script is designed to create a custom MIDI effect that allows users to latch and delay the release of specific notes within a defined range. The script has a few key features:

1. Note Latching: The script allows users to press and hold a key, and then release it later without affecting the sound. This is achieved by storing the latched notes in the latchedNotes object and sending the corresponding NoteOn event when the key is released.

2. Delayed Note Off Events: The script introduces a delay when releasing the latched notes. This is done by storing the NoteOff events in the delayedOffEvents array with a specified delay (in milliseconds), and processing them in the ProcessMIDI function.

3. User-Controllable Parameters: The script includes two user-controllable parameters, Low Key and High Key, which define the range of notes that should be affected by the latching and delaying effect. The script uses the noteNames array to provide a user-friendly menu for selecting the keys.

4. Handling MIDI Events: The HandleMIDI function processes incoming MIDI events, checking if they are NoteOn or NoteOff events and if they fall within the defined range. If a NoteOn event meets the criteria, the script toggles the latch state for that note. If a NoteOff event meets the criteria, the script checks if the note is currently latched, and if so, it skips sending the NoteOff event.

5. Trace Latched Keys: The traceLatchedKeys function is used to display the currently latched keys in the console, which can be useful for debugging and understanding the script's behavior.

6. Overall, this script works well with Virtual Instruments in Logic Pro that bennefit from sustained notes like [Vengeance Sound VPS Avenger](https://www.vengeance-sound.com/plugins.php?sub=Vengeance%20Producer%20Suite%20Avenger%202). 