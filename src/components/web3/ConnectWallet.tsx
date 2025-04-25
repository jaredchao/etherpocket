import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';

// ConnectWallet组件使用RainbowKit的API，不受wagmi版本变化影响
export function ConnectWallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // 确保组件已挂载且不在加载中
        const ready = mounted && authenticationStatus !== 'loading';
        
        // 判断是否已连接（需要account、chain都存在，且认证状态正确）
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!ready) {
                // 组件未准备好时，返回一个占位符以保持布局稳定
                return <Button variant="outline" disabled>加载中...</Button>;
              }
              
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} variant="default">
                    连接钱包
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive">
                    网络不支持
                  </Button>
                );
              }

              return (
                <div className="flex gap-3">
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {chain.hasIcon && chain.iconUrl ? (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 2,
                        }}
                      >
                        <img
                          alt={chain.name ?? '链图标'}
                          src={chain.iconUrl}
                          style={{ width: 16, height: 16 }}
                          onError={(e) => {
                            // 图片加载错误时隐藏
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : null}
                    {chain.name}
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    variant="outline"
                    size="sm"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
} 
