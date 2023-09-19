import { LoadingDots } from "@/components";

export default function Loading() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                margin: "50px auto",
                minHeight: "80vh",
                width: "100%",
            }}
        >
            <LoadingDots />
        </div>
    );
}
