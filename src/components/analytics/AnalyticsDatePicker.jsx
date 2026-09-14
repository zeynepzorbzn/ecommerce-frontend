function AnalyticsDatePicker({ value, onChange, maxDate }) {
    return (
        <label className="flex items-center gap-3 text-sm">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                Tarih
            </span>
            <input
                type="date"
                value={value}
                max={maxDate}
                onChange={(event) => onChange(event.target.value)}
                className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black"
            />
        </label>
    );
}

export default AnalyticsDatePicker;
