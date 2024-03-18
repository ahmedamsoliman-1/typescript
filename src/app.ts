// src/app.ts
import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3005;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Define routes
app.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Express 2 44 TypeScript App' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
