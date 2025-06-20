
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ABI, RPC_URL } from '../lib/constants';
import { Card } from '../components/ui/card';
import { VCCard } from '../components/ui/vc-card';
import { Badge } from '../components/ui/badge';

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [benefits, setBenefits] = useState([]);

  const mockVCs = [
    { id: 1, name: 'Proof of Identity', issuer: 'Government of Australia' },
    { id: 2, name: 'JobSeeker Eligibility', issuer: 'Welfare Platform' }
  ];

  useEffect(() => {
    const init = () => {
      if (window.ethereum) {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(prov);
      } else {
        const prov = new ethers.providers.JsonRpcProvider(RPC_URL);
        setProvider(prov);
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask required');
      return;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
    const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    setContract(c);
  };

  const fetchBenefits = async () => {
    if (!contract || !account) return;
    const filter = contract.filters.BenefitIssued(null, account);
    const logs = await contract.queryFilter(filter);
    const items = await Promise.all(logs.map(async (log) => {
      const benefitId = log.args.benefitId;
      const b = await contract.benefits(benefitId);
      return {
        benefitId,
        value: b.value.toString(),
        expiration: new Date(b.expiration.toNumber() * 1000).toLocaleString(),
        status: ['Issued','Redeemed','Expired'][b.status]
      };
    }));
    setBenefits(items);
  };

  useEffect(() => {
    if (contract && account) fetchBenefits();
  }, [contract, account]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Beneficiary Portal</h1>
      {!account ? (
        <button onClick={connectWallet} className="px-4 py-2 bg-blue-600 text-white rounded">
          Connect Wallet
        </button>
      ) : (
        <div>Connected: {account}</div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Verifiable Credentials (Mock)</h2>
        {mockVCs.map((vc) => (
          <VCCard key={vc.id} name={vc.name} issuer={vc.issuer} />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((b, i) => (
            <Card key={i} title={ethers.utils.parseBytes32String(b.benefitId)}>
              <p>Value: {b.value}</p>
              <p>Expires: {b.expiration}</p>
              <Badge status={b.status} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}