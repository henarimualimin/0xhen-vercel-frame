import { Button, Frog, Frame, TextInput } from 'frog'; // Import Frame dari Frog
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';
import { handle } from 'frog/vercel';

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
});

app.frame('/', (c) => {
  const { buttonValue, inputText, status, verificationStatus, walletAddress } = c;
  const fruit = inputText || buttonValue;

  const handleWalletSubmit = async () => {
    const walletAddress = inputText;
    c.set({ status: 'submitted', walletAddress });

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

  // @ts-ignore
  const isEdgeFunction = typeof EdgeFunction !== 'undefined';
  const isProduction = isEdgeFunction || (import.meta.env?.MODE !== 'development');

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: status === 'response' ? 'linear-gradient(to right, #432889, #17101F)' : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
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
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? `Nice choice.${buttonValue ? `${buttonValue.toUpperCase()}!!` : ''}`
            : status === 'submitted'
            ? `Wallet Address Submitted: ${walletAddress}`
            : 'Welcome! To Daily Claim Reward'}
        </div>
        {status === 'submitted' && (
          <div
            style={{
              color: 'white',
              fontSize: 20,
              marginTop: 20,
            }}
          >
            Your ETH Wallet Address: {walletAddress}
          </div>
        )}
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
        <Button value="Success">
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

      // Tombol memuat frame dari link
      <Button onClick={() => {
        c.set({ buttonValue: 'Claim Degen' }); // Update nilai tombol
        // Memuat frame dari link
        c.set({
          image: (
            <Frame src="https://glass.cx/degenclaim-2" style={{ width: '100%', height: '100%' }} />
          )
        });
      }}>
        🎁Claim Degen
      </Button>,

      <Button.Link href="https://warpcast.com/~/compose?text=Frame%20By%20@0xhen%20%20%20https://0xhen-vercel-frame.vercel.app/api">
        🔍Share
      </Button.Link>,

      status === 'response' && <Button.Reset>🗑Reset</Button.Reset>,
    ].filter(Boolean),
  });
});

const isEdgeFunction = typeof EdgeFunction !== 'undefined';
const isProduction = isEdgeFunction || (import.meta.env?.MODE !== 'development');
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
