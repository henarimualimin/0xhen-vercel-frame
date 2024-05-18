import { Button, Frog } from 'frog';
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';
import { handle } from 'frog/vercel';

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
});

app.frame('/', (c) => {
  const { buttonValue, verificationStatus } = c;

  const checkFollowStatus = async () => {
    try {
      const response = await fetch('https://hub-api.neynar.com/v1/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api_key': '851D1252-0D69-4EA7-8D6C-1F86E7F98FFD',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const users = data.users;
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
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
          }}
        >
          {verificationStatus === 'success'
            ? 'Verification Success'
            : 'Welcome! To Daily Claim Reward'}
        </div>
      </div>
    ),
    intents: [
      !verificationStatus && (
        <Button value="Verify" onClick={checkFollowStatus}>
          🔑Verify
        </Button>
      ),
      verificationStatus === 'success' && (
        <>
          <Button value="Verification Success" onClick={() => c.set({ buttonValue: 'Verification Success' })}>
            Verification Success
          </Button>
          <Button.Link href="https://warpcast.com/0xhen/0xe487f3c0">
            Claim Degen
          </Button.Link>
          <Button.Link href="https://warpcast.com/~/compose?text=Frame%20By%20@0xhen%20%20%20https://0xhen-vercel-frame.vercel.app/api">
            Share
          </Button.Link>
          <Button.Reset>Reset</Button.Reset>
        </>
      ),
      verificationStatus === 'failure' && (
        <Button value="Verification Failed" onClick={checkFollowStatus}>
          Verify Again
        </Button>
      ),
    ].filter(Boolean),
  });
});

const isEdgeFunction = typeof EdgeFunction !== 'undefined';
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development';
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
