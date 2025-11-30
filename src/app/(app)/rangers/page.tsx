import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { motion } from 'framer-motion' // Server components can't use motion directly, need client wrapper or just static. 
// Actually, let's make it a client component for animations or just simple server component.
// Simple server component first.
import { ArrowRight, Zap, Briefcase, GraduationCap, Palette, Heart, Code, Crown } from 'lucide-react'

// Icon mapping (duplicate from dashboard, should be in a shared util)
const ICON_MAP: Record<string, any> = {
    'red_ranger': Briefcase,
    'blue_ranger': GraduationCap,
    'yellow_ranger': Palette,
    'green_ranger': Heart,
    'black_ranger': Code,
    'white_ranger': Crown
}

export default async function RangersPage() {
    const supabase = await createClient()

    const { data: groups } = await supabase
        .from('ranger_groups')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true })

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>All Rangers</h1>
                <p className="text-gray-400">Select a ranger to access their specialized tools</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups?.map((group) => {
                    const Icon = ICON_MAP[group.name] || Zap
                    return (
                        <Link key={group.id} href={`/groups/${group.name.replace('_ranger', '')}`} className="block group">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all h-full flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: `${group.color_primary}33` }}
                                    >
                                        <Icon className="h-6 w-6" style={{ color: group.color_primary }} />
                                    </div>
                                    <ArrowRight className="text-gray-500 group-hover:text-white transition-colors" />
                                </div>

                                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-orbitron)', color: group.color_primary }}>
                                    {group.display_name}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 flex-1">{group.tagline}</p>

                                <div className="flex items-center text-xs text-gray-500 bg-black/20 rounded-lg p-2 w-fit">
                                    <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                                    {group.tool_count || 0} Tools Available
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
