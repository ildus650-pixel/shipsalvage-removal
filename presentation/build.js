const pptxgen = require('pptxgenjs');
const html2pptx = require('./scripts/html2pptx');

async function main() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Ship Salvage & Wreck Removal';
  pptx.title = 'Ship Salvage & Wreck Removal — Company Presentation';

  const slides = [
    'slides/01-title.html',
    'slides/02-about.html',
    'slides/03-services.html',
    'slides/04-geography.html',
    'slides/05-equipment.html',
    'slides/06-cases.html',
    'slides/07-why.html',
    'slides/08-clients.html',
    'slides/09-contacts.html',
    'slides/10-cta.html'
  ];

  const failures = [];
  for (const file of slides) {
    try {
      await html2pptx(file, pptx);
      console.log('ok:', file);
    } catch (err) {
      failures.push(`[${file}] ${err.message}`);
    }
  }

  if (failures.length) {
    throw new Error(`BUILD FAILED — ${failures.length}/${slides.length} slide(s) invalid:\n${failures.join('\n')}`);
  }

  await pptx.writeFile({ fileName: 'shipsalvage-presentation.pptx' });
  console.log(`Built ${slides.length} slide(s) -> shipsalvage-presentation.pptx`);
}

main()
  .catch(e => { console.error(e.message || e); process.exitCode = 1; })
  .finally(() => html2pptx.close());
