import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ABI, RPC_URL } from '../lib/constants';
import { Button } from '../components/ui/button';
import { DataTable } from '../components/ui/data-table';
import { useToast } from '../components/ui/use-toast';
import Spinner from '../components/ui/spinner';

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isVendor, setIsVendor] = useState(false);
  const [beneficiaryAddress, setBeneficiaryAddress] = useState('');
  const [benefitType, setBenefitType] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [redemptions, setRedemptions] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);
    } else {
      const prov = new ethers.providers.JsonRpcProvider(RPC_URL);
      setProvider(prov);
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask required');
      return;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const s = provider.getSigner();
    setSigner(s);
    const address = await s.getAddress();
    setAccount(address);
    const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, s);
    setContract(c);
    const vendorStatus = await c.vendors(address);
    setIsVendor(vendorStatus);
    if (vendorStatus) fetchRedemptions(c, address);
  };

  const handleRedeem = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      setTxStatus('');
      const bid = ethers.utils.formatBytes32String(benefitType);
      const tx = await contract.redeemBenefit(bid, beneficiaryAddress);
      await tx.wait();
      setTxStatus('Benefit redeemed');
      toast({ title: 'Success', description: 'Benefit redeemed.' });
      fetchRedemptions(contract, account);
    } catch (err) {
      console.error(err);
      setTxStatus('Error redeeming benefit');
      toast({ title: 'Error', description: 'Redemption failed.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchRedemptions = async (c, addr) => {
    const filter = c.filters.BenefitRedeemed(null, null, addr);
    const logs = await c.queryFilter(filter);
    const items = await Promise.all(
      logs.map(async (log) => {
        const block = await provider.getBlock(log.blockNumber);
        return {
          benefitId: log.args.benefitId,
          recipient: log.args.recipient,
          timestamp: new Date(block.timestamp * 1000).toLocaleString()
        };
      })
    );
    setRedemptions(items);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vendor Portal</h1>
      {!account ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <div>Connected: {account}</div>
      )}

      {account && !isVendor && (
        <div className="mt-6 text-red-600">Your address is not a registered vendor.</div>
      )}

      {account && isVendor && (
        <>
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
            <Button onClick={handleRedeem} disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? <Spinner /> : 'Redeem'}
            </Button>
            {txStatus && <div>{txStatus}</div>}
          </div>

          <div>
            <h2 className="text-xl font-semibold">Redemption History</h2>
            <DataTable
              columns={[
                { header: 'Benefit ID', accessor: 'benefitId' },
                { header: 'Recipient', accessor: 'recipient' },
                { header: 'Timestamp', accessor: 'timestamp' }
              ]}
              data={redemptions.map((r) => ({
                benefitId: ethers.utils.parseBytes32String(r.benefitId),
                recipient: r.recipient,
                timestamp: r.timestamp
              }))}
            />
          </div>
        </>
      )}
    </div>
  );
}