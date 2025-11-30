'use client'

import { motion } from 'framer-motion'
import {
    Zap, Code2, Mail, FileText, Palette, Star, ArrowRight,
    Book, ClipboardList, Projector, Search, Settings, Bug, User, Linkedin, Presentation,
    GraduationCap, Languages, Calculator, PenTool, Brain, Library,
    Image, Music, Video, Instagram, Twitter, Youtube, Mic,
    Utensils, Dumbbell, Plane, Calendar, Smile, Heart, Home,
    Server, Database, Shield, Terminal, Workflow, Cpu, Globe,
    Gem, Crown, Rocket, Sparkles, Trophy
} from 'lucide-react'
import Link from 'next/link'
import type { ToolCategory } from '@/types/ranger-groups'

const TOOL_ICONS: Record<string, any> = {
    Code2, Mail, FileText, Palette, Zap,
    Book, ClipboardList, Projector, Search, Settings, Bug, User, Linkedin, Presentation,
    GraduationCap, Languages, Calculator, PenTool, Brain, Library,
    Image, Music, Video, Instagram, Twitter, Youtube, Mic,
    Utensils, Dumbbell, Plane, Calendar, Smile, Heart, Home,
    Server, Database, Shield, Terminal, Workflow, Cpu, Globe,
    Gem, Crown, Rocket, Sparkles, Trophy
}

interface ToolCardProps {
    tool: ToolCategory
    groupColor: string
    groupName: string
}

export function ToolCard({ tool, groupColor, groupName }: ToolCardProps) {
    const IconComponent = TOOL_ICONS[tool.icon || 'Zap'] || Zap

    return (
        <Link href={tool.route_path}>
            <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative overflow-hidden rounded-2xl p-6 cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300"
                style={{
                    ['--hover-shadow' as any]: `0 20px 60px -10px ${groupColor}50`,
                    ['--hover-border' as any]: `${groupColor}80`
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 20px 60px -10px ${groupColor}50`
                    e.currentTarget.style.borderColor = `${groupColor}80`
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
            >
                {/* Hover Glow Effect */}
                <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at center, ${groupColor}20 0%, transparent 70%)`
                    }}
                />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${groupColor}20` }}
                        >
                            <IconComponent
                                className="text-2xl h-7 w-7"
                                style={{ color: groupColor }}
                            />
                        </div>
                        {tool.is_featured && (
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold border border-yellow-500/30 flex items-center">
                                <Star className="w-3 h-3 mr-1 fill-yellow-400" />
                                FEATURED
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                        {tool.display_name}
                    </h3>

                    <p className="text-gray-400 text-sm mb-6 flex-1">
                        {tool.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                        <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-yellow-400" />
                            <span className="text-white font-semibold text-sm">
                                {tool.credit_cost} Energy
                            </span>
                        </div>
                        <div
                            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                            style={{ backgroundColor: groupColor }}
                        >
                            Use Tool
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
