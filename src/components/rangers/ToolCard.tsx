'use client'

import { motion } from 'framer-motion'
import { Zap, Code2, Mail, FileText, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import type { ToolCategory } from '@/types/ranger-groups'

const TOOL_ICONS: Record<string, any> = {
    Code2,
    Mail,
    FileText,
    Palette,
    Zap
}

interface ToolCardProps {
    tool: ToolCategory
    groupColor: string
    groupName: string
}

export function ToolCard({ tool, groupColor, groupName }: ToolCardProps) {
    const router = useRouter()
    const IconComponent = TOOL_ICONS[tool.icon || 'Zap']

    const handleLaunch = () => {
        // Navigate to the tool
        router.push(tool.route_path)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative"
        >
            <div
                className="rounded-2xl border-2 border-gray-700 hover:border-opacity-100 bg-gray-900 p-6 transition-all duration-300 h-full flex flex-col"
                style={{
                    borderColor: groupColor + '40',
                    ['--group-color' as any]: groupColor
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = groupColor
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = groupColor + '40'
                }}
            >
                {/* Featured Badge */}
                {tool.is_featured && (
                    <div className="absolute -top-3 -right-3">
                        <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            ⭐ FEATURED
                        </span>
                    </div>
                )}

                {/* Tool Icon */}
                <div
                    className="mb-4 p-4 rounded-lg transition-all duration-300"
                    style={{
                        backgroundColor: groupColor + '20'
                    }}
                >
                    <IconComponent
                        className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: groupColor }}
                    />
                </div>

                {/* Tool Name */}
                <h3 className="text-xl font-bold text-white mb-2">
                    {tool.display_name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4 flex-1">
                    {tool.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-300 font-medium">
                            {tool.credit_cost} Energy
                        </span>
                    </div>

                    <Button
                        className="transition-all duration-300"
                        style={{
                            backgroundColor: groupColor,
                            color: 'white'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = groupColor + 'dd'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = groupColor
                        }}
                        onClick={handleLaunch}
                    >
                        Launch
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
