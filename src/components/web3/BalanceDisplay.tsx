import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useEthBalance } from '@/hooks/useEthBalance';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { TokenList } from './token/TokenList';

export function BalanceDisplay() {
  const { address } = useAccount();
  const { 
    formatted: ethBalance, 
    symbol: ethSymbol, 
    lastUpdated, 
    isLoading, 
    refetch 
  } = useEthBalance(address);

  // 格式化最后更新时间
  const formattedLastUpdated = lastUpdated
    ? formatDistanceToNow(lastUpdated, { addSuffix: true, locale: zhCN })
    : '未更新';

  return (
    <div className="space-y-6">
      {/* ETH余额卡片 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">余额</CardTitle>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetch()}
            disabled={isLoading}
            title="刷新余额"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex items-end justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  Ξ
                </div>
                <span className="text-lg font-medium">以太坊</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{ethBalance} {ethSymbol}</div>
                {/* 这里可以添加法币等值显示 */}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground text-right">
              最后更新: {formattedLastUpdated}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 代币列表 */}
      <TokenList address={address} />
    </div>
  );
} 
