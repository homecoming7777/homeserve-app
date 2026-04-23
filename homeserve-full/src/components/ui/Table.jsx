const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((h, idx) => <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, idx) => renderRow(item, idx))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;