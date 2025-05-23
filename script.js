//
const quoteText = document.getElementById('quote-text');
const authorText = document.getElementById('author');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const themeToggle = document.getElementById('theme-toggle');
const loadingSpinner = document.getElementById('loading-spinner');

// Variables
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let isGenerating = false;
const apiEndpoints = [
    'https://quotes-api-self.vercel.app/quote',
    'https://api.quotable.io/random',
    'https://type.fit/api/quotes',
    'https://api.quotable.io/random',
    'https://api.quotable.io/random'
];

// Initialize
function init() {
    // Set initial theme
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Add event listeners
    generateBtn.addEventListener('click', generateQuote);
    downloadBtn.addEventListener('click', downloadQuoteAsImage);
    shareBtn.addEventListener('click', shareQuote);
    themeToggle.addEventListener('click', toggleTheme);
}

// Generate Quote
function generateQuote() {
    // Show the loader
    loadingSpinner.style.display = 'flex';

    let apiIndex = 0;

    function fetchQuote() {
        if (apiIndex >= apiEndpoints.length) {
            fetchLocalQuotes();
            return;
        }

        fetch(apiEndpoints[apiIndex])
            .then(response => response.json())
            .then(data => {
                // Hide the loader
                loadingSpinner.style.display = 'none';
                if (apiEndpoints[apiIndex] === 'https://type.fit/api/quotes') {
                    const randomQuote = data[Math.floor(Math.random() * data.length)];
                    quoteText.textContent = randomQuote.text;
                    authorText.textContent = '- ' + (randomQuote.author || 'Unknown');
                } else {
                    quoteText.textContent = data.content || data.quote;
                    authorText.textContent = '- ' + (data.author || 'Unknown');
                }
            })
            .catch(error => {
                console.log(`API ${apiIndex + 1} failed:`, error);
                apiIndex++;
                fetchQuote();
            });
    }

    fetchQuote();
}

// Fetch local quotes if all APIs fail
function fetchLocalQuotes() {
    fetch('quotes.json')
        .then(response => response.json())
        .then(data => {
            const randomQuote = data[Math.floor(Math.random() * data.length)];
            quoteText.textContent = randomQuote.quote;
            authorText.textContent = '- ' + randomQuote.author;
        })
        .catch(error => {
            console.log('Failed to fetch local quotes:', error);
            quoteText.textContent = 'Failed to fetch a quote.';
            authorText.textContent = '';
        });
}

// Function to download quote as image
function downloadQuoteAsImage() {
    const quote = quoteText.textContent;
    const author = authorText.textContent;
    const imageWidth = 1920; // Landscape 16:9
    const imageHeight = 1080;
    const padding = 100;

    const canvas = document.createElement('canvas');
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    const ctx = canvas.getContext('2d');

    // Choose a random background image
    const backgroundImages = [
        'images/bg1.jpg',
        'images/bg2.jpeg',
        'images/bg3.jpg',
        'images/bg4.jpg',
        'images/bg5.jpg',
        'images/bg6.jpg',
        'images/bg7.jpg'
    ];
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

    const img = new Image();
    img.crossOrigin = "anonymous"; // Required for cross-origin images
    img.onload = () => {
        ctx.drawImage(img, 0, 0, imageWidth, imageHeight);

        // Text styling
        ctx.font = '700 60px Poppins';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Word wrapping function
        function wrapText(context, text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = context.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > maxWidth && n > 0) {
                    context.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            context.fillText(line, x, y);
        }

        // Quote positioning
        const quoteX = imageWidth / 2;
        const quoteY = imageHeight / 2 - 50;
        const maxWidth = imageWidth - 2 * padding;
        const lineHeight = 70;

        wrapText(ctx, quote, quoteX, quoteY, maxWidth, lineHeight);

        // Author styling and positioning
        ctx.font = 'italic 40px Poppins';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'right';
        const authorX = imageWidth - padding;
        const authorY = quoteY + lineHeight * (quote.split(' ').length / 7) + 100; // Adjust as needed
        ctx.fillText(author, authorX, authorY);

        // Download the image
        const link = document.createElement('a');
        link.download = 'quote.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
    img.src = randomImage;
}

// Share quote
function shareQuote() {
    const quote = quoteText.textContent;
    const author = authorText.textContent;
    const shareData = {
        title: 'AI Daily Quote Generator',
        text: `${quote} ${author}`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(error => console.log('Error sharing:', error));
    } else {
        alert('Web Share API is not supported in your browser.');
    }
}

// Toggle Theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
