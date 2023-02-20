const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal partition key when input is ok", () => {
    const trivialKey = deterministicPartitionKey("123");
    expect(trivialKey).toBe("123");
  });
  it("Returns the default partition key when no event is provided", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe(deterministicPartitionKey.TRIVIAL_PARTITION_KEY);
  });

  
  it("Returns the trucated parition key", () => {
    let key=  "";
    for(let i =0 ; i < deterministicPartitionKey.MAX_PARTITION_KEY_LENGTH+1; i++){
      key +-i;
    }
    expect(key).length.toBe(deterministicPartitionKey.MAX_PARTITION_KEY_LENGTH);
  });
});
