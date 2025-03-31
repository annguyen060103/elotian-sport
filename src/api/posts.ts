import express from 'express';
import cors from 'cors';

// import axios from 'axios';

// export default axios.create({
//   baseURL: 'https://gym-crm.lehaitien.site',
// });

const app = express();

// Cho phép tất cả CORS
app.use(cors());

app.get('/auth/token', (req, res) => {
  res.json({ message: 'Token generated' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
