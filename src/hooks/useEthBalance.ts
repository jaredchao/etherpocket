import { useState, useEffect, useCallback } from 'react';
import { useBalance, useBlockNumber } from 'wagmi';
import { formatUnits } from 'viem';
import { useInterval } from 'ahooks';

/**
 * ETH余额查询钩子，支持自动更新和格式化
 * @param address 钱包地址
 * @param autoRefreshInterval 自动刷新间隔（毫秒），默认30秒，设为0禁用自动刷新
 */
export function useEthBalance(
  address: `0x${string}` | undefined,
  autoRefreshInterval: number = 30000
) {
  // ETH余额查询
  const { 
    data: balanceData, 
    isError, 
    isLoading, 
    refetch 
  } = useBalance({
    address,
    query: {
      enabled: !!address,
      // 不必设置staleTime，将由我们自己控制刷新
    }
  });

  // 监听区块变化（可选，用于自动刷新）
  const { data: blockNumber } = useBlockNumber({ 
    watch: true, 
    query: { 
      enabled: autoRefreshInterval > 0 
    } 
  });

  // 添加最后更新时间
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // 添加自定义格式化余额
  const [formattedBalance, setFormattedBalance] = useState<string>('0');
  
  // 刷新余额的处理函数
  const refreshBalance = useCallback(async () => {
    if (address) {
      await refetch();
      setLastUpdated(new Date());
    }
  }, [address, refetch]);

  // 当区块变化时，刷新余额
  useEffect(() => {
    if (blockNumber && autoRefreshInterval > 0) {
      refreshBalance();
    }
  }, [blockNumber, refreshBalance, autoRefreshInterval]);

  // 使用ahooks的useInterval替代手动设置定时器
  useInterval(
    refreshBalance,
    address && autoRefreshInterval > 0 ? autoRefreshInterval : null
  );

  // 当余额数据更新时，更新格式化的余额
  useEffect(() => {
    if (balanceData) {
      // 使用viem的formatUnits格式化，保留最多6位小数
      const formatted = formatUnits(balanceData.value, balanceData.decimals);
      
      // 处理格式，去除末尾多余的0
      const cleanFormatted = Number(formatted).toLocaleString(undefined, {
        maximumFractionDigits: 6,
        minimumFractionDigits: 0
      });
      
      setFormattedBalance(cleanFormatted);
      setLastUpdated(new Date());
    } else {
      setFormattedBalance('0');
    }
  }, [balanceData]);

  return {
    balance: balanceData?.value,
    formatted: formattedBalance,
    symbol: balanceData?.symbol || 'ETH',
    decimals: balanceData?.decimals || 18,
    lastUpdated,
    isLoading,
    isError,
    refetch: refreshBalance
  };
}
