export async function getActiveFlights({ 
  limit = 500
} = {}) {
  const baseUrl = 'https://opensky-network.org/api/states/all';
  const url = baseUrl;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      const username = process.env.OPENSKY_USERNAME;
      const password = process.env.OPENSKY_PASSWORD;
      
      if (username && password) {
        const credentials = btoa(`${username}:${password}`);
        
        const authResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
          },
          cache: 'no-cache',
        });

        if (!authResponse.ok) {
          throw new Error(`HTTP error! status: ${authResponse.status}`);
        }

        const data = await authResponse.json();
        const allStates = data.states || [];
        
        return allStates.slice(0, limit);
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const allStates = data.states || [];
    
    return allStates.slice(0, limit);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
