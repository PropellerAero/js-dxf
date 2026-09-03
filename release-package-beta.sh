#!/bin/bash -e
# Publishes a beta of the version in package.json under the npm "beta"
# dist-tag, as <version>-beta.N (impeller-contracts' format). Bump
# package.json to the TARGET version yourself first; this script finds the
# next free beta number for it on npm. package.json is left untouched.

PACKAGE_NAME=$(node -p "require('./package.json').name")
BASE=$(node -p "require('./package.json').version")

case "$BASE" in
  *-*)
    echo "ERROR: package.json version ${BASE} is already a prerelease — set it to the plain target version" >&2
    exit 1
    ;;
esac

EXISTING=$(npm view "${PACKAGE_NAME}@${BASE}" version 2>/dev/null || true)

if [ -n "$EXISTING" ]; then
  echo "ERROR: ${PACKAGE_NAME}@${BASE} is already published — betas are for unreleased versions, bump package.json first" >&2
  exit 1
fi

LAST_BETA=$(npm view "$PACKAGE_NAME" versions --json 2>/dev/null | node -p "
  const versions = [].concat(JSON.parse(require('fs').readFileSync(0, 'utf8')));
  const betaNumbers = versions
      .filter((v) => v.startsWith(process.argv[1] + '-beta.'))
      .map((v) => Number(v.split('-beta.')[1]))
      .filter(Number.isInteger);
  betaNumbers.length ? Math.max(...betaNumbers) : 0;
" "$BASE")

VERSION="${BASE}-beta.$((LAST_BETA + 1))"

yarn test

# Stamp the beta version only for the publish, then restore package.json.
trap 'git checkout -- package.json' EXIT
npm version --no-git-tag-version "$VERSION"
npm publish --tag beta

echo "Published ${PACKAGE_NAME}@${VERSION} (dist-tag: beta)"
