import mixpanelClient from "mixpanel-browser";
import { MIXPANEL_ID } from "./shared";

mixpanelClient.init(MIXPANEL_ID!, {
    debug: process.env.NODE_ENV === "development",
    track_pageview: true,
    persistence: "localStorage",
});

export { mixpanelClient };
