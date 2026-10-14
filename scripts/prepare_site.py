"""Export the static site with the exact commit used by GitHub Pages."""
from pathlib import Path
import argparse
import re
import shutil

parser = argparse.ArgumentParser()
parser.add_argument('--commit', required=True)
parser.add_argument('--output', required=True)
args = parser.parse_args()
if not re.fullmatch(r'[0-9a-f]{40}', args.commit):
    parser.error('commit must be a full Git SHA')
root = Path(__file__).resolve().parent.parent
output = Path(args.output)
output.mkdir(parents=True, exist_ok=True)
for name in ['index.html', 'styles.css', 'theme.js', 'language.js', 'figures.js', 'visits.js', '.nojekyll']:
    shutil.copyfile(root / name, output / name)
shutil.copytree(root / 'assets', output / 'assets', dirs_exist_ok=True)
page = (output / 'index.html').read_text()
pattern = r'(<div class="revision-info"><a href="https://github.com/GAD-DIMNT-CPTEC/gad-dimnt-cptec.github.io/commit/)[0-9a-f]+("[^>]*><span>Revisão</span>: <code>)[0-9a-f]+(</code></a>)<small>[^<]*</small>'
page, replacements = re.subn(pattern, lambda m: m[1] + args.commit + m[2] + args.commit[:7] + m[3], page)
if replacements != 1:
    raise RuntimeError('Revision footer was not found')
(output / 'index.html').write_text(page)
