/**
 * Hightlight specifiled lines
 */

$(function () {
    let highlightLines = function (codeBlock, highlight_lines) {
        let current_line = null;
        let current_lineno = 1;
        for (let cur = codeBlock.firstChild; cur != null; cur = cur.nextSibling) {
            if (current_line == null)
                current_line = cur;
            let contents = cur.textContent.split(/\n/g);
            if ((contents || []).length > 1) {
                let newline_count = contents.length - 1;
                let subNodes = [];
                for (let i = 0; i < newline_count + 1; i++) {
                    let subNode = cur.cloneNode(false);
                    subNode.textContent = contents[i];
                    if (i != newline_count)
                        subNode.textContent += '\n';
                    codeBlock.insertBefore(subNode, cur);
                    subNodes.push(subNode);
                }
                codeBlock.removeChild(cur);
                cur = subNodes[newline_count];
                for (let i = 0; i < newline_count; i++) {
                    if (highlight_lines.includes(current_lineno)) {
                        let hll_node = document.createElement("span");
                        hll_node.setAttribute("class", "hll");
                        codeBlock.insertBefore(hll_node, current_line);
                        for (let next = hll_node.nextSibling; next != subNodes[i]; next = hll_node.nextSibling)
                            hll_node.appendChild(next);
                        hll_node.appendChild(subNodes[i]);
                    }
                    current_line = subNodes[i + 1];
                    current_lineno++;
                }
            }
        }
    };

    $(".highlighter-rouge").each(function () {
        const attr_highlight_lines = $(this).attr("highlight-lines");
        if (attr_highlight_lines && attr_highlight_lines.length > 0) {
            let lines = [];
            let scopes = ("," + attr_highlight_lines).match(/(?<=\s|,)\d+(-\d+)?/g)
            scopes.forEach(function (val) {
                let pos = val.split('-');
                let start = parseInt(pos[0]);
                if (pos.length > 1) {
                    let end = parseInt(pos[1]);
                    if (end >= start) {
                        for (let i = start; i <= end; i++) {
                            lines.push(i);
                        }
                    }
                } else if (pos.length == 1) {
                    lines.push(start);
                }
            })
            let pre = $("pre", $(this));
            pre = pre[pre.length - 1];
            highlightLines(pre, lines);
        }
    })
})
