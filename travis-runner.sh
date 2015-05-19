#!/bin/bash
set -o pipefail

if ! TAG=`git describe --exact-match --tags 2>/dev/null`; then
  echo "This commit is not a tag so not creating a release"
  exit 0
fi

echo "$TRAVIS_BRANCH"

if [ "$TRAVIS" = "true" ] && [ -z "$TRAVIS_TAG" ]; then
  echo "This build is not for the tag so not creating a release"
  exit 0
fi

echo "$TRAVIS_BRANCH"

if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" != "true" ]
then
  echo "Refreshing annotated source code" && \
  grunt annotated && \
  git config --global user.email "travis@bq.com"
  git config --global user.name "TRAVIS-CI"
  git checkout doc && \
  git checkout master -- docs/annotated.html && \
  cp docs/annotated.html _includes && \
  git add _includes/annotated.html && \
  git commit -m "doc: refreshing annotated source code" && \
  git push --force "https://${GH_OAUTH_TOKEN}@github.com/bq/jskeleton" doc
fi
