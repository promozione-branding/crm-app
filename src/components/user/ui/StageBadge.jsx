const stageStyles = {
    new: 'bg-cyan-500/10 text-cyan-600',
    contacted: 'bg-yellow-500/10 text-yellow-600',
    qualified: 'bg-violet-500/10 text-violet-600',
    proposal_sent: 'bg-orange-500/10 text-orange-600',
    negotiation: 'bg-pink-500/10 text-pink-600',
    won: 'bg-green-500/10 text-green-600',
    lost: 'bg-red-500/10 text-red-600',
};

const formatStage = (stage) => {
    if (!stage) return '—';

    return stage.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function StageBadge({ stage }) {
    const styles = stageStyles[stage?.toLowerCase()] || 'bg-gray-500/10 text-gray-600';

    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles}`}>{formatStage(stage)}</span>;
}
