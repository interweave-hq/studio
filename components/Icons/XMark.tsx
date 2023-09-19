import { defaults } from "./defaults";

export default function XMark({ className }: { className?: string }) {
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
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
}
