import { basic, initSidebar, initTopbar } from './modules/layouts';
import {
  imgLazy,
  imgPopup,
  initLocaleDatetime,
  initClipboard,
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
imgLazy();
imgPopup();
initLocaleDatetime();
initClipboard();
toc();
initPageviews();
highlightLines();
runCpp();
runJavascript();
runPython();
runRust();
