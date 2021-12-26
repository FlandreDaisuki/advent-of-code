#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const range = (start, end) => Array.from({ length: end - start }, (_, i) => start + i);

const [enhancementInput, imageInput] = getProblemText().split('\n\n');

const enhancementTable = enhancementInput.split('').map((cell) => '.#'.indexOf(cell));

const toImage = (input) => input.split('\n')
  .filter(Boolean)
  .map((row) => row.split('').map((cell) => '.#'.indexOf(cell)));

const toCoordKey = (r, c) => `${r},${c}`;
const toSparseImage = (image) => {
  const sparseImage = {
    pixels: {},
    R: image.length,
    C: image[0].length,
    t: 0,
  };
  image.forEach((row, r) => row.forEach((cell, c) => {
    if (cell) {
      sparseImage.pixels[toCoordKey(r, c)] = 1;
    }
  }));
  return sparseImage;
};

const get9Keys = (r, c) => range(-1, 2).flatMap((dr) => {
  return range(-1, 2).map((dc) => toCoordKey(r + dr, c + dc));
});

const enhance = (sparseImage, padding = 100) => {
  const left = 0 - padding;
  const right = sparseImage.C + padding;
  const top = 0 - padding;
  const bottom = sparseImage.R + padding;
  const newSparseImage = {
    ...sparseImage,
    pixels: {},
    t: sparseImage.t + 1,
  };
  for (const r of range(top, bottom + 1)) {
    for (const c of range(left, right + 1)) {
      const keys = get9Keys(r, c);
      const bitString = keys.map((key) => sparseImage.pixels?.[key] ?? 0).join('');
      const newPixel = enhancementTable[parseInt(bitString, 2)];
      if (newPixel) {
        newSparseImage.pixels[toCoordKey(r, c)] = 1;
      }
    }
  }
  return newSparseImage;
};

// const printSparseImage = (sparseImage) => {
//   const left = sparseImage.minC - 1;
//   const right = sparseImage.maxC + 1;
//   const top = sparseImage.minR - 1;
//   const bottom = sparseImage.maxR + 1;
//   for (const r of range(top, bottom + 1)) {
//     console.log(range(left, right + 1).map((c) => {
//       return sparseImage.pixels[toCoordKey(r, c)] ? '#' : '.';
//     }).join(''));
//   }
// };

const enhanceTimes = (sparseImage, times) => {
  if (sparseImage.t === times) {
    return sparseImage;
  }
  return enhanceTimes(enhance(sparseImage, times * 2), times);
};

const countLit = (sparseImage) => {
  const { t, R, C } = sparseImage;
  let count = 0;
  range(-t, R + t + 1).forEach((r) => {
    range(-t, C + t + 1).forEach((c) => {
      if (sparseImage.pixels[toCoordKey(r, c)]) {
        count++;
      }
    });
  });
  return count;
};

const sparseImage1 = toSparseImage(toImage(imageInput));
const answer1 = countLit(enhanceTimes(sparseImage1, 2));
console.log('answer1', answer1);

const sparseImage2 = toSparseImage(toImage(imageInput));
const answer2 = countLit(enhanceTimes(sparseImage2, 50));
console.log('answer2', answer2);
