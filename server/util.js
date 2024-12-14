import crypto from 'crypto';

export function init(body) {
  const requiredKeys = ["plain", "hash", "endpoint"];
  const optionalKeys = ["test", "wrapper"];

  body.plain  = body.plain || {}
  body.hash = body.hash || {}
  
  for (let key of requiredKeys) {
    if (!(key in body)) {
      throw new Error(`Missing key: ${key}`)
    }
  }

  if (body.endpoint === "") {
    throw new Error("No endpoint found")
  }

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

  console.log(`{start: "end of hash}`)
  return payload
}

export async function ping(request, processedPayload) {
  try {
    console.log("Ping function started")
    
    // Validate the request object
    if (!request || !request.body || !request.body.endpoint) {
      throw new Error("Invalid request object: missing endpoint");
    }

    // Ensure headers is an object with proper Content-Type
    const headers = {
      'Content-Type': 'application/json',
      ...(request.headers || {})
    };

    // Ensure the body is a valid JSON string
    const body = typeof processedPayload === 'string' 
      ? processedPayload 
      : JSON.stringify(processedPayload);

    console.log(`Endpoint: ${request.body.endpoint}
        Method: ${request.method}
        Body: ${body}
        Headers: ${JSON.stringify(headers)}`);
    // Perform the fetch request
    const response = await fetch(request.body.endpoint, {
      method: request.method,
      headers: headers,
      body: body
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error: status ${response.status}, ${errorText}`);
    }
    
    // Try to parse the response as JSON
    const responseData = await response.json();
    console.log('Response received successfully');
    
    return responseData;
    } catch (error) {
    console.error("Error in ping function:", error);
    
    // Log more detailed error information
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
    
    throw error;
  }
}