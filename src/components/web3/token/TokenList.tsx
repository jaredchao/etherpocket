import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useTokenList } from '@/hooks/useTokenList';
import { TokenBalance } from './TokenBalance';
import { TokenAdd } from './TokenAdd';

interface TokenListProps {
  address: `0x${string}` | undefined;
}

export function TokenList({ address }: TokenListProps) {
  const { tokens, removeToken, clearTokens } = useTokenList();
  const [showAddToken, setShowAddToken] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">代币</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAddToken(true)}
            title="添加代币"
          >
            <Plus className="h-4 w-4 mr-2" />
            添加代币
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddToken && (
          <div className="mb-4 border rounded-md p-4 bg-muted/20">
            <TokenAdd 
              onSuccess={() => setShowAddToken(false)} 
              onCancel={() => setShowAddToken(false)} 
            />
          </div>
        )}

        {tokens.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>暂无代币，请添加代币</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tokens.map((token) => (
              <div key={token.address} className="flex items-center justify-between p-4 border rounded-md">
                <TokenBalance token={token} address={address} />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeToken(token.address)}
                  title="删除代币"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {tokens.length > 0 && (
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs text-muted-foreground"
                  onClick={clearTokens}
                >
                  清空列表
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
