// The pixel font is only used for English headings and labels.
import "@fontsource/press-start-2p/latin-400.css";
import "./styles.css";
import { startAnalytics } from "./analytics.ts";
import { fillIcons } from "./icons.ts";

fillIcons(document);
startAnalytics(document, globalThis.location.hostname, globalThis);
