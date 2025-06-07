import React from 'react';

export const WidgetBot = ({ chatbot, theme = 'auto', size = { width: '400px', height: '600px' }, position = 'bottom-right' }) => {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    width: size.width,
    height: size.height,
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  };

  switch (position) {
    case 'bottom-right':
      containerStyle.bottom = '20px';
      containerStyle.right = '20px';
      break;
    case 'bottom-left':
      containerStyle.bottom = '20px';
      containerStyle.left = '20px';
      break;
    case 'top-right':
      containerStyle.top = '20px';
      containerStyle.right = '20px';
      break;
    case 'top-left':
      containerStyle.top = '20px';
      containerStyle.left = '20px';
      break;
    default:
      containerStyle.bottom = '20px';
      containerStyle.right = '20px';
  }

  return (
    <div style={containerStyle}>
      <iframe
        src={`http://localhost:3000/chatbot/${chatbot.id}?apiKey=${chatbot.apiKey}`}
        style={{ width: '100%', height: '100%', border: 'none' }}
      ></iframe>
    </div>
  );
};

// Torna o WidgetBot acessível globalmente
window.WidgetBot = WidgetBot;