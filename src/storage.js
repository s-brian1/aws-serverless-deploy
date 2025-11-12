const AWS = require('aws-sdk');
const TABLE = process.env.TABLE_NAME || process.env.TABLE || process.env.TABLE_NAME || null;

// In-memory store for tests or when no table defined
class MemoryStore {
  constructor() {
    this.map = new Map();
  }
  async put(item) {
    this.map.set(item.id, item);
    return item;
  }
  async get(id) {
    return this.map.get(id) || null;
  }
}

class DynamoStore {
  constructor() {
    this.client = new AWS.DynamoDB.DocumentClient();
    this.table = process.env.TABLE_NAME || process.env.TABLE || null;
    if (!this.table) throw new Error('DynamoStore requires TABLE_NAME env var');
  }
  async put(item) {
    await this.client.put({ TableName: this.table, Item: item }).promise();
    return item;
  }
  async get(id) {
    const res = await this.client.get({ TableName: this.table, Key: { id } }).promise();
    return res.Item || null;
  }
}

let store;
if (process.env.NODE_ENV === 'test' || !process.env.TABLE_NAME) {
  store = new MemoryStore();
} else {
  store = new DynamoStore();
}

module.exports = store;
