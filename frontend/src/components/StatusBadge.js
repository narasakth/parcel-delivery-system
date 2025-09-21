const statusConfig = {
    CREATED: {
        bg: 'bg-gradient-to-r from-gray-100 to-gray-200',
        text: 'text-gray-700',
        border: 'border-gray-300',
        icon: '📦',
        glow: 'shadow-gray-200'
    },
    IN_HUB: {
        bg: 'bg-gradient-to-r from-blue-100 to-blue-200',
        text: 'text-blue-700',
        border: 'border-blue-300',
        icon: '🏢',
        glow: 'shadow-blue-200'
    },
    OUT_FOR_DELIVERY: {
        bg: 'bg-gradient-to-r from-amber-100 to-orange-200',
        text: 'text-amber-700',
        border: 'border-amber-300',
        icon: '🚚',
        glow: 'shadow-amber-200'
    },
    DELIVERED: {
        bg: 'bg-gradient-to-r from-emerald-100 to-green-200',
        text: 'text-emerald-700',
        border: 'border-emerald-300',
        icon: '✅',
        glow: 'shadow-emerald-200'
    },
    DELAYED: {
        bg: 'bg-gradient-to-r from-rose-100 to-red-200',
        text: 'text-rose-700',
        border: 'border-rose-300',
        icon: '⏰',
        glow: 'shadow-rose-200'
    },
    CANCELED: {
        bg: 'bg-gradient-to-r from-zinc-100 to-gray-200',
        text: 'text-zinc-700',
        border: 'border-zinc-300',
        icon: '❌',
        glow: 'shadow-zinc-200'
    },
};

const statusLabels = {
    CREATED: 'สร้างแล้ว',
    IN_HUB: 'ในคลัง',
    OUT_FOR_DELIVERY: 'กำลังจัดส่ง',
    DELIVERED: 'ส่งสำเร็จ',
    DELAYED: 'ล่าช้า',
    CANCELED: 'ยกเลิก',
};

export default function StatusBadge({ status, size = 'normal' }) {
    const config = statusConfig[status] || statusConfig.CREATED;
    const label = statusLabels[status] || status;
    
    const sizeClasses = {
        small: 'px-2 py-1 text-xs',
        normal: 'px-3 py-1.5 text-sm',
        large: 'px-4 py-2 text-base'
    };

    return (
        <span className={`
            ${sizeClasses[size]}
            ${config.bg}
            ${config.text}
            border ${config.border}
            rounded-xl font-semibold
            shadow-sm hover:shadow-md
            transition-all duration-300
            flex items-center space-x-1
            backdrop-blur-sm
            hover:scale-105
            group
        `}>
            <span className="text-sm group-hover:scale-110 transition-transform duration-300">
                {config.icon}
            </span>
            <span>{label}</span>
        </span>
    );
}
