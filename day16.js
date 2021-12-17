#!/usr/bin/env node

const getProblemText = () => {
  if (globalThis.document) {
    return document.body.textContent;
  }
  const filename = process.argv[1].replace(/.*(day\d+)[.]js/, '$1.txt');
  return require('fs').readFileSync(filename, 'utf8');
  // return require('fs').readFileSync(filename + '.in.1', 'utf8');
  // return require('fs').readFileSync(filename + '.in.2', 'utf8');
  // return require('fs').readFileSync(filename + '.in.4', 'utf8');
};

const splitAt = (str, n) => [String(str).slice(0, n), String(str).slice(n)];
const binToDec = (bin) => parseInt(bin, 2);
const decToBin = (dec) => String(dec.toString(2)).padStart(4, '0');
const hexToDec = (hex) => parseInt(hex, 16);
const range = (start, end) => Array.from({ length: end - start }, (_, i) => start + i);
const range0 = (end) => range(0, end);

const hexString = getProblemText().trim();
const bitStringFromHexString = hexString.match(/[0-9a-f]/ig)
  .map(hexToDec)
  .map(decToBin)
  .join('');


const toLiteralPacket = (version, groups) => {
  const rawValue = groups.map((group) => group.slice(1)).join('');
  const value = binToDec(rawValue);
  return {
    version,
    type: 4,
    groups,
    rawValue,
    value,
  };
};
const toOperatorPacket = (version, type, lengthType, length, subPackets) => {
  return {
    version,
    type,
    lengthType,
    length,
    subPackets,
  };
};

const pickPacket = (bitString) => {
  const parsedFailResult = [null, bitString];
  if (bitString.length < 6) {
    return parsedFailResult;
  }

  const [versionAndType, payloadAndRest] = splitAt(bitString, 6);
  const [rawVersion, rawType] = splitAt(versionAndType, 3);
  const version = binToDec(rawVersion);
  const type = binToDec(rawType);

  // literal type
  if (type === 4) {
    const groups = [];
    let [group, maybePayload] = splitAt(payloadAndRest, 5);
    while (group.startsWith('1')) {
      groups.push(group);
      [group, maybePayload] = splitAt(maybePayload, 5);
    }
    groups.push(group);
    return [toLiteralPacket(version, groups), maybePayload];
  }

  // operator type
  const [rawLengthType, payloadWithLengthAndRest] = splitAt(payloadAndRest, 1);
  if (rawLengthType === '0') {
    const [rawLength, payloadWithoutLengthAndRest] = splitAt(payloadWithLengthAndRest, 15);
    const length = binToDec(rawLength);
    if (Number.isNaN(length)) { return parsedFailResult; }

    const [rawPayload, rest] = splitAt(payloadWithoutLengthAndRest, length);
    const subPackets = [];
    let [subPacket, maybePacket] = pickPacket(rawPayload);
    while (maybePacket) {
      subPackets.push(subPacket);
      [subPacket, maybePacket] = pickPacket(maybePacket);
    }
    subPackets.push(subPacket);
    return [toOperatorPacket(version, type, 0, length, subPackets), rest];
  } else {
    const [rawLength, groupedPayloadAndRest] = splitAt(payloadWithLengthAndRest, 11);
    const length = binToDec(rawLength);
    if (Number.isNaN(length)) { return parsedFailResult; }

    const subPackets = [];
    let maybePacket = groupedPayloadAndRest;
    range0(length).forEach(() => {
      const [subPacket, rest] = pickPacket(maybePacket);
      subPackets.push(subPacket);
      maybePacket = rest;
    });
    return [toOperatorPacket(version, type, 1, length, subPackets), maybePacket];
  }
};

const traversePacketVersionSum = (packets) => {
  let versionSum = 0;
  for (const packet of packets) {
    if (packet.type === 4) {
      versionSum += packet.version;
    } else {
      versionSum += packet.version + traversePacketVersionSum(packet.subPackets);
    }
  }
  return versionSum;
};

const answer1 = ((initBitString) => {
  const packets = [];
  let rest = initBitString;
  while (rest.length > 0) {
    const [packet, newRest] = pickPacket(rest);
    if (packet) {
      packets.push(packet);
      rest = newRest;
    } else {
      break;
    }
  }
  return traversePacketVersionSum(packets);
})(bitStringFromHexString);
console.log('answer1', answer1);
