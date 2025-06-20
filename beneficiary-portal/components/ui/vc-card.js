export function VCCard({ name, issuer, className = '' }) {
  return (
    <div className={"border-l-4 border-blue-500 bg-white shadow p-4 mb-4 " + className}>
      <div className="font-bold text-sm text-gray-500">{issuer}</div>
      <div className="text-lg font-semibold">{name}</div>
    </div>
  );
}