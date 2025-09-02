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
        const isValid = this.validateBarcode(code);
        
        if (isValid) {
            resultDisplay.innerHTML = `
                <h3>✅ SUCCESS - Valid Barcode!</h3>
                <p>Code: <strong>${code}</strong></p>
                <p>Status: <span style="color: #22c55e; font-weight: bold;">GENUINE</span></p>
                <p>Length: ${code.length} digits</p>
                <p>Validation: Passed all checks</p>
            `;
            resultDisplay.className = 'result-display show success';
        } else {
            resultDisplay.innerHTML = `
                <h3>❌ INVALID - Code Not Recognized</h3>
                <p>Code: <strong>${code}</strong></p>
                <p>Status: <span style="color: #ef4444; font-weight: bold;">INVALID</span></p>
                <p>Length: ${code.length} digits</p>
                <p>Validation: Failed - Not in database</p>
            `;
            resultDisplay.className = 'result-display show error';
        }
        resultDisplay.classList.add('show');
    }

    validateBarcode(code) {
        // Database of genuine/valid barcodes
        const validBarcodes = new Set([
            // Sample 5-digit codes that are considered genuine
            '12345', '67890', '11111', '22222', '33333', '44444', '55555',
            '66666', '77777', '88888', '99999', '00000', '13579', '24680',
            '98765', '54321', '11223', '33445', '55667', '77889', '99001',
            // Add more valid codes as needed
            '1234567890123', // EAN-13 example
            '123456789012',  // UPC-A example
            '12345678901',   // UPC-E example
            '1234567890'     // EAN-8 example
        ]);
        
        // Check if code exists in valid database
        if (validBarcodes.has(code)) {
            return true;
        }
        
        // Additional validation rules
        // Check for minimum length (at least 3 digits)
        if (code.length < 3) {
            return false;
        }
        
        // Check if it's all numeric (for most barcode types)
        if (!/^\d+$/.test(code)) {
            return false;
        }
        
        // For demonstration, consider codes starting with '1' as valid
        // You can modify this logic based on your specific requirements
        if (code.startsWith('1') && code.length >= 5) {
            return true;
        }
        
        // Default to invalid if not in database and doesn't meet criteria
        return false;
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
        // Use a mix of genuine and test codes for demonstration
        const genuineCodes = ['12345', '67890', '11111', '22222', '33333'];
        const testCodes = [];
        
        // Generate 5 additional test codes
        while (testCodes.length < 5) {
            const code = Math.floor(10000 + Math.random() * 90000).toString();
            if (!genuineCodes.includes(code) && !testCodes.includes(code)) {
                testCodes.push(code);
            }
        }
        
        return [...genuineCodes, ...testCodes];
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
