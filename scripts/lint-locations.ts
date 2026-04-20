import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const imageDir = path.join(process.cwd(), 'public');

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let hasError = false;
let warnings = 0;

console.log(`Linting ${files.length} location files...`);

for (const file of files) {
  const filePath = path.join(dataDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    // Schema validation
    if (!data.title) { console.error(`[ERROR] ${file}: Missing 'title'`); hasError = true; }
    if (!data.lines || !Array.isArray(data.lines)) { console.error(`[ERROR] ${file}: Missing or invalid 'lines' array`); hasError = true; }
    if (!data.options || !Array.isArray(data.options)) { console.error(`[ERROR] ${file}: Missing or invalid 'options' array`); hasError = true; }
    
    if (data.type === 'PICKEDUP' && !data.objectName) {
      console.error(`[ERROR] ${file}: Type is PICKEDUP but missing 'objectName'`);
      hasError = true;
    }
    
    if (data.image) {
      const imagePath = path.join(imageDir, data.image);
      if (!fs.existsSync(imagePath)) {
        console.warn(`[WARN] ${file}: Image not found: ${data.image} (Ignored due to API limits)`);
        warnings++;
      }
    }
    
    if (Array.isArray(data.options)) {
      data.options.forEach((opt: any, index: number) => {
        if (!opt.id) { console.error(`[ERROR] ${file}: Option ${index} missing 'id'`); hasError = true; }
        if (!opt.desc) { console.error(`[ERROR] ${file}: Option ${index} missing 'desc'`); hasError = true; }
        if (!opt.link) { 
          console.error(`[ERROR] ${file}: Option ${index} missing 'link'`); hasError = true; 
        } else {
          const targetPath = path.join(dataDir, opt.link);
          if (!fs.existsSync(targetPath)) {
            console.error(`[ERROR] ${file}: Option ${index} links to non-existent file: ${opt.link}`);
            hasError = true;
          }
          
          if (opt.link === file && data.type !== 'PICKEDUP' && !data.sanityChange && !opt.with && !opt.without) {
            // Warn if it links to itself and doesn't seem to be an inventory/sanity check trick
            console.warn(`[WARN] ${file}: Option '${opt.id}' links to itself without an obvious state change.`);
            warnings++;
          }
        }
      });
    }
  } catch (e: any) {
    console.error(`[ERROR] ${file}: Failed to parse JSON or unexpected error: ${e.message}`);
    hasError = true;
  }
}

if (hasError) {
  console.error('\nLinting failed with errors.');
  process.exit(1);
} else {
  console.log(`\nLinting passed! (${warnings} warnings)`);
}
