const userBuckets = new Map();

const consumeIP = async (IP, capacity, interval) => {
    if (!userBuckets.has(IP)) {
        const { default: LeakyBucket } = await import('leaky-bucket');
        const newBucket = new LeakyBucket({ capacity, interval });
        userBuckets.set(IP, newBucket);
    }

    const bucket = userBuckets.get(IP);
    const cost = 1;

    try {
        await bucket.throttle(cost);
    } catch (err) {
        throw new Error("Too many requests!");
    }
}

module.exports = consumeIP;
