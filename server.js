const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.APP_CONFIG = { GOOGLE_MAPS_API_KEY: ${JSON.stringify(process.env.GOOGLE_MAPS_API_KEY || '')} };`);
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`Tech Territory Map Google v7 running on ${PORT}`));
