// index.ts

import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import contentRoutes from './routes/contentRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
// app.use('/', (req, res) => {
//   res.send('Hello World!');
// });

app.use(authRoutes);
app.use(contentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
