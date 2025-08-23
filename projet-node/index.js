// index.js
const app = require('./app');

const PORT = process.env.PORT || 5000;
require('dotenv').config();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
