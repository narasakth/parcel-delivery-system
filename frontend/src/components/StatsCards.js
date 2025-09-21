export default function StatsCards({ stats }) {
    // stats: { created, inHub, outForDelivery, delivered, delayed, canceled }
    const items = [
        { 
            label: 'กำลังจัดส่ง', 
            value: stats.outForDelivery || 0,
            gradient: 'from-amber-400 to-orange-500',
            icon: '🚚',
            color: 'text-amber-600'
        },
        { 
            label: 'สำเร็จ', 
            value: stats.delivered || 0,
            gradient: 'from-emerald-400 to-green-500',
            icon: '✅',
            color: 'text-emerald-600'
        },
        { 
            label: 'ล่าช้า', 
            value: stats.delayed || 0,
            gradient: 'from-rose-400 to-red-500',
            icon: '⏰',
            color: 'text-rose-600'
        }
    ];
    
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {items.map((item, index) => (
                <div 
                    key={item.label}
                    className="group relative overflow-hidden rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-500 animate-fade-in border border-white/20 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 200}ms` }}
                >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <span className="text-xl">{item.icon}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-600 mb-1">{item.label}</div>
                                <div className={`text-3xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                                    {item.value}
                                </div>
                            </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                                className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-1000 ease-out`}
                                style={{ 
                                    width: `${Math.min((item.value / Math.max(...items.map(i => i.value), 1)) * 100, 100)}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                    
                    {/* Floating elements */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-pulse-slow"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-bounce-subtle"></div>
                </div>
            ))}
        </div>
    );
}
