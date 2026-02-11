import { useState, useEffect } from 'react'

interface VoiceInputProps {
    onTranscript: (text: string) => void
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [isSupported, setIsSupported] = useState(false)
    const [recognition, setRecognition] = useState<any>(null)

    useEffect(() => {
        // Check if browser supports Web Speech API
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

        if (SpeechRecognition) {
            setIsSupported(true)
            const recognitionInstance = new SpeechRecognition()
            recognitionInstance.continuous = false
            recognitionInstance.interimResults = true
            recognitionInstance.lang = 'en-US'

            recognitionInstance.onresult = (event: any) => {
                const current = event.resultIndex
                const transcriptionText = event.results[current][0].transcript
                setTranscript(transcriptionText)

                // If final result, send to parent
                if (event.results[current].isFinal) {
                    onTranscript(transcriptionText)
                }
            }

            recognitionInstance.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error)
                setIsListening(false)
            }

            recognitionInstance.onend = () => {
                setIsListening(false)
            }

            setRecognition(recognitionInstance)
        }
    }, [onTranscript])

    const toggleListening = () => {
        if (!recognition) return

        if (isListening) {
            recognition.stop()
            setIsListening(false)
        } else {
            setTranscript('')
            recognition.start()
            setIsListening(true)
        }
    }

    if (!isSupported) {
        return (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span>🎤</span>
                <span>Voice input not supported in this browser</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={toggleListening}
                className={`p-3 rounded-full transition-all ${isListening
                        ? 'bg-red-500 text-white animate-pulse shadow-lg'
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    }`}
                title={isListening ? 'Stop recording' : 'Start voice input'}
            >
                {isListening ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <rect x="6" y="4" width="8" height="12" rx="1" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                )}
            </button>

            {isListening && (
                <div className="flex-1">
                    <div className="text-sm text-gray-600">Listening...</div>
                    <div className="text-xs text-gray-500 italic">
                        {transcript || 'Speak your physics problem'}
                    </div>
                </div>
            )}
        </div>
    )
}
