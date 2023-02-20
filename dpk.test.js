const { deterministicPartitionKey, MAX_PARTITION_KEY_LENGTH, TRIVIAL_PARTITION_KEY, legacyDeterministicPartitionKey } = require("./dpk");


describe("deterministicPartitionKey", () => {
  it("Returns the literal partition key when input is ok", () => {
    const key = "123";
    const trivialKey = deterministicPartitionKey(key);
    expect(trivialKey).toBe("3f0ff6ca6d8ce3a49489b0f6dbfa9bf9b0c7f037f51a7d49af25778f1172c6c9934eb25fd041b14f2ee14dd13d3559f2d12bb2d470ade89cd046933d555a99b4");
    expect(trivialKey).toBe(legacyDeterministicPartitionKey(key));
  });
  it("Returns the default partition key when no event is provided", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe(TRIVIAL_PARTITION_KEY);
    expect(trivialKey).toBe(legacyDeterministicPartitionKey());
  });
  it("Returns the default when no partitionKey is provided", () => {
    const event = { "1": "2" };
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe("902207426cc6edfc1fbc7fd7c6486947f0c3cffa3463ad21366764e788145861d1ee04c20bf23767837828b030dd54073df3981cf27d670ed5725faf9e4809f9");
    expect(trivialKey).toBe(legacyDeterministicPartitionKey(event));
  });
  it("Returns the partitionKey when it is provided as String", () => {
    const event = { "1": "2", "partitionKey": "123" };
    const trivialKey = deterministicPartitionKey(event);
    
    expect(trivialKey).toBe(event.partitionKey);
    expect(trivialKey).toBe(legacyDeterministicPartitionKey(event));
  });

  it("Returns the String partitionKey when it is provided as Number", () => {
    const event = { "1": "2", "partitionKey": 123 };
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(JSON.stringify(event.partitionKey));
    expect(trivialKey).toBe(legacyDeterministicPartitionKey(event));

  });


  it("Returns the JSON.Stringify partitionKey when it is provided as Object", () => {
    const event = { "1": "2", "partitionKey": { a:123} };
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(JSON.stringify(event.partitionKey));
    expect(trivialKey).toBe(legacyDeterministicPartitionKey(event));

  });

  it("Returns the trucated partition key", () => {
    let partitionKey = Array(MAX_PARTITION_KEY_LENGTH + 1).fill("a", 0, MAX_PARTITION_KEY_LENGTH + 1).join('');
    const event = { "1": "2", partitionKey };
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey.length).toBeLessThanOrEqual(MAX_PARTITION_KEY_LENGTH);
    expect(trivialKey).toBe(legacyDeterministicPartitionKey(event));

  });

});
