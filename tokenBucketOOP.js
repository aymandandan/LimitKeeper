class TokenBucket {
  constructor(bucketSize, refillRate, refillInterval) {
    this.bucketSize = bucketSize;
    this.tokens = bucketSize;
    this.refillRate = refillRate;
    this.refillInterval = refillInterval;
    this.lastRefillTime = Date.now();
  }

  refill() {
    const now = Date.now();

    var timePassed = now - this.lastRefillTime; // milliseconds

    const intervalsPassed = Math.floor(timePassed / this.refillInterval);

    const tokensToAdd = intervalsPassed * this.refillRate;

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.bucketSize, this.tokens + tokensToAdd);
      console.log(`Tokens Now: ${this.tokens}`);

      this.lastRefillTime += intervalsPassed * this.refillInterval;
    }
  }

  consumeToken() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    } else return false;
  }
}

let tokenBucketMap = new Map();

function consumeIP(ip) {
  if (!tokenBucketMap.get(ip)) tokenBucketMap.set(ip, new TokenBucket(10, 1));
  if (!tokenBucketMap.get(ip).consumeToken())
    throw {
      timeRemaining: `${
        (tokenBucketMap.get(ip).refillInterval -
          (Date.now() - tokenBucketMap.get(ip).lastRefillTime)) /
        1000
      }s`,
      message: "Too many requests, please try again later!",
    };
}

module.exports = consumeIP;
