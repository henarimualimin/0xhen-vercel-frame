
import { Button, Frog, TextInput } from 'frog';
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';
import { handle } from 'frog/vercel';

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

app.frame('/', (c) => {
  const { buttonValue, inputText, status, verificationStatus, walletAddress } = c;
  const fruit = inputText || buttonValue;

  // Fungsi untuk memeriksa apakah pengguna mengikuti akun @0xhen di Warpcast
  const checkFollowStatus = async () => {
    try {
      const response = await fetch('https://hub-api.neynar.com/v1/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api_key': '851D1252-0D69-4EA7-8D6C-1F86E7F98FFD', // Menggunakan token API Anda
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const users = data.users; // Daftar pengguna yang mengikuti akun

      // Lakukan pengecekan apakah pengguna mengikuti akun dengan username '0xhen' atau FID '314233'
      const isFollowing = users.some(user => user.user.username === '0xhen' || user.user.fid === '314233');

      if (isFollowing) {
        c.set({ verificationStatus: 'success' });
      } else {
        c.set({ verificationStatus: 'failure' });
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
      c.set({ verificationStatus: 'failure' });
    }
  };

  // Fungsi untuk menangani submit alamat wallet
  const handleWalletSubmit = async () => {
    const walletAddress = inputText;
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

  // @ts-ignore
  const isEdgeFunction = typeof EdgeFunction !== 'undefined';
  const isProduction = isEdgeFunction || (import.meta.env?.MODE !== 'development');

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
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

      <Button value="Success" onClick={handleWalletSubmit}>
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

      // Tombol redirect link
      <Button.Link href="https://warpcast.com/0xhen/0xe487f3c0">
        🎁Claim Degen
      </Button.Link>,

      <Button.Link href="https://warpcast.com/~/compose?text=Frame%20By%20@0xhen%20%20%20https://0xhen-vercel-frame.vercel.app/api%20(delete%20this%20article%20but%20don%27t%20delete%20the%20link%20so%20that%20the%20image%20frame%20appears)">
        🔍Share
      </Button.Link>,

      status === 'response' && <Button.Reset>🗑Reset</Button.Reset>,
    ].filter(Boolean), // Filter untuk menghapus nilai-nilai "falsy" dari array
  });
});

const isEdgeFunction = typeof EdgeFunction !== 'undefined';
const isProduction = isEdgeFunction || (import.meta.env?.MODE !== 'development');
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
