import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useTokenList } from '@/hooks/useTokenList';
import { isAddress } from 'viem';

interface TokenAddProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TokenAdd({ onSuccess, onCancel }: TokenAddProps) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const { addToken, loading, error } = useTokenList();

  // 处理地址格式验证
  const validateAddress = (address: string) => {
    if (!address) {
      setAddressError('请输入代币地址');
      return false;
    }
    
    if (!address.startsWith('0x')) {
      setAddressError('地址必须以0x开头');
      return false;
    }
    
    if (!isAddress(address)) {
      setAddressError('无效的以太坊地址');
      return false;
    }
    
    setAddressError('');
    return true;
  };

  // 提交表单处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAddress(tokenAddress)) {
      return;
    }

    const success = await addToken(tokenAddress as `0x${string}`);
    if (success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="tokenAddress" className="block text-sm font-medium mb-1">
          代币合约地址
        </label>
        <Input
          id="tokenAddress"
          placeholder="0x..."
          value={tokenAddress}
          onChange={(e) => {
            setTokenAddress(e.target.value);
            if (e.target.value) validateAddress(e.target.value);
          }}
          className={addressError ? 'border-red-500' : ''}
        />
        {addressError && (
          <p className="mt-1 text-xs text-red-500 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" /> {addressError}
          </p>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1" /> {error}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          取消
        </Button>
        <Button 
          type="submit" 
          disabled={loading || !!addressError}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              添加中...
            </>
          ) : (
            '添加代币'
          )}
        </Button>
      </div>
    </form>
  );
} 
