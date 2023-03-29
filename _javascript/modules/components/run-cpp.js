/*
 * Run C++ code with Coliru.
 * Reference: The Rust Programming Language -> https://doc.rust-lang.org/book/
 * API: https://coliru.stacked-crooked.com/
 */

const btnSelector = '.code-header button.button-run-cpp';

const LOCK = 'lock';
const TIMEOUT = 20000; // in milliseconds

function isLocked(node) {
  if ($(node)[0].hasAttribute(LOCK)) {
    let timeout = $(node).attr(LOCK);
    if (Number(timeout) + 5000 > Date.now()) {
      return true;
    }
  }
  return false;
}

function lock(node) {
  $(node).attr(LOCK, Date.now() + TIMEOUT);
  $('i', node).removeClass('icon-playfill').addClass('icon-loading1');
}

function unlock(node) {
  $(node).removeAttr(LOCK);
  $('i', node).removeClass('icon-loading1').addClass('icon-playfill');
}

function getOutputFrame(btn) {
  let outputFrame = btn.parentNode.parentNode.nextElementSibling;
  if (outputFrame == undefined || !(outputFrame.tagName == 'DETAILS' && outputFrame.className == 'run-output')) {
    let referElement = outputFrame;
    outputFrame = document.createElement('details');
    outputFrame.className = 'run-output';
    let summary = document.createElement('summary');
    summary.textContent = btn.attributes['output-title'].value;
    outputFrame.appendChild(summary);
    if (referElement == undefined) {
      btn.parentNode.parentNode.parentNode.appendChild(outputFrame);
    } else {
      referElement.parentNode.insertBefore(outputFrame, referElement);
    }
  }

  $(outputFrame).attr('open', 'open');
  return outputFrame;
}

function run_cpp_code(codeBlock, resultBlock, btn, errorPrompt) {
  const preBlock = $(codeBlock).find('pre');
  let text;
  if (preBlock.length == 2) {
    text = preBlock.get(1).innerText;
  } else if (preBlock.length == 1) {
    text = preBlock.get(0).innerText;
  } else {
    unlock(btn);
    return;
  }

  let params = {
    cmd: 'g++ -std=c++20 main.cpp && ./a.out',
    src: text
  };

  let http = new XMLHttpRequest();
  http.open('POST', 'https://coliru.stacked-crooked.com/compile', true);
  http.onload = () => {
    resultBlock.innerText = http.responseText;
    unlock(btn);
  };

  http.onerror = () => {
    resultBlock.innerText = errorPrompt + http.responseText;
    unlock(btn);
  };
  http.send(JSON.stringify(params));
}

export function runCpp() {
  $(btnSelector).click(function (e) {
    if (isLocked($(this))) {
      return;
    }

    lock($(this));
    let outputFrame = getOutputFrame(this);
    $('p', $(outputFrame)).remove();
    let p = document.createElement('p');
    p.innerText = this.attributes['wait-message'].value;
    outputFrame.appendChild(p);
    const codeBlock = this.parentNode.nextElementSibling;
    run_cpp_code(codeBlock, p, $(this), this.attributes['error-prompt'].value);
  })
}