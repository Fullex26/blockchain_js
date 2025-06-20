import { useState, useMemo } from 'react';

export function DataTable({ columns, data }) {
  const [sortConfig, setSortConfig] = useState(null);
  const [filterValue, setFilterValue] = useState('');

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        columns.some((col) =>
          row[col.accessor]
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        )
      ),
    [data, filterValue, columns]
  );

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    const { key, direction } = sortConfig;
    return [...filteredData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return direction === 'ascending' ? -1 : 1;
      if (aVal > bVal) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Search..."
        className="px-3 py-2 border rounded w-full"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                onClick={() => requestSort(col.accessor)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none"
              >
                {col.header}
                {sortConfig?.key === col.accessor ? (
                  sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽'
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}