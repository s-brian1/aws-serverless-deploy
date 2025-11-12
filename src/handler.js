const storage = require('./storage');
const { randomBytes } = require('crypto');

function makeId(len = 6) {
  // base62-ish using URL-safe chars
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  const buf = randomBytes(len);
  for (let i = 0; i < len; i++) {
    out += chars[buf[i] % chars.length];
  }
  return out;
}

exports.create = async function create(event) {
  const body = event.body ? JSON.parse(event.body) : {};
  const { url } = body;
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing url in request body' })
    };
  }

  const id = makeId(6);
  const item = {
    id,
    url,
    createdAt: new Date().toISOString()
  };

  await storage.put(item);

  const shortUrl = process.env.BASE_URL ? `${process.env.BASE_URL.replace(/\/$/, '')}/${id}` : `/${id}`;

  return {
    statusCode: 201,
    body: JSON.stringify({ id, shortUrl })
  };
};

exports.redirect = async function redirect(event) {
  const id = (event.pathParameters && event.pathParameters.id) || (event.path && event.path.split('/').pop());
  if (!id) {
    return { statusCode: 400, body: 'Missing id' };
  }

  const item = await storage.get(id);
  if (!item) {
    return { statusCode: 404, body: 'Not found' };
  }

  return {
    statusCode: 301,
    headers: {
      Location: item.url
    },
    body: ''
  };
};
