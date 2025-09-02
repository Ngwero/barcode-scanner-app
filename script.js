// Barcode Reader and Generator Application
class BarcodeApp {
    constructor() {
        this.isScanning = false;
        this.scanner = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateSampleBarcodes();
    }

    setupEventListeners() {
        const startBtn = document.getElementById('startScanner');
        const stopBtn = document.getElementById('stopScanner');

        startBtn.addEventListener('click', () => this.startScanner());
        stopBtn.addEventListener('click', () => this.stopScanner());
    }

    startScanner() {
        if (this.isScanning) return;

        const startBtn = document.getElementById('startScanner');
        const stopBtn = document.getElementById('stopScanner');
        const resultDisplay = document.getElementById('scanResult');

        // Reset result display
        resultDisplay.classList.remove('show');
        resultDisplay.innerHTML = '';

        // Configure Quagga
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#scanner'),
                constraints: {
                    width: 500,
                    height: 300,
                    facingMode: "environment" // Use back camera
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 2,
            frequency: 10,
            decoder: {
                readers: [
                    "code_128_reader",
                    "ean_reader",
                    "ean_8_reader",
                    "code_39_reader",
                    "code_39_vin_reader",
                    "codabar_reader",
                    "upc_reader",
                    "upc_e_reader",
                    "i2of5_reader"
                ]
            },
            locate: true
        }, (err) => {
            if (err) {
                console.error('Error initializing scanner:', err);
                this.showError('Failed to initialize camera. Please check permissions.');
                return;
            }
            
            this.isScanning = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;
            
            Quagga.start();
        });

        // Handle successful barcode detection
        Quagga.onDetected((data) => {
            const code = data.codeResult.code;
            this.displayScanResult(code);
            this.stopScanner();
        });
    }

    stopScanner() {
        if (!this.isScanning) return;

        Quagga.stop();
        this.isScanning = false;

        const startBtn = document.getElementById('startScanner');
        const stopBtn = document.getElementById('stopScanner');

        startBtn.disabled = false;
        stopBtn.disabled = true;
    }

    displayScanResult(code) {
        const resultDisplay = document.getElementById('scanResult');
        resultDisplay.innerHTML = `
            <h3>✅ Barcode Detected!</h3>
            <p>Code: <strong>${code}</strong></p>
            <p>Length: ${code.length} digits</p>
        `;
        resultDisplay.classList.add('show');
    }

    showError(message) {
        const resultDisplay = document.getElementById('scanResult');
        resultDisplay.innerHTML = `
            <h3>❌ Error</h3>
            <p>${message}</p>
        `;
        resultDisplay.classList.add('show');
    }

    generateSampleBarcodes() {
        const grid = document.getElementById('barcodesGrid');
        const sampleCodes = this.generateSampleCodes();

        sampleCodes.forEach((code, index) => {
            const barcodeItem = this.createBarcodeItem(code, index + 1);
            grid.appendChild(barcodeItem);
        });
    }

    generateSampleCodes() {
        // Generate 10 unique 5-digit codes
        const codes = new Set();
        
        while (codes.size < 10) {
            const code = Math.floor(10000 + Math.random() * 90000).toString();
            codes.add(code);
        }
        
        return Array.from(codes);
    }

    createBarcodeItem(code, index) {
        const item = document.createElement('div');
        item.className = 'barcode-item';
        
        // Create SVG element for barcode
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', `barcode-${index}`);
        
        item.innerHTML = `
            <h4>Sample Barcode #${index}</h4>
            <div id="barcode-${index}"></div>
            <div class="barcode-number">${code}</div>
        `;
        
        // Generate barcode using JsBarcode
        setTimeout(() => {
            try {
                JsBarcode(`#barcode-${index}`, code, {
                    format: "CODE128",
                    width: 2,
                    height: 80,
                    displayValue: false,
                    background: "#ffffff",
                    lineColor: "#000000",
                    margin: 10
                });
            } catch (error) {
                console.error('Error generating barcode:', error);
                // Fallback: show the code as text
                const barcodeDiv = item.querySelector(`#barcode-${index}`);
                barcodeDiv.innerHTML = `<div style="padding: 20px; background: #f0f0f0; border: 1px solid #ccc; font-family: monospace; font-size: 18px;">${code}</div>`;
            }
        }, 100);
        
        return item;
    }
}

// Utility functions
function generateRandomBarcode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BarcodeApp();
});

// Handle page visibility changes to stop scanner when tab is not active
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.barcodeApp && window.barcodeApp.isScanning) {
        window.barcodeApp.stopScanner();
    }
});

// Export for global access
window.BarcodeApp = BarcodeApp;
