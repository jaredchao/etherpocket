import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
const chains = [mainnet, goerli] as const;


export const config = getDefaultConfig({
  appName: 'EtherPocket',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})

// export const wagmiConfig = createConfig({
//   chains,
//   transports: {
//     [mainnet.id]: http(),
//     [goerli.id]: http(),
//   },
// });

export { chains };

