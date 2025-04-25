import { RefreshCw } from 'lucide-react';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { Token } from '@/types/token';

interface TokenBalanceProps {
  token: Token;
  address: `0x${string}` | undefined;
}

export function TokenBalance({ token, address }: TokenBalanceProps) {
  const { 
    formatted, 
    symbol, 
    isLoading, 
    refetch 
  } = useTokenBalance(token, address);

  // 生成代币图标的占位符样式
  const generateColorFromSymbol = (symbol: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 
      'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
    ];
    
    // 使用代币符号生成简单的哈希
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = (hash + symbol.charCodeAt(i)) % colors.length;
    }
    
    return colors[hash];
  };

  const tokenIconClass = generateColorFromSymbol(token.symbol);

  return (
    <div className="flex flex-1 items-center justify-between pr-2">
      <div className="flex items-center space-x-3">
        {token.logoURI ? (
          <img 
            src={token.logoURI} 
            alt={token.symbol} 
            className="w-8 h-8 rounded-full" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.insertAdjacentHTML(
                'afterbegin',
                `<div class="w-8 h-8 rounded-full ${tokenIconClass} flex items-center justify-center text-white">${token.symbol.slice(0, 1)}</div>`
              );
            }}
          />
        ) : (
          <div className={`w-8 h-8 rounded-full ${tokenIconClass} flex items-center justify-center text-white`}>
            {token.symbol.slice(0, 1)}
          </div>
        )}
        <div>
          <div className="font-medium">{token.symbol}</div>
          <div className="text-xs text-muted-foreground">{token.name || '未知代币'}</div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="font-medium">{formatted}</div>
          <div className="text-xs text-muted-foreground">{symbol}</div>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground focus:outline-none"
          title="刷新余额"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
} 
