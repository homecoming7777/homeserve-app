export default function StarsInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="rounded-md p-1 hover:bg-gray-100"
          aria-label={`${n} star`}
        >
          <span className={n <= value ? 'text-yellow-500' : 'text-gray-300'}>★</span>
        </button>
      ))}
      <span className="ml-2 text-xs text-gray-500">{value}/5</span>
    </div>
  );
}

