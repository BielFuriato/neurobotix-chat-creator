(function () {
  const config = window.neuroBotixConfig || {};
  const { botId, apiKey, theme, position, size } = config;

  if (!botId || !apiKey) {
    console.error('NeuroBotix: botId ou apiKey não fornecidos.');
    return;
  }

  const chatbot = { id: botId, apiKey, name: 'Chatbot NeuroBotix' };

  const container = document.createElement('div');
  container.id = 'neurobotix-widget';
  document.body.appendChild(container);

  // Renderiza o WidgetBot diretamente no DOM
  ReactDOM.render(
    React.createElement(window.WidgetBot, { chatbot, theme, size, position }),
    container
  );
})();