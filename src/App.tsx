import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
  QueryClientProvider
} from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { AccountDisplay } from './components/web3/AccountDisplay';
import { queryClient } from './config/query';
import { config } from './config/web3';


function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8">EtherPocket</h1>
              <div className="bg-card p-6 rounded-lg shadow">
                <AccountDisplay />
              </div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
