function AnalyticsMetricCard({ label, value, description }) {
    return (
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                {label}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-950">
                {value}
            </p>
            {description && (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                    {description}
                </p>
            )}
        </div>
    );
}

export default AnalyticsMetricCard;
