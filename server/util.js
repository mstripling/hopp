import crypto from 'crypto';

export function init(req) {
  const requiredKeys = ["plain", "hash", "endpoint"];
  const optionalKeys = ["test", "wrapper"];

  for (let key of requiredKeys) {
    if (!(key in req.body)) {
      throw new Error(`Missing key: ${key}`)
    }
  }

  if (req.body.endpoint === "") {
    throw new Error("No endpoint found")
  }

  req.body.plain || ""
  req.body.hash || ""
}

export function transformAndHash(requestBody) {
  let payload = {};
  
  for (let key in requestBody.plain) {
    payload[key] = requestBody.plain[key]
  }

  for (let key in requestBody.hash) {

    let value = requestBody.hash[key]
    let strvalue;

    if (typeof value === "string") {
      strvalue = value;
    } else if (typeof value === "number") {
      strvalue = value.toString();
    } else {
      throw new Error(`Unsupported type for ${key}: ${typeof value}`);
    }

    let hash256 = crypto.createHash('sha256').update(strvalue).digest('hex')
    payload[key] = hash256
  }

  return payload
}