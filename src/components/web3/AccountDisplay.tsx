import { Button } from '@/components/ui/button';
import { CopyIcon } from '@radix-ui/react-icons';
import { useAccount, useEnsName } from 'wagmi';

export function AccountDisplay() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span>{ensName || (address ? formatAddress(address) : 'Not Connected')}</span>
      {address && (
        <Button variant="ghost" size="icon" onClick={copyToClipboard}>
          <CopyIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 
