import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal pure-JS PNG generator
function createPNG(width, height, drawFn) {
  const bytesPerPixel = 4; // RGBA
  const rawData = Buffer.alloc(height * (1 + width * bytesPerPixel));
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * bytesPerPixel);
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const color = drawFn(x, y, width, height); // [r, g, b, a]
      rawData[pxOffset] = color[0];
      rawData[pxOffset + 1] = color[1];
      rawData[pxOffset + 2] = color[2];
      rawData[pxOffset + 3] = color[3];
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const combined = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(combined), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const BLACK = [18, 18, 18, 255]; // #121212
const WHITE = [255, 255, 255, 255]; // #ffffff
const TRANSPARENT = [0, 0, 0, 0];

function generateFlowerPng(color) {
  return createPNG(340, 340, (x, y, w, h) => {
    const nx = (x - 170) / 160;
    const ny = (y - 170) / 160;
    
    let widthLimit = 0.9;
    if (ny < -0.2) {
      const dy = (ny - (-0.2)) / 0.75;
      if (dy * dy <= 1) {
        widthLimit = Math.sqrt(Math.max(0, 1 - dy * dy)) * 0.92;
      } else {
        return TRANSPARENT;
      }
    } else if (ny > 0.3) {
      const dy = (ny - 0.3) / 0.65;
      if (dy * dy <= 1) {
        widthLimit = Math.sqrt(Math.max(0, 1 - dy * dy)) * 0.88;
      } else {
        return TRANSPARENT;
      }
    } else {
      const t = (ny + 0.2) / 0.5;
      widthLimit = 0.85 + 0.05 * Math.sin(t * Math.PI);
    }

    if (Math.abs(nx) <= widthLimit) {
      return color;
    }
    return TRANSPARENT;
  });
}

function generateFlowerLinePng(color) {
  return createPNG(80, 340, (x, y, w, h) => {
    const cx = 40;
    const r = 25;
    const topY = 40;
    const botY = 300;
    
    let inShape = false;
    if (y >= topY && y <= botY) {
      if (Math.abs(x - cx) <= r) inShape = true;
    } else if (y < topY) {
      const d = Math.hypot(x - cx, y - topY);
      if (d <= r) inShape = true;
    } else if (y > botY) {
      const d = Math.hypot(x - cx, y - botY);
      if (d <= r) inShape = true;
    }
    
    return inShape ? color : TRANSPARENT;
  });
}

function generateLeapLeftPng(color) {
  return createPNG(200, 180, (x, y, w, h) => {
    const cy = y - 90;
    const shiftedX = (x - 100) + cy * 0.45;
    
    const hw = 60;
    const hh = 55;
    const r = 18;
    
    const dx = Math.max(0, Math.abs(shiftedX) - (hw - r));
    const dy = Math.max(0, Math.abs(cy) - (hh - r));
    const dist = Math.hypot(dx, dy);
    
    return dist <= r ? color : TRANSPARENT;
  });
}

function generateLeapRightPng(color) {
  return createPNG(200, 180, (x, y, w, h) => {
    const cy = y - 90;
    const shiftedX = (x - 100) - cy * 0.45;
    
    const hw = 60;
    const hh = 55;
    const r = 18;
    
    const dx = Math.max(0, Math.abs(shiftedX) - (hw - r));
    const dy = Math.max(0, Math.abs(cy) - (hh - r));
    const dist = Math.hypot(dx, dy);
    
    return dist <= r ? color : TRANSPARENT;
  });
}

const flowerPng = generateFlowerPng(BLACK);
const flowerLinePng = generateFlowerLinePng(BLACK);
const leapLeftPng = generateLeapLeftPng(BLACK);
const leapRightPng = generateLeapRightPng(BLACK);

const flowerWhitePng = generateFlowerPng(WHITE);
const flowerLineWhitePng = generateFlowerLinePng(WHITE);
const leapLeftWhitePng = generateLeapLeftPng(WHITE);
const leapRightWhitePng = generateLeapRightPng(WHITE);

const dirs = [
  'public/assets/images/shapes',
  'assets/images/shapes',
  'public/assets-shape',
  'assets-shape'
];

dirs.forEach(d => {
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'flower.png'), flowerPng);
  fs.writeFileSync(path.join(d, 'flowerLine.png'), flowerLinePng);
  fs.writeFileSync(path.join(d, 'leapLeft.png'), leapLeftPng);
  fs.writeFileSync(path.join(d, 'leapRight.png'), leapRightPng);

  fs.writeFileSync(path.join(d, 'flowerWhite.png'), flowerWhitePng);
  fs.writeFileSync(path.join(d, 'flowerLineWhite.png'), flowerLineWhitePng);
  fs.writeFileSync(path.join(d, 'leapLeftWhite.png'), leapLeftWhitePng);
  fs.writeFileSync(path.join(d, 'leapRightWhite.png'), leapRightWhitePng);
});

console.log('Shapes PNG generated successfully!');
