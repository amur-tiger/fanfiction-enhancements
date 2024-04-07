import Container from "./container";
import { environment, Page } from "./util/environment";
import { syncChapterReadStatus } from "./sync/sync";

import "./theme.css";
import "./main.css";

const container = new Container();

async function main() {
  if (environment.currentPageType === Page.OAuth2) {
    console.log("OAuth 2 landing page - no enhancements will be applied");
    return;
  }

  syncChapterReadStatus().catch(console.error);

  const enhancer = container.getEnhancer();
  for (const e of enhancer) {
    if (e.canEnhance(environment.currentPageType)) {
      await e.enhance();
    }
  }
}

main().catch(console.error);
