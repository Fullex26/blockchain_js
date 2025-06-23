import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { formatBytes32String, parseBytes32String } from 'ethers/lib/utils';
import { CONTRACT_ADDRESS, ABI } from '../lib/constants';
import { Button } from '../components/ui/button';
import { DataTable } from '../components/ui/data-table';
import { useToast } from '../components/ui/use-toast';
import Spinner from '../components/ui/spinner';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const toast = useToast();
  
  // Hydration-safe mounted state
  const [mounted, setMounted] = useState(false);
  
  const [beneficiaryAddress, setBeneficiaryAddress] = useState('');
  const [benefitType, setBenefitType] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [redemptions, setRedemptions] = useState([]);

  // Ensure component is mounted before showing wallet-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if current address is a registered vendor
  const { data: isVendor, isLoading: isCheckingVendor } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'vendors',
    args: [address],
    enabled: mounted && isConnected && !!address,
  });

  // Watch for BenefitRedeemed events for this vendor
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'BenefitRedeemed',
    args: {
      vendor: address, // Only watch for events where this address is the vendor
    },
    onLogs: (logs) => {
      fetchRedemptions();
    },
  });

  const handleRedeem = async () => {
    if (!isConnected || !address) {
      toast({ title: 'Error', description: 'Please connect your wallet first.' });
      return;
    }

    if (!isVendor) {
      toast({ title: 'Error', description: 'Your address is not a registered vendor.' });
      return;
    }
    
    try {
      setLoading(true);
      setTxStatus('');
      
      const benefitId = formatBytes32String(benefitType);
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'redeemBenefit',
        args: [benefitId, beneficiaryAddress],
      });
      
      setTxStatus('Benefit redeemed successfully');
      toast({ title: 'Success', description: 'Benefit redeemed successfully.' });
      
      // Clear form
      setBeneficiaryAddress('');
      setBenefitType('');
    } catch (err) {
      console.error('Error redeeming benefit:', err);
      setTxStatus('Error redeeming benefit');
      toast({ title: 'Error', description: 'Redemption failed.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchRedemptions = async () => {
    if (!isConnected || !address) return;
    
    try {
      console.log('Fetching redemptions for vendor:', address);
      
      const response = await fetch(`http://localhost:4000/transactions/vendor/${address}`);
      if (response.ok) {
        const redemptionsData = await response.json();
        // Transform data for display
        const transformedRedemptions = redemptionsData.map(redemption => ({
          benefitId: redemption.benefitId,
          recipient: redemption.recipientAddress,
          timestamp: redemption.redeemedAt ? new Date(redemption.redeemedAt).toLocaleString() : 'N/A'
        }));
        setRedemptions(transformedRedemptions);
      } else {
        console.error('Failed to fetch redemptions');
        setRedemptions([]);
      }
    } catch (error) {
      console.error('Error fetching redemptions:', error);
      setRedemptions([]);
    }
  };

  useEffect(() => {
    if (mounted && isConnected && address && isVendor) {
      fetchRedemptions();
    } else {
      setRedemptions([]);
    }
  }, [mounted, isConnected, address, isVendor]);

  const columns = [
    { header: 'Benefit ID', accessor: 'benefitId' },
    { header: 'Recipient', accessor: 'recipient' },
    { header: 'Timestamp', accessor: 'timestamp' }
  ];

  // Don't render wallet-dependent content until mounted
  if (!mounted) {
    return (
      <div className="max-w-xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Vendor Portal</h1>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Vendor Portal</h1>
      
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
          <p className="text-gray-600">Please connect your wallet to access vendor functions.</p>
        </div>
      ) : (
        <>
          {isCheckingVendor ? (
            <div className="text-center p-6">
              <Spinner />
              <p className="text-gray-600 mt-2">Checking vendor status...</p>
            </div>
          ) : !isVendor ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-red-900 mb-2">Not a Registered Vendor</h3>
              <p className="text-red-800">Your wallet address is not registered as a vendor.</p>
              <p className="text-sm text-red-600 mt-2">
                Contact the system administrator to register your address as a vendor.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900">✓ Verified Vendor</h3>
                <p className="text-sm text-green-800">
                  Your address is registered and authorized to redeem benefits.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Redeem Benefit</h2>
                <input
                  placeholder="Beneficiary Address"
                  value={beneficiaryAddress}
                  onChange={(e) => setBeneficiaryAddress(e.target.value)}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  placeholder="Benefit Type"
                  value={benefitType}
                  onChange={(e) => setBenefitType(e.target.value)}
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                />
                <Button 
                  onClick={handleRedeem} 
                  disabled={loading || !beneficiaryAddress || !benefitType} 
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                >
                  {loading ? <Spinner /> : 'Redeem Benefit'}
                </Button>
                
                {txStatus && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    {txStatus}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Redemption History</h2>
                {redemptions.length === 0 ? (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No redemptions found.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Benefit redemptions will appear here automatically.
                    </p>
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={redemptions}
                  />
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900">Vendor Instructions:</h3>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Verify the beneficiary's identity before redemption</li>
                  <li>• Enter the exact benefit type as specified</li>
                  <li>• Ensure the beneficiary address is correct</li>
                  <li>• All transactions are permanently recorded on the blockchain</li>
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}