import { runLayout, type LayoutInput } from "../lib/graph/force";

self.onmessage = (e: MessageEvent<LayoutInput>) => {
  self.postMessage(runLayout(e.data));
};
