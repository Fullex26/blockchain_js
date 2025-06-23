import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { formatBytes32String, parseBytes32String } from 'ethers/lib/utils';
import { CONTRACT_ADDRESS, ABI } from '../lib/constants';
import { Button } from '../components/ui/button';
import { DataTable } from '../components/ui/data-table';
import { useToast } from '../components/ui/use-toast';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const toast = useToast();
  
  // Hydration-safe mounted state
  const [mounted, setMounted] = useState(false);
  
  const [recipient, setRecipient] = useState('');
  const [benefitType, setBenefitType] = useState('');
  const [value, setValue] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [benefits, setBenefits] = useState([]);
  const [vendorAddress, setVendorAddress] = useState('');
  const [txStatus, setTxStatus] = useState('');

  // Ensure component is mounted before showing wallet-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch benefits on mount and when connected
  useEffect(() => {
    if (mounted && isConnected) {
      fetchBenefits();
    }
  }, [mounted, isConnected]);

  // Watch for BenefitIssued events to update the benefits list
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'BenefitIssued',
    onLogs: (logs) => {
      fetchBenefits();
    },
  });

  const fetchBenefits = async () => {
    try {
      const response = await fetch('http://localhost:4000/benefits/all');
      if (response.ok) {
        const data = await response.json();
        // Transform data for display
        const transformedData = data.map(benefit => ({
          benefitId: benefit.benefitId,
          recipient: benefit.recipientAddress,
          value: benefit.value.toString(),
          expiration: new Date(benefit.expiresAt).toLocaleDateString(),
          status: benefit.status
        }));
        setBenefits(transformedData);
      } else {
        console.error('Failed to fetch benefits');
      }
    } catch (error) {
      console.error('Error fetching benefits:', error);
    }
  };

  const handleIssueBenefit = async () => {
    if (!isConnected || !address) {
      toast({ title: 'Error', description: 'Please connect your wallet first.' });
      return;
    }
    
    try {
      setTxStatus('Pending...');
      const benefitId = formatBytes32String(benefitType);
      const expiration = Math.floor(new Date(expirationDate).getTime() / 1000);
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'issueBenefit',
        args: [recipient, benefitId, value, expiration],
      });
      
      setTxStatus('Benefit issued successfully');
      toast({ title: 'Success', description: 'Benefit issued successfully.' });
      
      // Clear form
      setRecipient('');
      setBenefitType('');
      setValue('');
      setExpirationDate('');
    } catch (err) {
      console.error('Error issuing benefit:', err);
      setTxStatus('Error issuing benefit');
      toast({ title: 'Error', description: 'Failed to issue benefit.' });
    }
  };

  const handleAddVendor = async () => {
    if (!isConnected || !address) {
      toast({ title: 'Error', description: 'Please connect your wallet first.' });
      return;
    }
    
    try {
      setTxStatus('Pending...');
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'addVendor',
        args: [vendorAddress],
      });
      
      setTxStatus('Vendor added successfully');
      toast({ title: 'Success', description: 'Vendor added successfully.' });
      setVendorAddress('');
    } catch (err) {
      console.error('Error adding vendor:', err);
      setTxStatus('Error adding vendor');
      toast({ title: 'Error', description: 'Failed to add vendor.' });
    }
  };

  const handleRemoveVendor = async () => {
    if (!isConnected || !address) {
      toast({ title: 'Error', description: 'Please connect your wallet first.' });
      return;
    }
    
    try {
      setTxStatus('Pending...');
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'removeVendor',
        args: [vendorAddress],
      });
      
      setTxStatus('Vendor removed successfully');
      toast({ title: 'Success', description: 'Vendor removed successfully.' });
      setVendorAddress('');
    } catch (err) {
      console.error('Error removing vendor:', err);
      setTxStatus('Error removing vendor');
      toast({ title: 'Error', description: 'Failed to remove vendor.' });
    }
  };

  const columns = [
    { header: 'Benefit ID', accessor: 'benefitId' },
    { header: 'Recipient', accessor: 'recipient' },
    { header: 'Value', accessor: 'value' },
    { header: 'Expiration', accessor: 'expiration' },
    { header: 'Status', accessor: 'status' }
  ];

  // Don't render wallet-dependent content until mounted
  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Admin Portal</h1>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Portal</h1>
      
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
          <p className="text-gray-600">Please connect your wallet to access admin functions.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Issue Benefit</h2>
            <input
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              placeholder="Benefit Type"
              value={benefitType}
              onChange={(e) => setBenefitType(e.target.value)}
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              placeholder="Value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              placeholder="Expiration Date"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
            <Button onClick={handleIssueBenefit} className="bg-green-600 hover:bg-green-700">
              Issue Benefit
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Manage Vendors</h2>
            <input
              placeholder="Vendor Address"
              value={vendorAddress}
              onChange={(e) => setVendorAddress(e.target.value)}
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
            <div className="flex space-x-2">
              <Button onClick={handleAddVendor} className="bg-green-600 hover:bg-green-700">
                Add Vendor
              </Button>
              <Button onClick={handleRemoveVendor} className="bg-red-600 hover:bg-red-700">
                Remove Vendor
              </Button>
            </div>
          </div>

          {txStatus && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              {txStatus}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold">Issued Benefits</h2>
            <p className="text-sm text-gray-600 mb-4">
              Benefits will appear here as they are issued. For a complete list, check your backend API.
            </p>
            <DataTable
              columns={columns}
              data={benefits}
            />
          </div>
        </>
      )}
    </div>
  );
}