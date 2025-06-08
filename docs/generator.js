const progressions = [
    "I V ii IV", // The Cure, Heaven
    "I vi iii IV", // Pixies
	"I ii vi IV", //  Muse
	"ii V I IV", // The Strokes
	"I III vi IV", // Oasis
    "I V vi IV", // The Beatles, Let It Be
    "I vi iii V", // "She Love You", "Girl on Fire", "You Got It"
    "i iiib viib vib" // Polly, In the End
    // "I IV V I",
    // "i iv v i",
];

const roman = [
    "i",
    "iib",
    "ii",
    "iiib",
    "iii",
    "iv",
    "vb",
    "v",
    "vib",
    "vi",
    "viib",
    "vii",
];
const romanToNumber = new Map(roman.map((element, index) => [element, index]));

const sounds = [
    "c",
    "c♯",
    "d",
    "d♯",
    "e",
    "f",
    "f♯",
    "g",
    "g♯",
    "a",
    "b♭",
    "b",
];
const soundToNumber = new Map(sounds.map((element, index) => [element, index]));

/**
 * Get a random integer between min and max, inclusive.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random element from the array.
 * @template T
 * @param {T[]} array
 * @returns {T|undefined}
 */
function getRandomElement(array) {
    if (!array || array.length === 0) {
        return undefined;
    }
    return array[getRandomInt(0, array.length - 1)];
}

/**
 * Returns a shuffled copy of the array.
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
function shuffleArray(array) {
    const newArray = [...array]; // Create a copy to avoid modifying the original array
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }
    return newArray;
}

/**
 * Determines the mode (major/minor) from a Roman numeral string.
 * @param {string} roman
 * @returns {"major"|"minor"}
 */
function getMode(roman) {
    if (roman === roman.toLowerCase()) {
        return "minor";
    } else {
        return "major";
    }
}

/**
 * Parses a chord progression string into an array of step/mode objects.
 * @param {string} progression - e.g. "I IV V I"
 * @returns {Array<{step: number, mode: "major"|"minor"}>}
 */
function parseProgression(progression) {
    return progression.split(/\s/).filter((s) => !!s).map((s) => ({
        step: romanToNumber.get(s.toLowerCase()),
        mode: getMode(s),
    }));
}

/**
 * Returns the chord name for a given tonic number and mode.
 * @param {number} tonicNr - Index in the sounds array.
 * @param {"major"|"minor"} mode
 * @returns {string}
 */
function getChord(tonicNr, mode) {
    const sound = sounds[tonicNr];
    switch (mode) {
        case "major":
            return sound.toUpperCase();

        case "minor":
            return sound.toLowerCase() + "m";

        default:
            return "?";
    }
}

/**
 * Fills a parsed progression with chord names.
 * @param {Array<{step: number, mode: "major"|"minor"}>} progression
 * @param {{chosenSound: {major: string, minor: string}}} [instrument=INSTRUMENT.piano]
 * @returns {Array<{step: number, mode: "major"|"minor", chord: string}>}
 */
function fillProgression(progression, instrument = INSTRUMENT.piano) {
    const chosenBeatNo = getRandomInt(0, progression.length - 1);
    const chosenBeat = progression[chosenBeatNo];
    const chosenSound = soundToNumber.get(instrument.chosenSound[chosenBeat.mode]);
    const tonicAsNumber = (chosenSound - chosenBeat.step + sounds.length) %
        sounds.length;

    progression.instrument = instrument;

    return progression.map((bar) => {
        const soundNumber = (tonicAsNumber + bar.step + sounds.length) %
            sounds.length;
        return {
            ...bar,
            chord: getChord(soundNumber, bar.mode)
        }
        
    });
}

/**
 * Adds a variation (shift or shuffle) to a progression.
 * @param {Array<{step: number, mode: "major"|"minor", chord: string}>} progression
 * @returns {Array<{step: number, mode: "major"|"minor", chord: string, variation?: string}>}
 */
function addVariation(progression) {
    let variation = 'none';
    switch (getRandomInt(1, 3)) {
        case 1:
            variation = 'shift';
            const times = getRandomInt(1, progression.length - 1);
            for (let i = 0; i < times; i += 1) {
                progression.unshift(progression.pop());
            }
            break;

        case 2:
            variation = 'shuffle';
            progression = shuffleArray(progression);
            break;
    }

    progression.variation = variation;
    return progression;
}

/**
 * Instrument definition.
 * @typedef {Object} Instrument
 * @property {string} icon
 * @property {string} color
 * @property {{major: string, minor: string}} chosenSound
 */
export const INSTRUMENT = {
    piano: {
        icon: "piano",
        color: "#8b5cf6",
        chosenSound: {
            minor: "a",
            major: "c",
        }
    },
    guitar: {
        icon: "guitar",
        color: "#06b6d4",
        chosenSound: {
            minor: "e",
            major: "e",
        }
    },
    ukulele: {
        icon: "music",
        color: "#f97316",
        chosenSound: {
            minor: "a",
            major: "c",
        }
    },
}

/**
 * Generates a random chord progression for the given instrument.
 * @param {"piano"|"guitar"|"ukulele"} [instrument]
 * @returns {Array<{step: number, mode: "major"|"minor", chord: string, variation?: string}>}
 *   Each object in the array has:
 *     - step: number (0-11, index in the chromatic scale)
 *     - mode: "major"|"minor"
 *     - chord: string (e.g. "C", "am")
 *     - variation: string ("shift", "shuffle", or "none") [only on the array, not per chord]
 */
export function generateChordProgression(instrument) {
    instrument = INSTRUMENT[instrument] ?? instrument ?? INSTRUMENT.piano;

    const rawProgression = getRandomElement(progressions);
    const progression = parseProgression(rawProgression);
    const filledProgression = fillProgression(progression, instrument);
    const variation = addVariation(filledProgression);
    return variation;
}

// console.log(generateChordProgression());
