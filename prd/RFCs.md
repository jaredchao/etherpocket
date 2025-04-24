# EtherPocket - 技术实现规范 (RFCs)

## 1. 技术架构

### 1.1 前端架构
```typescript
src/
├── components/
│   ├── ui/          # shadcn/ui 组件
│   ├── layout/      # 布局组件
│   └── web3/        # Web3 相关组件
├── hooks/           # 自定义 hooks
├── config/          # 配置文件
├── utils/           # 工具函数
└── types/           # TypeScript 类型定义
```

### 1.2 状态管理
- 使用 React Context + Hooks 管理全局状态
- 使用 wagmi 管理 Web3 状态
- 使用 localStorage 持久化用户配置

## 2. 核心功能实现规范

### 2.1 钱包连接

#### 2.1.1 RainbowKit 配置
```typescript
// src/config/web3.ts
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'EtherPocket',
  projectId: process.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});
```

#### 2.1.2 账户显示组件
```typescript
// src/components/web3/AccountDisplay.tsx
import { useAccount, useEnsName } from 'wagmi';
import { Button } from '@/components/ui/button';
import { CopyIcon } from '@/components/ui/icons';

export function AccountDisplay() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-2">
      <span>{ensName || formatAddress(address)}</span>
      <Button variant="ghost" size="icon">
        <CopyIcon />
      </Button>
    </div>
  );
}
```

### 2.2 余额查询

#### 2.2.1 代币管理 Hook
```typescript
// src/hooks/useTokenList.ts
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useToken } from 'wagmi';

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
}

export function useTokenList() {
  const [tokens, setTokens] = useLocalStorage<Token[]>('tokens', []);
  
  const addToken = async (address: string) => {
    const { data: tokenData } = useToken({
      address: address as `0x${string}`,
    });
    
    if (tokenData) {
      setTokens(prev => [...prev, {
        address,
        symbol: tokenData.symbol,
        decimals: tokenData.decimals
      }]);
    }
  };

  return { tokens, addToken };
}
```

#### 2.2.2 余额显示组件
```typescript
// src/components/web3/BalanceDisplay.tsx
import { useBalance } from 'wagmi';
import { useTokenList } from '@/hooks/useTokenList';

export function BalanceDisplay() {
  const { address } = useAccount();
  const { tokens } = useTokenList();
  
  const { data: ethBalance } = useBalance({
    address,
  });

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <div className="flex justify-between">
          <span>ETH</span>
          <span>{ethBalance?.formatted || '0'} ETH</span>
        </div>
      </div>
      
      {tokens.map(token => (
        <TokenBalance key={token.address} token={token} />
      ))}
    </div>
  );
}
```

### 2.3 转账功能

#### 2.3.1 交易准备 Hook
```typescript
// src/hooks/useTransaction.ts
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';

export function useTransaction(to: string, amount: string) {
  const { config } = usePrepareSendTransaction({
    to,
    value: amount ? parseEther(amount) : undefined,
  });
  
  const { data, sendTransaction } = useSendTransaction(config);
  
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return { sendTransaction, isLoading, isSuccess };
}
```

#### 2.3.2 转账表单组件
```typescript
// src/components/web3/TransferForm.tsx
import { useState } from 'react';
import { useTransaction } from '@/hooks/useTransaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TransferForm() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  
  const { sendTransaction, isLoading, isSuccess } = useTransaction(recipient, amount);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      sendTransaction?.();
    }}>
      <Input
        placeholder="接收地址"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <Input
        type="number"
        placeholder="转账金额"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '处理中...' : '发送'}
      </Button>
    </form>
  );
}
```

### 2.4 交易历史

#### 2.4.1 交易历史 Hook
```typescript
// src/hooks/useTransactionHistory.ts
import { useAccount, useBlockNumber } from 'wagmi';
import { useState, useEffect } from 'react';

export function useTransactionHistory() {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // 获取交易历史逻辑
  }, [address, blockNumber]);

  return { transactions };
}
```

#### 2.4.2 交易历史组件
```typescript
// src/components/web3/TransactionHistory.tsx
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { useNetwork } from 'wagmi';

export function TransactionHistory() {
  const { transactions } = useTransactionHistory();
  const { chain } = useNetwork();

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.hash} className="p-4 border rounded-lg">
          <div className="flex justify-between">
            <div>
              <div>{tx.type}</div>
              <div>{tx.amount}</div>
            </div>
            <a 
              href={`${chain?.blockExplorers?.default?.url}/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看详情
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 3. 性能优化规范

### 3.1 数据缓存
- 使用 React Query 缓存 API 响应
- 实现本地存储缓存策略
- 设置合理的缓存过期时间

### 3.2 代码分割
- 使用 React.lazy 实现路由级代码分割
- 按需加载大型组件
- 优化首屏加载时间

### 3.3 状态更新
- 使用防抖处理频繁的状态更新
- 实现增量更新策略
- 优化重渲染性能

## 4. 安全规范

### 4.1 数据安全
- 敏感数据加密存储
- 实现数据清理机制
- 防止 XSS 攻击

### 4.2 交易安全
- 实现交易签名验证
- 添加交易确认机制
- 防止重放攻击

## 5. 测试规范

### 5.1 单元测试
- 使用 Jest + React Testing Library
- 测试覆盖率 > 80%
- 关键功能 100% 覆盖

### 5.2 E2E 测试
- 使用 Cypress
- 覆盖核心用户流程
- 自动化测试部署

## 6. 部署规范

### 6.1 构建配置
- 优化生产环境构建
- 实现环境变量管理
- 配置 CDN 加速

### 6.2 监控告警
- 实现错误监控
- 性能监控
- 用户行为分析 
