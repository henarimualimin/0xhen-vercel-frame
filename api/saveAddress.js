const handleWalletSubmit = async () => {
  const walletAddress = inputText; // Di sini Anda mendapatkan alamat wallet dari inputText
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

    // Tambahkan pemeriksaan respons dari server
    if (response.ok) {
      console.log('Wallet address successfully submitted.');
    } else {
      console.log('Failed to submit wallet address:', result.message);
    }
  } catch (error) {
    console.error('Error saving wallet address:', error);
  }
};
