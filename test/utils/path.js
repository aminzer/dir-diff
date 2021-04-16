function getInvertedChar(char) {
  switch (char) {
    case '/':
      return '\\';

    case '\\':
      return '/';

    default:
      return char;
  }
}

function invertPathSeparators(path) {
  return Array.from(path)
    .map(getInvertedChar)
    .join('');
}

module.exports = {
  invertPathSeparators,
};
