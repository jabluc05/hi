import { dot } from "../api";

export const commands: any = {
   "Browser:GoBack": () => dot.tabs.selectedTab?.goBack(),
   "Browser:GoForward": () => dot.tabs.selectedTab?.goForward(),
   "Browser:Reload": () => dot.tabs.selectedTab?.reload(),
}