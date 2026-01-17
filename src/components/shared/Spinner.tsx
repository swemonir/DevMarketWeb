import { Loader2 } from 'lucide-react';

interface SpinnerProps {
    text?: string;
    className?: string;
}

export function Spinner({ text, className = '' }: SpinnerProps) {
    return (
        <div className={`flex flex-col items-center justify-center min-h-[50vh] ${className}`}>
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            {text && <p className="text-gray-400 text-sm font-medium">{text}</p>}
        </div>
    );
}
