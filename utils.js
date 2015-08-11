
function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike, 0);
}

module.exports = {
  toArray: toArray
};
