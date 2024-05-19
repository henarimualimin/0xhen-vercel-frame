// api/saveAddress.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log("Received POST request");
    console.log("Request Body:", req.body);
    
    const { walletAddress } = req.body;

    if (walletAddress) {
      const filePath = path.resolve('./public/addresses.txt');
      console.log("Writing to file at:", filePath);
      
      const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
      const updated = `${current}${walletAddress}\n`;
      
      fs.writeFileSync(filePath, updated, 'utf-8');
      console.log("File updated successfully");

      res.status(200).json({ message: 'Address saved successfully!' });
    } else {
      console.log("No wallet address provided");
      res.status(400).json({ message: 'No wallet address provided.' });
    }
  } else {
    console.log("Invalid request method");
    res.status(405).json({ message: 'Invalid request method.' });
  }
}
