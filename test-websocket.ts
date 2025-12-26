import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:5000/ws');

ws.on('open', () => {
  console.log('✅ WebSocket connected successfully');
  
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'orders'
  }));
  
  console.log('📡 Subscribed to orders channel');
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log('📨 Received message:', message);
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
  console.log('🔌 Closing WebSocket connection after 10 seconds...');
  ws.close();
}, 10000);