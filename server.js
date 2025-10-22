const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
	const result = await pool.query('SELECT * FROM employees');
	res.json(result.rows);
  } catch (err) {
	res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});