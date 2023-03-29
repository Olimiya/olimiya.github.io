import { basic, initSidebar, initTopbar } from './modules/layouts';
import {
  initClipboard,
  smoothScroll,
  highlightLines,
  runCpp,
  runJavascript,
  runPython,
  runRust
} from './modules/plugins';

basic();
initSidebar();
initTopbar();
initClipboard();
smoothScroll();
highlightLines();
runCpp();
runJavascript();
runPython();
runRust();
