interface Array<T> {
  last(): T;
}

Array.prototype.last = function () {
  if (this) {
    if (this.length > 0) {
      return this[this.length - 1];
    } else {
      return null;
    }
  }
};
