
# LimitKeeper

## Introduction

LimitKeeper is a flexible and robust middleware that allows you to control the rate of incoming requests to your server. It supports three rate-limiting techniques: Sliding Window Counter, Leaky Bucket, and Token Bucket. This middleware is particularly useful for preventing abuse, ensuring fair usage, and protecting your server from being overwhelmed by excessive requests.

## When to Use It

Use this API Rate Limiter when you need to:

- Prevent brute-force attacks.
- Throttle requests to an API or service.
- Enforce rate limits per user, IP, or any other identifier.
- Ensure fair usage among users.
- Protect your server resources by limiting request rates.

## How to Use It

### 1. Installation 

First, install the package via npm: 

```bash
npm install limitkeeper
```

### 2. Importing and Setting Up

Import the rate limiter and configure it with your desired options:

```javascript
const rateLimiter = require('limitkeeper');

const options = {
    technique: 'sliding-window', // Options: 'sliding-window', 'leaky-bucket', 'token-bucket'
    points: 100, // Only for 'sliding-window'
    duration: 60, // Only for 'sliding-window'
    blockDuration: 600, // Only for 'sliding-window'
    capacity: 10, // Only for 'leaky-bucket' and 'token-bucket'
    interval: 1, // Only for 'leaky-bucket'
    refillRate: 1, // Only for 'token-bucket'
    refillInterval: 1 // Only for 'token-bucket'
};

const limiter = rateLimiter(options);

app.use(limiter);
```

By default, if no technique is specified, the rate limiter will use the Sliding Window Counter technique.

## Techniques Overview

- **Sliding Window Counter:** This technique limits the number of requests within a specified duration. It's useful for simple, straightforward rate limiting, where you want to allow a certain number of requests per time unit (e.g., 100 requests per minute).

- **Leaky Bucket:** This technique smooths out bursts of traffic by allowing requests at a steady rate. It's ideal for scenarios where you want to enforce a consistent request rate, regardless of sudden spikes.

- **Token Bucket:** This technique is more flexible than the Leaky Bucket, allowing bursts of requests up to a certain limit (bucket capacity) and then refilling the bucket at a constant rate. It's useful when you want to allow occasional bursts but maintain overall control over the request rate.

## Fields Explanation

- **technique:** The rate-limiting technique to use. Options: `'sliding-window'`, `'leaky-bucket'`, `'token-bucket'`. Default: `'sliding-window'`.
  
- **points:** Maximum number of requests allowed in the sliding window duration. Only used for the Sliding Window technique. Default: `100`.
  
- **duration:** Time in seconds for the sliding window duration. Only used for the Sliding Window technique. Default: `60`.
  
- **blockDuration:** Time in seconds to block requests once the limit is exceeded. Only used for the Sliding Window technique. Can be disabled when set `0`. Default: `120`.
  
- **capacity:** Maximum number of requests or tokens the bucket can hold. Used for both Leaky Bucket and Token Bucket techniques. Default: `10` (Leaky Bucket), `100` (Token Bucket).
  
- **interval:** Time in seconds between each request leak in the Leaky Bucket technique. Default: `1`.
  
- **refillRate:** Number of tokens added to the bucket per refill interval in the Token Bucket technique. Default: `1`.
  
- **refillInterval:** Time in seconds for each refill in the Token Bucket technique. Default: `1`.

## Example Usage

```javascript
const express = require('express');
const rateLimiter = require('limitkeeper');

const app = express();

const limiter = rateLimiter({
    technique: 'token-bucket',
    capacity: 50,
    refillRate: 5,
    refillInterval: 2
});

// global use: limits tha rate of all requests
app.use(limiter);

app.get('/', (req, res) => {
    res.send('Welcome to the rate-limited API!');
});

// route-specific limiting
app.post('/api/data',
    limiter,
    (req, res) => {
    res.send('Route specific rate-limitin');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

## Conclusion

This API Rate Limiter provides a simple yet powerful way to control incoming request rates. By selecting the appropriate technique and configuring the relevant options, you can protect your API from excessive usage while maintaining a smooth user experience. Feel free to experiment with different configurations to find what works best for your specific needs.

