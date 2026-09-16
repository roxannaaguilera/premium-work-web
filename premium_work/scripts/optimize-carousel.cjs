// Generate responsive WebP assets without overwriting the original photographs.
// Run from this project: node scripts/optimize-carousel.cjs
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const sources = [
  ['serv-hoteles', 0.5, 0.5], ['serv-restaurants', 0.5, 0.5],
  ['serv-catering', 0.5, 0.5], ['serv-eventos-corporativos', 0.5, 0.2],
  ['serv-eventos-deportivos', 0.6, 0.5], ['serv-festivales', 0.55, 0.5],
  ['serv-bodas-celebraciones', 0.5, 0.5], ['serv-eventos-priv', 0.5, 0.5],
];
const layouts = {
  mobile: { ratio: 1.08, widths: [480, 768, 1152, 1536] },
  desktop: { ratio: 1.46, widths: [320, 480, 640, 960, 1344] },
};
(async () => {
  const output = path.join(root, 'public/images/carousel');
  await fs.mkdir(output, { recursive: true });
  const manifest = {};
  let originalBytes = 0;
  const totals = { mobile: 0, desktop: 0 };
  for (const [name, x, y] of sources) {
    const source = path.join(root, 'public/images', `${name}.webp`);
    originalBytes += (await fs.stat(source)).size;
    const { width, height } = await sharp(source).metadata();
    const entry = {};
    for (const [layout, { ratio, widths }] of Object.entries(layouts)) {
      // Match CSS object-fit: cover and the original object-position at each breakpoint.
      const cropWidth = Math.min(width, Math.round(height * ratio));
      const cropHeight = Math.min(height, Math.round(width / ratio));
      const crop = { left: Math.round((width - cropWidth) * x), top: Math.round((height - cropHeight) * y), width: cropWidth, height: cropHeight };
      const variants = [];
      for (const size of [...new Set(widths.map(w => Math.min(w, cropWidth)))]) {
        const filename = `${name}-${layout}-${size}.webp`;
        const result = await sharp(source).extract(crop).resize({ width: size, withoutEnlargement: true }).webp({ quality: 86, effort: 6, smartSubsample: true }).toFile(path.join(output, filename));
        variants.push({ src: `/images/carousel/${filename}`, width: result.width, height: result.height, bytes: result.size });
      }
      const fallback = variants.find(v => v.width >= (layout === 'mobile' ? 768 : 960)) || variants.at(-1);
      entry[layout] = { src: fallback.src, width: fallback.width, height: fallback.height, srcSet: variants.map(v => `${v.src} ${v.width}w`).join(', '), variants };
      totals[layout] += fallback.bytes;
    }
    manifest[`/images/${name}.webp`] = entry;
  }
  await fs.writeFile(path.join(root, 'lib/carousel-images.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({ originalBytes, mobile768Bytes: totals.mobile, desktop960Bytes: totals.desktop }, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
