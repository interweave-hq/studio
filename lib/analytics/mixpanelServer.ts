import Mixpanel from "mixpanel";
import { MIXPANEL_ID } from "./shared";

export const mixpanelServer = Mixpanel.init(MIXPANEL_ID!);
