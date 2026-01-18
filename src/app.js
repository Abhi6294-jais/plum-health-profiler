const express = require('express');
const cors = require('cors');
const config = require('./config');
const healthRoutes = require('./routes/health');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', healthRoutes);

app.get('/', (req, res) => res.send("Plum Health Profiler is Running!"));

app.listen(config.PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${config.PORT}`);
});