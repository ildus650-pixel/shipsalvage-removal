// Rasterize brand icons to PNG for the presentation slides
const { launch } = require('./scripts/cdp-browser');
const { findChromium } = require('./scripts/chromium-finder');
const { iconPng } = require('./scripts/rasterize');

const AZURE = '2fb7ff';
const ICONS = ['anchor', 'scissors', 'droplet', 'recycle', 'phone', 'envelope',
  'paperplane', 'bolt', 'award', 'shield', 'anchorcirclecheck', 'locationdot', 'clock',
  'skullcrossbones', 'fish', 'trash', 'leaf'];

const FONT_AWESOME = {
  anchor: 'FaAnchor',
  scissors: 'FaScissors',
  droplet: 'FaDroplet',
  recycle: 'FaRecycle',
  phone: 'FaPhone',
  envelope: 'FaEnvelope',
  paperplane: 'FaPaperPlane',
  bolt: 'FaBolt',
  award: 'FaAward',
  shield: 'FaShieldHalved',
  anchorcirclecheck: 'FaAnchorCircleCheck',
  locationdot: 'FaLocationDot',
  clock: 'FaClock',
  skullcrossbones: 'FaSkullCrossbones',
  fish: 'FaFish',
  trash: 'FaTrash',
  leaf: 'FaLeaf'
};

async function main() {
  const found = findChromium();
  if (!found.executablePath) throw new Error('Chromium not found');
  const browser = await launch({ executablePath: found.executablePath });
  try {
    for (const name of ICONS) {
      await iconPng(browser, FONT_AWESOME[name], AZURE, 256, `assets/icons/${name}.png`);
      console.log('icon:', name);
    }
  } finally {
    await browser.close();
  }
}

main().catch(e => { console.error(e.message); process.exitCode = 1; });
