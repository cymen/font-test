var FontFaceObserver = require('font-face-observer');

var baseFontPath = 'http://d1b2zzpxewkr9z.cloudfront.net/webfonts/';
var fonts = [
  {
    name: 'cloisterblack',
    file: 'cloisterblack-webfont.woff'
  },
  {
    name: 'russian',
    file: 'russian-webfont.woff'
  },
  {
    name: 'altehaasgrotesk',
    file: 'altehaasgrotesk-webfont.woff'
  },
  {
    name: 'goudybookletter',
    file: 'goudybookletter-webfont.woff'
  }
];


// populate font select list

var fontSelect = document.getElementById('font');

fonts.forEach(function(f) {
  var option = document.createElement('option');
  option.innerText = f.name;
  option.setAttribute('value', f.file);
  fontSelect.appendChild(option);
});


// have UI show document.fonts.status

var fontStatus = document.getElementById('status');

setInterval(function() {
  fontStatus.innerText = document.fonts.status;
}, 25);


// add font-face programatically

function addFontFace(fontFamily, url) {
  var style = document.createElement('style');
  // using local per bulletproof font face: http://www.paulirish.com/2009/bulletproof-font-face-implementation-syntax/
  style.innerText = '@font-face { font-family: "' + fontFamily + '"; src: local("☺︎"), url(' + url + ') format("woff"); }';
  document.head.appendChild(style);
}


// load font and update rendered text to use font after it has loaded

var renderedOutput = document.getElementById('rendered');

fontSelect.addEventListener('change', function() {
  var fontName = fontSelect.options[fontSelect.selectedIndex].text;
  var url = baseFontPath + fontSelect.value;

  addFontFace(fontName, url);

  new FontFaceObserver(fontName).check().then(
    function() {
      renderedOutput.style['font-family'] = fontName;
    },
    function() {
      alert('font failed to load:', fontName);
    }
  );
}, false);
