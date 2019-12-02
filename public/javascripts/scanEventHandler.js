// Initialize with options
onScan.attachTo(document, {
  suffixKeyCodes: [13], // enter-key expected at the end of a scan
  prefixKeyCodes: [16],
  reactToPaste: false, // Compatibility to built-in scanners in paste-mode (as opposed to keyboard-mode)
  minLength: 2,
  onScan: function(sCode, iQty) { // Alternative to document.addEventListener('scan')
    console.log('Scanned: ' + iQty + 'x ' + sCode);
    const res = sCode.split(' ')
    if (res[0] === 'CUSTOMER') {
      window.location.pathname = '/customers/' + res[1] + '/record'
    }
  },
  onKeyDetect: function(iKeyCode) { // output all potentially relevant key events - great for debugging!
    console.log('Pressed: ' + iKeyCode);
  }
});

// Simulate a scan programmatically - e.g. to test event handlers
// onScan.simulate(document, '1234567890123');
