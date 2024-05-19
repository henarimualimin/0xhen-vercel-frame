const handleWalletSubmit = async () => {
  const walletAddress = inputText; // Mendapatkan alamat wallet dari inputText

  // Set status dan alamat wallet
  c.set({ status: 'submitted', walletAddress });

  console.log('Submitting wallet address:', walletAddress);

  // Mengirim alamat wallet ke API server
  try {
    const response = await fetch('/api/saveAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    });

    const result = await response.json();
    console.log('Server response:', result);

    // Jika respons dari server berhasil
    if (response.ok) {
      console.log('Wallet address successfully submitted.');

      // Menulis alamat wallet ke dalam file addresses.txt
      try {
        const fs = require('fs');
        fs.appendFileSync('addresses.txt', `${walletAddress}\n`);
        console.log('Wallet address written to addresses.txt');
      } catch (error) {
        console.error('Error writing wallet address to addresses.txt:', error);
      }
    } else {
      console.log('Failed to submit wallet address:', result.message);
    }
  } catch (error) {
    console.error('Error saving wallet address:', error);
  }
};
