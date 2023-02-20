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
    for(let i =0 ; i < 280; i++){
      key +-i;
    }
    expect(key).length.toBe(256);
  });
});
