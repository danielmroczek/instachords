// Global state
let currentProgression = [];
let progressionHistory = [];
let selectedInstrument = 'piano';
let isGenerating = false;

// Import the chord generation function from generator.js
import { generateChordProgression } from './generator.js';

// Generate chord progression using the imported function
function generateInstrumentChordProgression(instrument) {
    // Generate a progression using the algorithm from generator.js
    const progression = generateChordProgression();
    
    // We'll keep the instrument distinction but use the advanced algorithm
    // for all instruments. The original instrument selection is still preserved
    // in the UI and history.
    return progression;
}

// Render chord progression
function renderChordProgression(chords) {
    const chordGrid = document.getElementById('chord-grid');
    chordGrid.innerHTML = '';
    
    chords.forEach((chord, index) => {
        const chordCard = document.createElement('div');
        chordCard.className = 'chord-card fade-in';
        chordCard.style.animationDelay = `${index * 0.1}s`;
        
        const chordText = document.createElement('div');
        chordText.className = 'chord-text';
        chordText.textContent = chord;
        
        chordCard.appendChild(chordText);
        chordGrid.appendChild(chordCard);
    });
    
    document.getElementById('current-progression').style.display = 'block';
}

// Render history
function renderHistory() {
    const historyContainer = document.getElementById('history-container');
    const historySection = document.getElementById('chord-history');
    
    if (progressionHistory.length === 0) {
        historySection.style.display = 'none';
        return;
    }
    
    historySection.style.display = 'block';
    historyContainer.innerHTML = '';
    
    progressionHistory.forEach((progression, index) => {
        const historyItem = document.createElement('article');
        historyItem.className = 'history-item';
        
        const chordsContainer = document.createElement('div');
        chordsContainer.className = 'chords-container';
        
        progression.chords.forEach(chord => {
            const chordTag = document.createElement('span');
            chordTag.className = 'chord-tag';
            chordTag.textContent = chord;
            chordsContainer.appendChild(chordTag);
        });
        
        const instrumentIcon = document.createElement('div');
        instrumentIcon.className = 'instrument-icon';
        
        const iconElement = document.createElement('i');
        
        if (progression.instrument === 'piano') {
            iconElement.setAttribute('data-lucide', 'piano');
            iconElement.style.color = '#8b5cf6';
        } else if (progression.instrument === 'guitar') {
            iconElement.setAttribute('data-lucide', 'guitar');
            iconElement.style.color = '#06b6d4';
        } else if (progression.instrument === 'ukulele') {
            iconElement.setAttribute('data-lucide', 'music');
            iconElement.style.color = '#f97316';
        }
        
        instrumentIcon.appendChild(iconElement);
        historyItem.appendChild(chordsContainer);
        historyItem.appendChild(instrumentIcon);
        historyContainer.appendChild(historyItem);
    });
    
    // Initialize the newly added icons
    lucide.createIcons();
}

// Update instrument selector styles
function updateInstrumentSelector() {
    const pianoBtn = document.getElementById('piano-btn');
    const guitarBtn = document.getElementById('guitar-btn');
    const ukuleleBtn = document.getElementById('ukulele-btn');
    
    // Remove active class from all
    pianoBtn.classList.remove('active-instrument');
    guitarBtn.classList.remove('active-instrument');
    ukuleleBtn.classList.remove('active-instrument');
    
    // Add active class to selected
    if (selectedInstrument === 'piano') {
        pianoBtn.classList.add('active-instrument');
    } else if (selectedInstrument === 'guitar') {
        guitarBtn.classList.add('active-instrument');
    } else if (selectedInstrument === 'ukulele') {
        ukuleleBtn.classList.add('active-instrument');
    }
}

// Generate new progression
function generateNewProgression() {
    if (isGenerating) return;
    
    isGenerating = true;
    const generateBtn = document.getElementById('generate-btn');
    
    // Add current progression to history if it exists
    if (currentProgression.length > 0) {
        progressionHistory.unshift({ chords: currentProgression, instrument: selectedInstrument });
        // Keep only last 5 progressions
        progressionHistory = progressionHistory.slice(0, 5);
    }
    
    // Update button to show loading state
    generateBtn.innerHTML = `
        <div class="loading-button-content">
            <div class="loading-spinner"></div>
            Generating...
        </div>
    `;
    generateBtn.style.transform = 'scale(0.95)';
    
    // Simulate generation delay
    setTimeout(() => {
        const newProgression = generateInstrumentChordProgression(selectedInstrument);
        currentProgression = newProgression;
        
        renderChordProgression(currentProgression);
        renderHistory();
        
        // Reset button
        generateBtn.innerHTML = 'Generate New Progression';
        generateBtn.style.transform = 'scale(1)';
        isGenerating = false;
    }, 300);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Instrument selector buttons
    document.getElementById('piano-btn').addEventListener('click', function() {
        selectedInstrument = 'piano';
        updateInstrumentSelector();
        if (currentProgression.length > 0) {
            generateNewProgression();
        }
    });
    
    document.getElementById('guitar-btn').addEventListener('click', function() {
        selectedInstrument = 'guitar';
        updateInstrumentSelector();
        if (currentProgression.length > 0) {
            generateNewProgression();
        }
    });
    
    document.getElementById('ukulele-btn').addEventListener('click', function() {
        selectedInstrument = 'ukulele';
        updateInstrumentSelector();
        if (currentProgression.length > 0) {
            generateNewProgression();
        }
    });
    
    // Generate button
    document.getElementById('generate-btn').addEventListener('click', generateNewProgression);
    
    // Generate initial progression
    generateNewProgression();
});
