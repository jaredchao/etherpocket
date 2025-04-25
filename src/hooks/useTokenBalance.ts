import { useState, useEffect, useCallback } from 'react';
import { useReadContract, useBlockNumber } from 'wagmi';
import { formatUnits } from 'viem';
import { erc20Abi } from 'viem';
import { Token } from '@/types/token';
import { useInterval } from 'ahooks';

/**
 * 代币余额查询钩子函数，用于查询ERC-20代币余额
 * @param token 代币信息
 * @param address 钱包地址
 * @param autoRefreshInterval 自动刷新间隔（毫秒），默认30秒，设为0禁用自动刷新
 */
export function useTokenBalance(
  token: Token,
  address: `0x${string}` | undefined,
  autoRefreshInterval: number = 30000
) {
  // 使用Contract读取代币余额
  const { 
    data: balance, 
    isError, 
    isLoading, 
    refetch 
  } = useReadContract({
    address: token.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!address && !!token.address,
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
    if (address && token.address) {
      await refetch();
      setLastUpdated(new Date());
    }
  }, [address, token.address, refetch]);

  // 当区块变化时，刷新余额
  useEffect(() => {
    if (blockNumber && autoRefreshInterval > 0) {
      refreshBalance();
    }
  }, [blockNumber, refreshBalance, autoRefreshInterval]);

  // 使用ahooks的useInterval替代手动设置定时器
  useInterval(
    refreshBalance,
    address && token.address && autoRefreshInterval > 0 ? autoRefreshInterval : null
  );

  // 当余额数据更新时，更新格式化的余额
  useEffect(() => {
    if (balance !== undefined) {
      // 使用viem的formatUnits格式化
      const formatted = formatUnits(balance as bigint, token.decimals);
      
      // 处理格式，去除末尾多余的0
      const cleanFormatted = Number(formatted).toLocaleString(undefined, {
        maximumFractionDigits: token.decimals > 6 ? 6 : token.decimals,
        minimumFractionDigits: 0
      });
      
      setFormattedBalance(cleanFormatted);
      setLastUpdated(new Date());
    } else {
      setFormattedBalance('0');
    }
  }, [balance, token.decimals]);

  return {
    balance: balance as bigint | undefined,
    formatted: formattedBalance,
    symbol: token.symbol,
    decimals: token.decimals,
    lastUpdated,
    isLoading,
    isError,
    refetch: refreshBalance
  };
} 
