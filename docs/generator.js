const progressions = [
    "I V ii IV", // The Cure, Heaven
    "I vi iii IV", // Pixies
	"I ii vi IV", //  Muse
	"ii V I IV", // The Strokes
	"I III vi IV", // Oasis
    "I V vi IV", // The Beatles, Let It Be
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
    if (!array || array.length === 0) {
        return undefined;
    }
    return array[getRandomInt(0, array.length - 1)];
}

function shuffleArray(array) {
    const newArray = [...array]; // Create a copy to avoid modifying the original array
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }
    return newArray;
}

function getMode(roman) {
    if (roman === roman.toLowerCase()) {
        return "minor";
    } else {
        return "major";
    }
}

function parseProgression(progression) {
    return progression.split(/\s/).filter((s) => !!s).map((s) => ({
        step: romanToNumber.get(s.toLowerCase()),
        mode: getMode(s),
    }));
}

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

function fillProgression(progression, {
    chosenSound = soundToNumber.get("e"),
} = {}) {
    const chosenBeatNo = getRandomInt(0, progression.length - 1);
    const chosenBeat = progression[chosenBeatNo];
    const tonicAsNumber = (chosenSound - chosenBeat.step + sounds.length) %
        sounds.length;

    return progression.map((bar) => {
        const soundNumber = (tonicAsNumber + bar.step + sounds.length) %
            sounds.length;
        return getChord(soundNumber, bar.mode);
    });
}

function addVariation(progression) {
    switch (getRandomInt(1, 3)) {
        case 1:
            // console.log('shift');
            const times = getRandomInt(1, progression.length - 1);
            for (let i = 0; i < times; i += 1) {
                progression.unshift(progression.pop());
            }
            break;

        case 2:
            // console.log('shuffle');
            progression = shuffleArray(progression);
            break;
    }

    return progression;
}

export function generateChordProgression() {
    const rawProgression = getRandomElement(progressions);
    const progression = parseProgression(rawProgression);
    const filledProgression = fillProgression(progression);
    const variation = addVariation(filledProgression);
    return variation;
}

// console.log(generateChordProgression());
