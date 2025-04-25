import { useState } from 'react';
import { usePublicClient } from 'wagmi';
import { erc20Abi } from 'viem';
import { useLocalStorage } from './useLocalStorage';
import { Token } from '@/types/token';

/**
 * 代币列表管理钩子，用于管理ERC-20代币
 */
export function useTokenList() {
  const [tokens, setTokens, removeTokens] = useLocalStorage<Token[]>('tokens', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const publicClient = usePublicClient();

  /**
   * 添加代币
   * @param address 代币合约地址
   * @returns 是否添加成功
   */
  const addToken = async (address: `0x${string}`) => {
    // 检查地址格式
    if (!address || !address.startsWith('0x')) {
      setError('无效的代币地址');
      return false;
    }
    
    // 检查是否已添加
    if (tokens.some(token => token.address.toLowerCase() === address.toLowerCase())) {
      setError('该代币已添加');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 读取代币信息
      if (!publicClient) {
        throw new Error('区块链客户端未初始化');
      }

      // 使用viem的多调用读取代币信息
      const [symbol, decimals, name] = await Promise.all([
        publicClient.readContract({
          address,
          abi: erc20Abi,
          functionName: 'symbol',
        }),
        publicClient.readContract({
          address,
          abi: erc20Abi,
          functionName: 'decimals',
        }),
        publicClient.readContract({
          address,
          abi: erc20Abi,
          functionName: 'name',
        }).catch(() => '') // name可能不是必须的
      ]);

      // 添加到列表
      const newToken: Token = {
        address,
        symbol,
        decimals,
        name: name || undefined,
      };
      
      setTokens(prev => [...prev, newToken]);
      return true;
    } catch (err) {
      console.error('添加代币失败:', err);
      setError(err instanceof Error ? err.message : '添加代币失败');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 移除代币
   * @param address 代币合约地址
   */
  const removeToken = (address: `0x${string}`) => {
    setTokens(prev => prev.filter(token => token.address !== address));
  };

  /**
   * 清空代币列表
   */
  const clearTokens = () => {
    removeTokens();
  };

  return {
    tokens,
    loading,
    error,
    addToken,
    removeToken,
    clearTokens,
  };
} 
