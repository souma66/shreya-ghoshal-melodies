import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimize() {
  const inputJpg = path.resolve(__dirname, '../src/assets/shreya-bg.jpg');
  const outputWebp = path.resolve(__dirname, '../src/assets/shreya-bg.webp');
  const outputPublicWebp = path.resolve(__dirname, '../public/shreya-bg.webp');

  console.log('Optimizing image to WebP format with near-lossless high quality (92%)...');
  
  await sharp(inputJpg)
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(outputWebp);

  await sharp(inputJpg)
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(outputPublicWebp);

  console.log('Image optimization complete!');
}

optimize().catch(console.error);
