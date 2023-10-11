"use client";

import { getButtonStyle } from "@/components/Button";
import { mixpanelClient } from "@/lib/analytics/mixpanelClient";

export const CtaButton = () => {
    return (
        <a
            href="https://docs.interwv.com/getting-started"
            className={getButtonStyle()}
            onClick={() => mixpanelClient.track("cta-button_clicked")}
        >
            Get Started
        </a>
    );
};
