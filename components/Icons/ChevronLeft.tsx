import { defaults } from "./defaults";

export default function ChevronLeft({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={defaults.strokeWidth}
            width={defaults.width}
            height={defaults.height}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15.75 19.5L8.25 12l7.5-7.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
