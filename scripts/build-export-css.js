const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindPostcss = require('@tailwindcss/postcss');
const { transform } = require('lightningcss');

async function buildExportCss() {
  const inputPath = path.resolve(__dirname, '..', 'app', 'globals.css');
  const outputPath = path.resolve(__dirname, '..', 'public', 'export.css');

  const sourceCss = fs.readFileSync(inputPath, 'utf8');
  const processed = await postcss([tailwindPostcss]).process(sourceCss, {
    from: inputPath,
  });

  const minified = transform({
    filename: 'export.css',
    code: Buffer.from(processed.css),
    minify: true,
  }).code.toString();

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, minified, 'utf8');
  console.log(`Export CSS generated at ${outputPath}`);
}

buildExportCss().catch((error) => {
  console.error('Failed to build export CSS:', error);
  process.exit(1);
});
