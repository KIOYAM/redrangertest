'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import type { WizardStep } from '@/types/wizard'

interface UniversalWizardProps {
    toolName: string
    steps: WizardStep[]
    projectId?: string
    onComplete: (answers: Record<string, any>) => void
    onSave?: (answers: Record<string, any>) => void
    saveProgress?: boolean
    showProgressBar?: boolean
}

export function UniversalWizard({
    toolName,
    steps,
    projectId,
    onComplete,
    onSave,
    saveProgress = false,
    showProgressBar = true
}: UniversalWizardProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSaving, setIsSaving] = useState(false)

    const currentStep = steps[currentStepIndex]
    const progress = ((currentStepIndex + 1) / steps.length) * 100

    const handleAnswer = (stepId: string, value: any) => {
        const newAnswers = { ...answers, [stepId]: value }
        setAnswers(newAnswers)

        // Clear error for this step
        if (errors[stepId]) {
            setErrors({ ...errors, [stepId]: '' })
        }

        // Auto-save if enabled
        if (saveProgress && onSave) {
            onSave(newAnswers)
        }
    }

    const validateCurrentStep = (): boolean => {
        if (!currentStep.validation) return true

        const error = currentStep.validation(answers[currentStep.id])
        if (error) {
            setErrors({ ...errors, [currentStep.id]: error })
            return false
        }
        return true
    }

    const handleNext = () => {
        if (!validateCurrentStep()) return

        // Check if there's conditional routing
        if (currentStep.getNextStep) {
            const nextStepId = currentStep.getNextStep(
                answers[currentStep.id],
                answers
            )

            if (nextStepId) {
                const nextIndex = steps.findIndex(s => s.id === nextStepId)
                if (nextIndex !== -1) {
                    setCurrentStepIndex(nextIndex)
                    return
                }
            }
        }

        // Normal linear progression
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1)
        } else {
            handleComplete()
        }
    }

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1)
        }
    }

    const handleComplete = async () => {
        if (!validateCurrentStep()) return

        setIsSaving(true)
        try {
            await onComplete(answers)
        } finally {
            setIsSaving(false)
        }
    }

    const renderInput = () => {
        const currentValue = answers[currentStep.id] || currentStep.defaultValue

        switch (currentStep.inputType) {
            case 'single-choice':
                return (
                    <RadioGroup
                        value={currentValue}
                        onValueChange={(value) => handleAnswer(currentStep.id, value)}
                    >
                        <div className="space-y-3">
                            {currentStep.options?.map((option) => (
                                <div key={option.value} className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <div className="flex-1">
                                        <Label htmlFor={option.value} className="cursor-pointer">
                                            <div className="font-medium">{option.label}</div>
                                            {option.description && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {option.description}
                                                </p>
                                            )}
                                        </Label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                )

            case 'multi-choice':
                const selectedValues = currentValue || []
                return (
                    <div className="space-y-3">
                        {currentStep.options?.map((option) => (
                            <div key={option.value} className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                                <Checkbox
                                    id={option.value}
                                    checked={selectedValues.includes(option.value)}
                                    onCheckedChange={(checked) => {
                                        const newValues = checked
                                            ? [...selectedValues, option.value]
                                            : selectedValues.filter((v: string) => v !== option.value)
                                        handleAnswer(currentStep.id, newValues)
                                    }}
                                />
                                <div className="flex-1">
                                    <Label htmlFor={option.value} className="cursor-pointer">
                                        <div className="font-medium">{option.label}</div>
                                        {option.description && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {option.description}
                                            </p>
                                        )}
                                    </Label>
                                </div>
                            </div>
                        ))}
                    </div>
                )

            case 'text':
                return (
                    <Input
                        value={currentValue || ''}
                        onChange={(e) => handleAnswer(currentStep.id, e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full"
                    />
                )

            case 'textarea':
                return (
                    <Textarea
                        value={currentValue || ''}
                        onChange={(e) => handleAnswer(currentStep.id, e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full min-h-[120px]"
                    />
                )

            case 'slider':
                return (
                    <div className="space-y-4">
                        <Slider
                            value={[currentValue || 50]}
                            onValueChange={(value) => handleAnswer(currentStep.id, value[0])}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <div className="text-center text-sm text-gray-600">
                            Value: {currentValue || 50}
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Progress Bar */}
            {showProgressBar && (
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Step {currentStepIndex + 1} of {steps.length}</span>
                        <span>{Math.round(progress)}% complete</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    {/* Step Header */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {currentStep.title}
                        </h2>
                        {currentStep.description && (
                            <p className="mt-2 text-gray-600">
                                {currentStep.description}
                            </p>
                        )}
                    </div>

                    {/* Question */}
                    <div>
                        <Label className="text-lg font-medium text-gray-900">
                            {currentStep.question}
                        </Label>
                    </div>

                    {/* Input */}
                    <div className="mt-4">
                        {renderInput()}
                    </div>

                    {/* Error Message */}
                    {errors[currentStep.id] && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600"
                        >
                            {errors[currentStep.id]}
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStepIndex === 0}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={isSaving || !answers[currentStep.id]}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Completing...
                        </>
                    ) : currentStepIndex === steps.length - 1 ? (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Complete
                        </>
                    ) : (
                        <>
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>

            {/* Step Indicators */}
            <div className="mt-6 flex justify-center space-x-2">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`h-2 w-2 rounded-full transition-colors ${index < currentStepIndex
                                ? 'bg-green-500'
                                : index === currentStepIndex
                                    ? 'bg-blue-600'
                                    : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
