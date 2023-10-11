import Mixpanel from "mixpanel";

const mixpanelId = process.env.NODE_ENV === "development" ? "dc6399f0c01c6b798f7bf41dd28cf48f" : process.env.MIXPANEL_API_TOKEN;

export const mixpanelServer = Mixpanel.init(mixpanelId!);

export default mixpanelServer;
