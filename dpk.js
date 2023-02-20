const crypto = require("crypto");
/*
exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  if (event) {
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }
  }

  if (candidate) {
    if (typeof candidate !== "string") {
      candidate = JSON.stringify(candidate);
    }
  } else {
    candidate = TRIVIAL_PARTITION_KEY;
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }
  return candidate;
};


*/


const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

function deterministicPartitionKey(event) {
  return getCandidate(event);
}

function getCandidate(event) {
  let candidate = TRIVIAL_PARTITION_KEY; //Default value
  if (event) {
    if (event.partitionKey) {
      //If the provided partitionKey is too big
      candidate = event.partitionKey;
    } else {
      candidate = JSON.stringify(event);
    }
  }
  return getPartitionKey(candidate);
}

function getPartitionKey(partitionKey) {
  if (typeof partitionKey !== "string") {
    partitionKey = JSON.stringify(partitionKey);
  }
  if (partitionKey.length > MAX_PARTITION_KEY_LENGTH) {
    return hashPartitionKey(partitionKey);
  }
  return partitionKey;
}

function hashPartitionKey(partitionKey) {
  return crypto.createHash("sha3-512").update(partitionKey).digest("hex");
}
exports.deterministicPartitionKey = deterministicPartitionKey;
exports.TRIVIAL_PARTITION_KEY = TRIVIAL_PARTITION_KEY;
exports.MAX_PARTITION_KEY_LENGTH = MAX_PARTITION_KEY_LENGTH;