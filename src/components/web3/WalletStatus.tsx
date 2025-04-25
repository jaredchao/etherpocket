import { useAccount, useChainId, useConnections } from 'wagmi';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { chains } from '@/config/web3';

export function WalletStatus() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { connections } = useConnections();
  
  // 获取当前连接（确保存在connections数组且有值）
  const currentConnection = connections && connections.length > 0 ? connections[0] : undefined;
  
  // 找到当前链的信息（只在chainId有效时才查找）
  const currentChain = chainId ? chains.find(chain => chain.id === chainId) : undefined;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>钱包状态</CardTitle>
        <CardDescription>当前钱包连接状态和网络信息</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">连接状态:</span>
            <Badge variant={isConnected ? "success" : "destructive"}>
              {isConnected ? '已连接' : '未连接'}
            </Badge>
          </div>
          
          {isConnected && currentConnection && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">连接方式:</span>
                <span className="text-sm">{currentConnection.connector?.name || '未知'}</span>
              </div>
              
              {currentChain ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">当前网络:</span>
                  <div className="flex items-center gap-2">
                    {currentChain.iconUrl && (
                      <img 
                        src={currentChain.iconUrl} 
                        alt={currentChain.name} 
                        className="w-4 h-4" 
                        onError={(e) => {
                          // 图片加载错误时隐藏
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span className="text-sm">{currentChain.name}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">当前网络:</span>
                  <Badge variant="destructive">不支持的网络</Badge>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
