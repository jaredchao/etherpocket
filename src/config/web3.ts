import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';

// 定义支持的链
const chains = [mainnet, goerli] as const;

// RainbowKit + Wagmi 配置
export const config = getDefaultConfig({
  appName: 'EtherPocket',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
  chains,
  // 为每个链配置传输层
  transports: {
    [mainnet.id]: http(),
    [goerli.id]: http(),
  },
  // 启用持久化连接状态
  ssr: false,
});

// export const wagmiConfig = createConfig({
//   chains,
//   transports: {
//     [mainnet.id]: http(),
//     [goerli.id]: http(),
//   },
// });

export { chains };

