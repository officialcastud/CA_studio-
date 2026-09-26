#!/usr/bin/env python3
"""Regenerate this form's entry points from js/ + css/.

Sources of truth in this folder:
  - js/*.js   the code, one file per module (numeric-prefix load order)
  - css/*.css the styles
  - index.html the head/body template (everything before the first <script src>)

Outputs (kept in sync so gates and double-click both work):
  - index.html      multi-file entry: <link> css + ordered <script src="js/..">
                    (head/body preserved verbatim; only the <script src> list and
                    the trailing </body></html> are rewritten)
  - Yukti_ITR3.html single-file equivalent: css inlined in <style>, all js in one
                    <script> block, in the identical load order. This is the
                    "single-file equivalent" the verification bar compares against
                    and the shape tools/gates parse. It is a generated artifact;
                    edit js/ + css/, never this file.

Load order = sorted(js/*.js). The trailing shell file (95_shell.js) sorts last and
must stay last: it calls paint() and wires the DOM once every module is defined.

usage: python3 build.py
"""
import glob, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
MARK = '<script src="js/'          # start of the generated script list in index.html
CSS_LINK = '<link rel="stylesheet" href="css/shell.css">'


def js_files():
    files = sorted(os.path.basename(p) for p in glob.glob(os.path.join(HERE, "js", "*.js")))
    if not files:
        sys.exit("no js/*.js files")
    return files


def read(p):
    return open(os.path.join(HERE, p), encoding="utf-8").read()


def build():
    files = js_files()
    idx = read("index.html")
    cut = idx.find(MARK)
    if cut == -1:
        sys.exit("index.html has no <script src=\"js/..\"> block to anchor on")
    head_body = idx[:cut]                        # doctype + head (+ css <link>) + body, verbatim

    # 1) rewrite index.html's script list (head/body untouched)
    scripts = "\n".join('<script src="js/%s"></script>' % f for f in files)
    index_out = head_body + scripts + "\n</body></html>\n"
    open(os.path.join(HERE, "index.html"), "w", encoding="utf-8").write(index_out)

    # 2) single-file equivalent: inline the css, concatenate the js in one <script>
    if CSS_LINK not in head_body:
        sys.exit("index.html head is missing the expected css <link>")
    css = read("css/shell.css")
    head_body_inline = head_body.replace(CSS_LINK + "\n", "<style>" + css + "</style>", 1)
    js_blob = "\n".join(read(os.path.join("js", f)) for f in files)
    single = head_body_inline + "<script>\n" + js_blob + "\n</script></body></html>"
    open(os.path.join(HERE, "Yukti_ITR3.html"), "w", encoding="utf-8").write(single)

    print("built index.html (%d scripts) and Yukti_ITR3.html from %d js files" % (len(files), len(files)))


if __name__ == "__main__":
    build()
