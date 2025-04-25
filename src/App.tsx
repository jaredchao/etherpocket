import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
  QueryClientProvider
} from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { AccountDisplay } from './components/web3/AccountDisplay';
import { BalanceDisplay } from './components/web3/BalanceDisplay';
import { ConnectWallet } from './components/web3/ConnectWallet';
import { WalletStatus } from './components/web3/WalletStatus';
import { queryClient } from './config/query';
import { config } from './config/web3';


function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">EtherPocket</h1>
                <ConnectWallet />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 左侧：钱包状态 */}
                <div className="md:col-span-1">
                  <div className="space-y-6">
                    <WalletStatus />
                  </div>
                </div>
                
                {/* 右侧：主要内容区 */}
                <div className="md:col-span-2">
                  <div className="space-y-6">
                    <div className="bg-card p-6 rounded-lg shadow">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">账户信息</h2>
                        <AccountDisplay />
                      </div>
                    </div>
                    
                    {/* 余额显示 */}
                    <BalanceDisplay />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
