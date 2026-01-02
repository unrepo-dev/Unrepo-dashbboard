'use client';

import { useMemo, useEffect } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  );

  // Prevent wallet auto-connect popup by checking if user was previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (!wasConnected) {
      // Don't auto-connect if user never connected before
      const phantomAdapter = wallets[0];
      if (phantomAdapter && 'autoConnect' in phantomAdapter) {
        (phantomAdapter as any).autoConnect = false;
      }
    }
  }, [wallets]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
