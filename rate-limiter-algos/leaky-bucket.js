const userBuckets = new Map();

module.exports.consumeIP = async (IP, capacity, interval) => {
  if (!userBuckets.has(IP)) {
    const { default: LeakyBucket } = await import("leaky-bucket");
    const newBucket = new LeakyBucket({
      capacity,
      interval: interval * capacity,
    });
    userBuckets.set(IP, newBucket);
  }

  const bucket = userBuckets.get(IP);
  const cost = 1;

  try {
    await bucket.throttle(cost);
  } catch (err) {
    throw {
      message: "Too many requests, can't throttle!",
    };
  }
};
