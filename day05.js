#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
};

const toPoint = (x, y) => ({ x, y, toString: () => `${x},${y}` });

const lineSegments = getProblemText().split('\n')
  .map((line) => {
    const matched = line.match(/(\d+),(\d+) -> (\d+),(\d+)/)?.slice(1);
    if (!matched) { return null; }
    return {
      s: toPoint(Number(matched[0]), Number(matched[1])),
      e: toPoint(Number(matched[2]), Number(matched[3])),
    };
  })
  .filter(Boolean);


const verticalOrHorizontalSegments = lineSegments.filter((segment) => {
  return segment.s.x === segment.e.x || segment.s.y === segment.e.y;
});

const drawSegment = (segment) => {
  const { s, e } = segment;
  const points = [];
  const dx = Math.sign(e.x - s.x);
  const dy = Math.sign(e.y - s.y);
  const xTermination = e.x + dx;
  const yTermination = e.y + dy;
  for (let x = s.x, y = s.y; x !== xTermination || y !== yTermination; x += dx, y += dy) {
    points.push(toPoint(x, y));
  }
  return points;
};

const generateHistogramOfPoints = (points) => {
  const histogram = {};
  points.forEach((point) => {
    const key = `${point}`;
    if (!histogram[key]) {
      histogram[key] = 0;
    }
    histogram[key] += 1;
  });
  return histogram;
};

const getIntersectionCount = (segments) => {
  const points = segments.flatMap(drawSegment);
  const pointHistogram = generateHistogramOfPoints(points);
  return Object.values(pointHistogram).filter((count) => count > 1).length;
};

const answer1 = getIntersectionCount(verticalOrHorizontalSegments);
console.log('answer1', answer1);

const answer2 = getIntersectionCount(lineSegments);
console.log('answer2', answer2);
