// Token类型定义
export interface Token {
  address: `0x${string}`; // 代币合约地址（确保是有效的以太坊地址格式）
  symbol: string;         // 代币符号
  decimals: number;       // 代币小数位
  name?: string;          // 代币名称（可选）
  balance?: bigint;       // 代币余额（可选）
  logoURI?: string;       // 代币图标URI（可选）
} 
