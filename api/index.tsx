import { Button, Frog, TextInput } from 'frog';
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';
import { handle } from 'frog/vercel';

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
});

app.frame('/', (c) => {
  const { inputText, status, walletAddress, verificationStatus, frameSrc } = c;

  const handleFrameLoad = (url) => {
    c.set({ frameSrc: url });
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

      <Button
        value="Load Frame"
        onClick={() => handleFrameLoad('https://glass.cx/degenclaim-2')}
      >
        Load Frame
      </Button>,

      status === 'response' && <Button.Reset>🗑Reset</Button.Reset>,
    ].filter(Boolean), // Filter untuk menghapus nilai-nilai "falsy" dari array
    frameSrc && (
      <iframe
        src={frameSrc}
        style={{ width: '100%', height: '300px', border: 'none' }}
        title="Frame"
      />
    ),
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
