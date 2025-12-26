import WebSocket from 'ws';

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
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NjY3ZTQwLWU4ZjctNGYzOC1iZjIzLTJiZjY5ZjQ3ZmM2NSIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTczNTE2MjQzMCwiZXhwIjoxNzM1MjQ4ODMwfQ'
      },
      body: JSON.stringify({
        userId: '67667e40-e8f7-4f38-bf23-2bf69f47fc65',
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