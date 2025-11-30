'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ExternalLink, TrendingUp, DollarSign, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { AIRecommendation, AIRecommendations } from '@/types/wizard'

interface AIRecommendationCardProps {
    recommendations: AIRecommendations
    onSelect: (toolName: string) => void
    showComparison?: boolean
}

export function AIRecommendationCard({
    recommendations,
    onSelect,
    showComparison = true
}: AIRecommendationCardProps) {
    const [selectedTool, setSelectedTool] = useState<string | null>(null)

    const handleSelect = (toolName: string) => {
        setSelectedTool(toolName)
        onSelect(toolName)
    }

    const renderRecommendation = (
        recommendation: AIRecommendation,
        type: 'primary' | 'alternative' | 'budget',
        index?: number
    ) => {
        const isPrimary = type === 'primary'
        const isBudget = type === 'budget'
        const isSelected = selectedTool === recommendation.name

        return (
            <motion.div
                key={recommendation.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index || 0) * 0.1 }}
                className={`relative rounded-lg border-2 p-6 transition-all ${isPrimary
                        ? 'border-blue-500 bg-blue-50'
                        : isBudget
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                    } ${isSelected ? 'ring-4 ring-blue-200' : ''}`}
            >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            {isPrimary && (
                                <Badge className="bg-blue-600">
                                    🏆 Recommended
                                </Badge>
                            )}
                            {isBudget && (
                                <Badge className="bg-green-600">
                                    💡 Budget Option
                                </Badge>
                            )}
                            {type === 'alternative' && (
                                <Badge variant="outline">
                                    🥈 Alternative
                                </Badge>
                            )}
                        </div>
                        <h3 className="mt-2 text-xl font-bold text-gray-900">
                            {recommendation.name}
                        </h3>
                        <p className="text-sm text-gray-600">{recommendation.provider}</p>
                    </div>

                    {/* Confidence Score */}
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            <TrendingUp className="h-4 w-4" />
                            {Math.round(recommendation.confidence * 100)}%
                        </div>
                        <p className="text-xs text-gray-500">Confidence</p>
                    </div>
                </div>

                {/* Strengths */}
                <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">Strengths:</h4>
                    <ul className="space-y-1">
                        {recommendation.strengths.slice(0, 4).map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                                <span>{strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Best For */}
                <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">Best For:</h4>
                    <div className="flex flex-wrap gap-2">
                        {recommendation.bestFor.map((use, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                                {use}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="mb-4 flex items-center gap-2 rounded-md bg-white/50 p-3">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                        {recommendation.pricing}
                    </span>
                </div>

                {/* Prompt Strategy (if available) */}
                {recommendation.promptStrategy && (
                    <div className="mb-4">
                        <h4 className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
                            <Zap className="h-4 w-4" />
                            Prompt Strategy:
                        </h4>
                        <code className="block rounded bg-gray-100 p-2 text-xs text-gray-800">
                            {recommendation.promptStrategy}
                        </code>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleSelect(recommendation.name)}
                        className="flex-1"
                        variant={isSelected ? 'default' : 'outline'}
                    >
                        {isSelected ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Selected
                            </>
                        ) : (
                            'Select This Tool'
                        )}
                    </Button>

                    {recommendation.officialLink && (
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                        >
                            <a
                                href={recommendation.officialLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </Button>
                    )}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg"
                    >
                        <Check className="h-5 w-5" />
                    </motion.div>
                )}
            </motion.div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    🤖 Recommended AI Tools
                </h2>
                <p className="mt-2 text-gray-600">
                    Based on your project requirements, here are the best AI tools to use
                </p>
            </div>

            {/* Primary Recommendation */}
            {renderRecommendation(recommendations.primary, 'primary', 0)}

            {/* Alternatives */}
            {showComparison && recommendations.alternatives.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Alternative Options
                    </h3>
                    {recommendations.alternatives.map((alt, idx) =>
                        renderRecommendation(alt, 'alternative', idx + 1)
                    )}
                </div>
            )}

            {/* Budget Option */}
            {recommendations.budgetOption && (
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                        Budget-Friendly Option
                    </h3>
                    {renderRecommendation(
                        recommendations.budgetOption,
                        'budget',
                        recommendations.alternatives.length + 1
                    )}
                </div>
            )}

            {/* Comparison Note */}
            {showComparison && (
                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-700">
                        💡 <strong>Tip:</strong> You can always switch between AI tools later.
                        These recommendations are based on successful patterns from similar projects.
                    </p>
                </div>
            )}
        </div>
    )
}
