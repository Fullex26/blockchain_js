import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ABI, RPC_URL } from '../lib/constants';
import { Button } from '../components/ui/button';
import { DataTable } from '../components/ui/data-table';
import { useToast } from '../components/ui/use-toast';

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [benefitType, setBenefitType] = useState('');
  const [value, setValue] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [benefits, setBenefits] = useState([]);
  const [vendorAddress, setVendorAddress] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const toast = useToast();

  useEffect(() => {
    const initProvider = () => {
      if (window.ethereum) {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(prov);
      } else {
        const prov = new ethers.providers.JsonRpcProvider(RPC_URL);
        setProvider(prov);
      }
    };
    initProvider();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is required');
      return;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const s = provider.getSigner();
    setSigner(s);
    const address = await s.getAddress();
    setAccount(address);
    const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, s);
    setContract(c);
  };

  const fetchBenefits = async () => {
    if (!contract) return;
    const filter = contract.filters.BenefitIssued();
    const logs = await contract.queryFilter(filter);
    const items = await Promise.all(
      logs.map(async (log) => {
        const benefitId = log.args.benefitId;
        const b = await contract.benefits(benefitId);
        return {
          benefitId,
          recipient: log.args.recipient,
          value: b.value.toString(),
          expiration: new Date(b.expiration.toNumber() * 1000).toLocaleString(),
          status: ['Issued', 'Redeemed', 'Expired'][b.status]
        };
      })
    );
    setBenefits(items);
  };

  useEffect(() => {
    if (contract) fetchBenefits();
  }, [contract]);

  const handleIssueBenefit = async () => {
    if (!contract) return;
    try {
      setTxStatus('Pending...');
      const bid = ethers.utils.formatBytes32String(benefitType);
      const exp = Math.floor(new Date(expirationDate).getTime() / 1000);
      const tx = await contract.issueBenefit(recipient, bid, value, exp);
      await tx.wait();
      setTxStatus('Benefit issued');
      toast({ title: 'Success', description: 'Benefit issued.' });
      fetchBenefits();
    } catch (err) {
      console.error(err);
      setTxStatus('Error issuing benefit');
    }
  };

  const handleAddVendor = async () => {
    if (!contract) return;
    try {
      setTxStatus('Pending...');
      const tx = await contract.addVendor(vendorAddress);
      await tx.wait();
      setTxStatus('Vendor added');
      toast({ title: 'Success', description: 'Vendor added.' });
    } catch (err) {
      console.error(err);
      setTxStatus('Error adding vendor');
    }
  };

  const handleRemoveVendor = async () => {
    if (!contract) return;
    try {
      setTxStatus('Pending...');
      const tx = await contract.removeVendor(vendorAddress);
      await tx.wait();
      setTxStatus('Vendor removed');
      toast({ title: 'Success', description: 'Vendor removed.' });
    } catch (err) {
      console.error(err);
      setTxStatus('Error removing vendor');
    }
  };

  const columns = [
    { header: 'Benefit ID', accessor: 'benefitId' },
    { header: 'Recipient', accessor: 'recipient' },
    { header: 'Value', accessor: 'value' },
    { header: 'Expiration', accessor: 'expiration' },
    { header: 'Status', accessor: 'status' }
  ];
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Portal</h1>
      {!account ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <div>Connected: {account}</div>
      )}

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

      {txStatus && <div className="mt-4">{txStatus}</div>}

      <div>
        <h2 className="text-xl font-semibold">Issued Benefits</h2>
        <DataTable
          columns={columns}
          data={benefits.map((b) => ({
            benefitId: ethers.utils.parseBytes32String(b.benefitId),
            recipient: b.recipient,
            value: b.value,
            expiration: b.expiration,
            status: b.status
          }))}
        />
      </div>
    </div>
  );
}