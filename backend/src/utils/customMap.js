class CustomMap {
  constructor(maxSize, ttl) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key, value) {
    if (this.maxSize && this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      value,
      expiry: this.ttl ? Date.now() + this.ttl : null,
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return undefined;
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    return item.value;
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  clear() {
    this.cache.clear();
  }

  get size() {
    for (const [key, item] of this.cache) {
      if (item.expiry && Date.now() > item.expiry) {
        this.cache.delete(key);
      }
    }
    return this.cache.size;
  }
}

module.exports = CustomMap;
