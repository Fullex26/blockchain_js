export function Card({ title, className = '', children }) {
  return (
    <div className={"border rounded shadow p-4 " + className}>
      {title && <h3 className="font-semibold text-lg mb-2">{title}</h3>}
      {children}
    </div>
  );
}