import { useState, useRef } from 'react'
import { createWorker } from 'tesseract.js'

interface ImageUploadProps {
    onTextExtracted: (text: string) => void
}

export default function ImageUpload({ onTextExtracted }: ImageUploadProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPG, PNG, etc.)')
            return
        }

        setError(null)
        setIsProcessing(true)
        setProgress(0)

        // Create preview
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)

        try {
            // Initialize Tesseract worker
            const worker = await createWorker('eng', 1, {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100))
                    }
                },
            })

            // Perform OCR
            const { data: { text } } = await worker.recognize(file)

            // Clean up worker
            await worker.terminate()

            // Send extracted text to parent
            if (text.trim()) {
                onTextExtracted(text.trim())
                setIsProcessing(false)
            } else {
                setError('No text found in image')
                setIsProcessing(false)
            }
        } catch (err) {
            console.error('OCR error:', err)
            setError('Failed to extract text from image')
            setIsProcessing(false)
        }

        // Clear file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            // Call handler directly with file
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                fileInputRef.current.files = dataTransfer.files
                const event = new Event('change', { bubbles: true })
                fileInputRef.current.dispatchEvent(event)
            }
        }
    }

    const clearPreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(null)
        setProgress(0)
        setError(null)
    }

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="space-y-2">
                    <div className="text-4xl">📷</div>
                    <div className="text-gray-700 font-medium">
                        Upload Image of Physics Problem
                    </div>
                    <div className="text-sm text-gray-500">
                        Click to select or drag and drop
                    </div>
                    <div className="text-xs text-gray-400">
                        Supports JPG, PNG, WebP (textbook screenshots, handwritten notes)
                    </div>
                </div>
            </div>

            {/* Preview & Progress */}
            {previewUrl && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Processing Image...</span>
                        <button
                            onClick={clearPreview}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Image Preview */}
                    <img
                        src={previewUrl}
                        alt="Upload preview"
                        className="max-h-32 mx-auto rounded border border-gray-200"
                    />

                    {/* Progress Bar */}
                    {isProcessing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Extracting text...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}
                </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-900">
                    <strong>💡 Tips for best results:</strong>
                    <ul className="mt-1 ml-4 text-xs space-y-1">
                        <li>• Use clear, high-resolution images</li>
                        <li>• Ensure text is readable and not blurry</li>
                        <li>• Avoid heavy shadows or glare</li>
                        <li>• Cropped images work better than full pages</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
