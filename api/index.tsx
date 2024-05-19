import { Button, Frog, TextInput } from 'frog';
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';
import { handle } from 'frog/vercel';

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
});

app.frame('/', (c) => {
  const { inputText, status, walletAddress } = c;

  const handleWalletSubmit = async () => {
    const walletAddress = inputText;
    console.log("Submitting wallet address:", walletAddress);
    
    c.set({ status: 'submitted', walletAddress });

    try {
      const response = await fetch('/api/saveAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      const result = await response.json();
      console.log("Response from server:", result);
      
      if (!response.ok) {
        console.error('Failed to submit wallet address:', result.message);
      }
    } catch (error) {
      console.error('Error saving wallet address:', error);
    }
  };

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'black',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'submitted'
            ? `Wallet Address Submitted: ${walletAddress}`
            : 'Welcome! To Daily Claim Reward'}
        </div>
      </div>
    ),
    intents: [
      <TextInput
        placeholder="Enter your ETH wallet address"
        onInput={(e) => c.set({ inputText: e.target.value })}
      />,

      <Button value="Submit Wallet" onClick={handleWalletSubmit}>
        📤Submit Wallet
      </Button>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
