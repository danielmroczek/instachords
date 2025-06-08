// Global state
let currentProgression = [];
let progressionHistory = [];
let selectedInstrument = 'piano';
let isGenerating = false;

// Import the chord generation function and instrument list from generator.js
import { generateChordProgression, INSTRUMENT } from './generator.js';

// Generate chord progression using the imported function from generator.js
function generateInstrumentChordProgression(instrument) {
    // Generate a progression using the algorithm from generator.js
    const progressionObjs = generateChordProgression(instrument);
    // Map to array of chord strings for display
    return progressionObjs;
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
        chordText.textContent = chord.chord;
        
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
            chordTag.textContent = chord.chord;
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

// Dynamically create instrument buttons
function renderInstrumentSelector() {
    const selector = document.getElementById('instrument-selector');
    selector.innerHTML = '';
    Object.entries(INSTRUMENT).forEach(([key, value]) => {
        const btn = document.createElement('button');
        btn.id = `${key}-btn`;
        btn.className = 'instrument-btn' + (selectedInstrument === key ? ' active-instrument' : '');
        btn.innerHTML = `<i data-lucide="${value.icon}"></i>${key.charAt(0).toUpperCase() + key.slice(1)}`;
        if (selectedInstrument === key) {
            btn.style.backgroundColor = value.color;
            btn.style.color = '#fff';
        }
        btn.addEventListener('click', function() {
            selectedInstrument = key;
            updateInstrumentSelector();
            if (currentProgression.length > 0) {
                generateNewProgression();
            }
        });
        selector.appendChild(btn);
    });
    lucide.createIcons();
}

// Update instrument selector styles
function updateInstrumentSelector() {
    Object.entries(INSTRUMENT).forEach(([key, value]) => {
        const btn = document.getElementById(`${key}-btn`);
        if (!btn) return;
        if (selectedInstrument === key) {
            btn.classList.add('active-instrument');
            btn.style.backgroundColor = value.color;
            btn.style.color = '#fff';
        } else {
            btn.classList.remove('active-instrument');
            btn.style.backgroundColor = 'rgba(6, 182, 212, 0.2)';
            btn.style.color = '#06b6d4';
        }
    });
}

// Generate new progression
function generateNewProgression() {
    if (isGenerating) return;
    
    isGenerating = true;
    const generateBtn = document.getElementById('generate-btn');
    
    // Add current progression to history if it exists
    if (currentProgression.length > 0) {
        // Use the instrument for which the progression was generated
        const instrument = currentProgression.instrument || selectedInstrument;
        progressionHistory.unshift({ chords: currentProgression, instrument });
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
        // Attach instrument info to the progression object
        newProgression.instrument = selectedInstrument;
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
    renderInstrumentSelector();
    // Generate button
    document.getElementById('generate-btn').addEventListener('click', generateNewProgression);
    // Generate initial progression
    generateNewProgression();
});
