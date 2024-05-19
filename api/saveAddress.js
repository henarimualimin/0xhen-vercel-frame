// api/saveAddress.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { walletAddress } = req.body;

    if (walletAddress) {
      const filePath = path.resolve('./public/addresses.txt');
      const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
      const updated = `${current}${walletAddress}\n`;
      fs.writeFileSync(filePath, updated, 'utf-8');
      
      res.status(200).json({ message: 'Address saved successfully!' });
    } else {
      res.status(400).json({ message: 'No wallet address provided.' });
    }
  } else {
    res.status(405).json({ message: 'Invalid request method.' });
  }
}
