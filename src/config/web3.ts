import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const chains = [sepolia] as const;

export const config = getDefaultConfig({
  appName: 'EtherPocket',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
  chains,
  transports: {
    [sepolia.id]: http(),
  },
  ssr: false,
});

export { chains };

