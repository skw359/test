import "../styles/globals.css";
import outputs from "../../amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from "aws-amplify";
import Layout from '../../components/shared/layout';

Amplify.configure(outputs);

export default function App({ Component, pageProps }) {
  return (
    <Layout>

    
    <Authenticator>
      {({ signOut, user }) => (
        <>
          {/* Optional: Show user info or nav bar */}
          <header style={{ padding: '0rem', borderBottom: '1px solid #2d3748' }}>
            <span>Welcome, {user?.username}</span>
            <button onClick={signOut} style={{ marginLeft: '1rem' }}>Sign Out</button>
          </header>

          <Component {...pageProps} />
        </>
      )}
    </Authenticator>
    </Layout>
    );
}
