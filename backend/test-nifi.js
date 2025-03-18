require('dotenv').config();
const axios = require('axios');
const https = require('https');

// Print the environment variables
console.log('Testing with credentials:');
console.log('NIFI_API_URL:', process.env.NIFI_API_URL);
console.log('NIFI_USERNAME:', process.env.NIFI_USERNAME);
console.log('NIFI_PASSWORD:', process.env.NIFI_PASSWORD ? '********' : 'not set');

// Create a secure connection to NiFi
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Try to get access token
async function testNiFiConnection() {
  try {
    // First test with the /access endpoint
    console.log('\nTesting NiFi token endpoint...');
    const tokenResponse = await axios({
      method: 'post',
      url: `${process.env.NIFI_API_URL}/access/token`,
      auth: {
        username: process.env.NIFI_USERNAME,
        password: process.env.NIFI_PASSWORD
      },
      httpsAgent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Token obtained successfully:', tokenResponse.data.substring(0, 10) + '...');
    
    // Use the token to test the API
    console.log('\nTesting NiFi API with token...');
    const apiResponse = await axios({
      method: 'get',
      url: `${process.env.NIFI_API_URL}/flow/about`,
      httpsAgent,
      headers: {
        'Authorization': `Bearer ${tokenResponse.data}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('NiFi API response:', JSON.stringify(apiResponse.data, null, 2));
    return true;
  } catch (error) {
    console.error('NiFi connection test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    
    // Try basic auth as fallback
    try {
      console.log('\nFalling back to basic auth...');
      const basicAuthResponse = await axios({
        method: 'get',
        url: `${process.env.NIFI_API_URL}/flow/about`,
        auth: {
          username: process.env.NIFI_USERNAME,
          password: process.env.NIFI_PASSWORD
        },
        httpsAgent,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Basic auth successful!');
      console.log('NiFi API response:', JSON.stringify(basicAuthResponse.data, null, 2));
      return true;
    } catch (basicAuthError) {
      console.error('Basic auth also failed:');
      if (basicAuthError.response) {
        console.error('Status:', basicAuthError.response.status);
        console.error('Data:', basicAuthError.response.data);
      } else {
        console.error('Error:', basicAuthError.message);
      }
      return false;
    }
  }
}

testNiFiConnection()
  .then(success => {
    console.log('\nTest completed:', success ? 'SUCCESS' : 'FAILED');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 