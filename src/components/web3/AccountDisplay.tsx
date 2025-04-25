import { Button } from '@/components/ui/button';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';
import { useAccount, useEnsName } from 'wagmi';
import { useState, useEffect } from 'react';

export function AccountDisplay() {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);

  // 查询ENS名称（只在地址存在时启用查询）
  const { data: ensName, isError } = useEnsName({ 
    address,
    query: {
      enabled: !!address,
      retry: 1, // 失败后只重试一次
    } 
  });
  
  // 复制成功后的状态重置
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // 格式化显示地址：前6位...后4位
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return addr.length >= 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
  };

  // 复制地址到剪贴板
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
        .then(() => setCopied(true))
        .catch(error => console.error('复制失败:', error));
    }
  };

  // 展示的名称逻辑：优先显示ENS名称，其次是格式化后的地址，最后是"未连接"
  const displayName = !address 
    ? '未连接' 
    : (isError ? formatAddress(address) : (ensName || formatAddress(address)));

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{displayName}</span>
      {address && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={copyToClipboard}
          title={copied ? "已复制" : "复制地址"}
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
} 
