const sickLetters = 'xXzZpPIO3801rws-';
const sickSeparators = '/\\: |';
const sickBorders = '◀-~●▲△><=[]\{\}|';
const sickWords = [
  'match', 'meta', 'http', 'code', 'base64', 'unknown', 'hostname', 'host', 'fd', 'ip', 'pid', 'fs', 'frame',
  'interface', 'switch', 'length', 'rx', 'tx', 'transaction', 'space', 'smtp', 'pop', 'shift', 'port', 'sql',
  'generator', 'case', 'program', 'binary', 'hash', 'bash', 'left', 'vector', 'directory', 'connection',
  'filename', 'module', 'config', 'status', 'reset', 'log', 'clone', 'init', 'datadir', 'privileged',
  'proxy', 'cipher', 'address', 'mode', 'scan', 'delay', 'spoof', 'evasion', 'script', 'service',
  'detected', 'target', 'options', 'spec', 'push', 'lf', 'alpha', 'beta'
];

const modifiers = [
  (s) => s.toUpperCase(),
  (s) => s.toLowerCase(),
  (s) => s.charAt(0).toUpperCase() + s.slice(1),
  (s) => s,
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// array is allowed to be mutated
const arraySampleN = (array, n) => {
  shuffleArray(array);
  return array.slice(0, n);
}

const sample = (iterable) => iterable[~~(Math.random() * iterable.length)]

export const randomSentence = (length) => {
  const arraySample = arraySampleN(sickWords, length);
  return arraySample.map(sample(modifiers)).join(sample(sickSeparators));
}