import { basic, initSidebar, initTopbar } from './modules/layouts';
import {
  initLocaleDatetime,
  initClipboard,
  smoothScroll,
  initPageviews,
  toc,
  highlightLines,
  runCpp,
  runJavascript,
  runPython,
  runRust
} from './modules/plugins';

basic();
initSidebar();
initTopbar();
initLocaleDatetime();
initClipboard();
toc();
smoothScroll(); // must be called after toc is created
initPageviews();
highlightLines();
runCpp();
runJavascript();
runPython();
runRust();
