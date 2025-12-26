import WebSocket from 'ws';

async function testWebSocketWithAuth() {
  let authToken = '';
  
  try {
    console.log('🔐 Logging in to get auth token...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@yapee.com',
        password: 'hashed_secret'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('📝 Login response:', loginData);
    
    if (loginData.data && loginData.data.token) {
      authToken = loginData.data.token;
      console.log('✅ Auth token obtained');
    } else {
      console.error('❌ Failed to get auth token');
      return;
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return;
  }
  
  const ws = new WebSocket('ws://localhost:5000/ws');

  ws.on('open', () => {
    console.log('✅ WebSocket connected successfully');
    
    ws.send(JSON.stringify({
      type: 'subscribe',
      channel: 'orders'
    }));
    
    console.log('📡 Subscribed to orders channel');
    
    setTimeout(() => {
      console.log('🔄 Creating a new order via REST API...');
      fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          userId: 'test-user-id',
          items: [
            {
              productId: '1',
              quantity: 2,
              price: 189.99
            }
          ],
          shippingAddress: {
            street: '123 Test Street',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'USA'
          },
          paymentMethod: 'credit_card'
        })
      }).then(res => res.json())
        .then(data => console.log('📦 Order created:', data))
        .catch(err => console.error('❌ Error creating order:', err));
    }, 2000);
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📨 Received WebSocket message:', message);
    } catch (error) {
      console.log('📨 Received raw message:', data.toString());
    }
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('⚠️ WebSocket connection closed');
  });

  setTimeout(() => {
    console.log('🔌 Closing WebSocket connection...');
    ws.close();
  }, 15000);
}

testWebSocketWithAuth();