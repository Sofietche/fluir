const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
const files = [
  {
    name: 'icon.png',
    description: 'Primary blue placeholder icon',
    base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGPwyfv6HwAFaAKvkwGMqQAAAABJRU5ErkJggg=='
  },
  {
    name: 'splash.png',
    description: 'Soft lavender placeholder splash background',
    base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGN49/H/fwAJjQPekMo/MQAAAABJRU5ErkJggg=='
  }
];

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

files.forEach(({ name, base64, description }) => {
  const targetPath = path.join(assetsDir, name);

  if (fs.existsSync(targetPath)) {
    console.log(`Skipping ${name}: already exists.`);
    return;
  }

  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(targetPath, buffer);
  console.log(`Created ${name} (${description}).`);
});
