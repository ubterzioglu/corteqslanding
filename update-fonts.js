const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

// We will overwrite the specific rules.
// First, let's remove the font-family from banner-overlay h2
css = css.replace('font-family: "Arial Narrow", "Trebuchet MS", sans-serif;', '');
css = css.replace('font-family: "Arial Narrow", "Trebuchet MS", sans-serif;', '');

// Now we need to set the sizes
// Update .banner-overlay h2
css = css.replace(/font-size: clamp\(2rem, 5vw, 3.5rem\);/g, 'font-size: clamp(2rem, 4.5vw, 3rem);');

// Update .banner-copy h3
css = css.replace(/font-size: clamp\(1.8rem, 4vw, 2.5rem\);/g, 'font-size: clamp(2rem, 4.5vw, 3rem);');

// Update .banner-overlay p
css = css.replace(/font-size: 1.1rem;/g, 'font-size: 1.15rem;');

// Update .banner-copy p
css = css.replace(/font-size: 1.05rem !important;/g, 'font-size: 1.15rem !important;');

fs.writeFileSync('app/globals.css', css, 'utf8');
console.log('CSS updated');