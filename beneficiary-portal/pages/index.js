import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { parseBytes32String } from 'ethers/lib/utils';
import { CONTRACT_ADDRESS, ABI } from '../lib/constants';
import { Card } from '../components/ui/card';
import { VCCard } from '../components/ui/vc-card';
import { Badge } from '../components/ui/badge';

export default function Home() {
  const { address, isConnected } = useAccount();
  
  // Hydration-safe mounted state
  const [mounted, setMounted] = useState(false);
  const [benefits, setBenefits] = useState([]);

  const mockVCs = [
    { id: 1, name: 'Proof of Identity', issuer: 'Government of Australia' },
    { id: 2, name: 'JobSeeker Eligibility', issuer: 'Welfare Platform' }
  ];

  // Ensure component is mounted before showing wallet-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Watch for BenefitIssued events for this specific beneficiary
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'BenefitIssued',
    args: {
      recipient: address, // Only watch for events where this user is the recipient
    },
    onLogs: (logs) => {
      fetchBenefits();
    },
  });

  // Watch for BenefitRedeemed events for this specific beneficiary
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'BenefitRedeemed',
    args: {
      recipient: address, // Only watch for events where this user is the recipient
    },
    onLogs: (logs) => {
      fetchBenefits();
    },
  });

  const fetchBenefits = async () => {
    if (!isConnected || !address) return;
    
    try {
      console.log('Fetching benefits for address:', address);
      
      const response = await fetch(`http://localhost:4000/api/benefits/${address}`);
      if (response.ok) {
        const benefitsData = await response.json();
        // Transform the data for display
        const transformedBenefits = benefitsData.map(benefit => ({
          benefitId: parseBytes32String(benefit.benefitId),
          value: benefit.value.toString(),
          expiration: new Date(benefit.expiresAt).toLocaleDateString(),
          status: benefit.status
        }));
        setBenefits(transformedBenefits);
      } else {
        console.error('Failed to fetch benefits');
        setBenefits([]);
      }
    } catch (error) {
      console.error('Error fetching benefits:', error);
      setBenefits([]);
    }
  };

  useEffect(() => {
    if (mounted && isConnected && address) {
      fetchBenefits();
    } else {
      setBenefits([]);
    }
  }, [mounted, isConnected, address]);

  // Don't render wallet-dependent content until mounted
  if (!mounted) {
    return (
      <div className="max-w-xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Beneficiary Portal</h1>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Beneficiary Portal</h1>
      
      <div className="flex justify-between items-center">
        <ConnectButton />
        {isConnected && address && (
          <div className="text-sm text-gray-600">
            Connected as: {address}
          </div>
        )}
      </div>

      {!isConnected ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Please connect your wallet to view your benefits and credentials.</p>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-semibold mb-4">Verifiable Credentials</h2>
            <div className="space-y-3">
              {mockVCs.map((vc) => (
                <VCCard key={vc.id} name={vc.name} issuer={vc.issuer} />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              In a production system, these would be real verifiable credentials stored in your digital wallet.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Your Benefits</h2>
            {benefits.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No benefits found for your address.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Benefits issued to your wallet address will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, i) => (
                  <Card key={i} title={benefit.benefitId}>
                    <p className="text-sm">Value: {benefit.value}</p>
                    <p className="text-sm">Expires: {benefit.expiration}</p>
                    <div className="mt-2">
                      <Badge status={benefit.status} />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900">How it works:</h3>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Benefits are issued directly to your wallet address</li>
              <li>• You can redeem benefits at registered vendor locations</li>
              <li>• All transactions are recorded on the blockchain for transparency</li>
              <li>• Your verifiable credentials prove your eligibility</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}