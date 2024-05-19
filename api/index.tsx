import { Button, Frog, Frame, TextInput } from 'frog'; // Import Frame dari Frog
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';
import { handle } from 'frog/vercel';

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
});

app.frame('/', (c) => {
  const { inputText, status, walletAddress, verificationStatus } = c;

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
            ? `Wallet Address Submitted: ${inputText}`
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

      verificationStatus !== 'success' && verificationStatus !== 'failure' && (
        <Button value="Success" onClick={checkFollowStatus}>
          🔑Verify
        </Button>
      ),

      verificationStatus === 'success' && (
        <Button value="verification success" onClick={() => {
          setTimeout(() => {
            c.set({ buttonValue: 'verification success' });
          }, 10000); // Jeda 10000 ms (10 detik)
        }}>
          Verification Success
        </Button>
      ),

      verificationStatus === 'failure' && (
        <Button value="verification failed" onClick={checkFollowStatus}>
          Verify Again
        </Button>
      ),

      // Gunakan Frame untuk memuat tampilan dari URL tertentu
      <Frame src="https://glass.cx/degenclaim-2">
        {({ loading, content, error }) => (
          loading ? 'Loading...' : (content || error)
        )}
      </Frame>,

      status === 'response' && <Button.Reset>🗑Reset</Button.Reset>,
    ].filter(Boolean), // Filter untuk menghapus nilai-nilai "falsy" dari array
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
