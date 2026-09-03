#!/bin/bash -e
# Publishes the version already in package.json — bump it yourself (and get it
# onto master) before running. Refuses versions that are already on npm.

PACKAGE_NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")

case "$VERSION" in
  *-*)
    echo "ERROR: ${VERSION} looks like a prerelease — use release-package-beta.sh" >&2
    exit 1
    ;;
esac

EXISTING=$(npm view "${PACKAGE_NAME}@${VERSION}" version 2>/dev/null || true)

if [ -n "$EXISTING" ]; then
  echo "ERROR: ${PACKAGE_NAME}@${VERSION} is already published — bump package.json first" >&2
  exit 1
fi

yarn test
npm publish

echo "Published ${PACKAGE_NAME}@${VERSION}"
