# 🔍 Barcode Reader & Generator

A modern web application that can read barcodes using your device's camera and generate sample 5-digit barcodes.

## Features

- **📷 Barcode Scanner**: Real-time barcode scanning using your device's camera
- **📊 Sample Barcodes**: 10 pre-generated 5-digit barcodes in Code128 format
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Beautiful gradient design with smooth animations

## How to Use

### 1. Open the Website
Simply open `index.html` in your web browser. For best results, use a modern browser like Chrome, Firefox, or Safari.

### 2. Scan Barcodes
1. Click the "Start Scanner" button
2. Allow camera permissions when prompted
3. Point your camera at a barcode
4. The app will automatically detect and display the barcode value
5. Click "Stop Scanner" to stop the camera

### 3. View Sample Barcodes
The page displays 10 sample 5-digit barcodes that you can use for testing. Each barcode is generated in Code128 format.

## Supported Barcode Formats

The scanner supports multiple barcode formats:
- Code 128
- EAN-13
- EAN-8
- Code 39
- Code 39 VIN
- Codabar
- UPC-A
- UPC-E
- Interleaved 2 of 5

## Technical Details

### Libraries Used
- **QuaggaJS**: For barcode scanning functionality
- **JsBarcode**: For barcode generation
- **Vanilla JavaScript**: For application logic

### Browser Requirements
- Modern browser with camera support
- HTTPS connection (required for camera access in most browsers)
- JavaScript enabled

## File Structure

```
barcode-reader/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Troubleshooting

### Camera Not Working
- Make sure you're using HTTPS (required for camera access)
- Check that camera permissions are granted
- Try refreshing the page and allowing permissions again

### Barcode Not Detecting
- Ensure good lighting conditions
- Hold the barcode steady and at an appropriate distance
- Make sure the barcode is clearly visible and not damaged

### Mobile Issues
- Use a modern mobile browser
- Ensure the website is served over HTTPS
- Try rotating your device for better camera positioning

## Development

To modify or extend this application:

1. **Add new barcode formats**: Modify the `readers` array in the Quagga configuration
2. **Change barcode generation**: Update the `generateSampleCodes()` function
3. **Customize styling**: Edit `styles.css` for different visual themes
4. **Add features**: Extend the `BarcodeApp` class in `script.js`

## License

This project is open source and available under the MIT License.
