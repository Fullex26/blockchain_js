export function Badge({ status, className = '' }) {
  let colorClass = '';
  if (status === 'Issued') colorClass = 'bg-blue-100 text-blue-800';
  if (status === 'Redeemed') colorClass = 'bg-green-100 text-green-800';
  if (status === 'Expired') colorClass = 'bg-red-100 text-red-800';
  return (
    <span
      className={
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ' +
        colorClass +
        ' ' +
        className
      }
    >
      {status}
    </span>
  );
}