/*
 * Run Rust code with Rust Playground.
 * Reference: The Rust Programming Language -> https://doc.rust-lang.org/book/
 * API: Rust Playground: https://play.rust-lang.org/
 */

$(function () {
    const btnSelector = '.code-header button.button-run-rust';

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
        $("i", node).removeClass("icon-playfill").addClass("icon-loading1");
    }

    function unlock(node) {
        $(node).removeAttr(LOCK);
        $("i", node).removeClass("icon-loading1").addClass("icon-playfill");
    }

    function getOutputFrame(btn) {
        let outputFrame = btn.parentNode.parentNode.nextElementSibling;
        if (outputFrame == undefined || !(outputFrame.tagName == 'DETAILS' && outputFrame.className == 'run-output')) {
            let referElement = outputFrame;
            outputFrame = document.createElement('details');
            outputFrame.className = "run-output";
            let summary = document.createElement('summary');
            summary.textContent = btn.attributes["output-title"].value;
            outputFrame.appendChild(summary);
            if (referElement == undefined) {
                btn.parentNode.parentNode.parentNode.appendChild(outputFrame);
            } else {
                referElement.parentNode.insertBefore(outputFrame, referElement);
            }
        }

        $(outputFrame).attr("open", "open");
        return outputFrame;
    }

    function fetch_with_timeout(url, options, timeout = 20000) {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
        ]);
    }

    function run_rust_code(codeBlock, resultBlock, btn, errorPrompt) {
        const preBlock = $(codeBlock).find("pre");
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
            version: "stable",
            optimize: "0",
            code: text,
            edition: "2021"
        };

        if (text.indexOf("#![feature") !== -1) {
            params.version = "nightly";
        }

        fetch_with_timeout("https://play.rust-lang.org/evaluate.json", {
            headers: {
                'Content-Type': "application/json",
            },
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(params)
        })
            .then(response => response.json())
            .then(response => {
                resultBlock.innerText = response.result;
                unlock(btn);
            })
            .catch(error => {
                resultBlock.innerText = errorPrompt + error.message;
                unlock(btn);
            });
    }

    $(btnSelector).click(function (e) {
        if (isLocked($(this))) {
            return;
        }

        lock($(this));
        let outputFrame = getOutputFrame(this);
        $("p", $(outputFrame)).remove();
        let p = document.createElement('p');
        p.innerText = this.attributes["wait-message"].value;
        outputFrame.appendChild(p);
        const codeBlock = this.parentNode.nextElementSibling;
        run_rust_code(codeBlock, p, $(this), this.attributes["error-prompt"].value);
    })
})