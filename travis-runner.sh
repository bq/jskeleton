#!/bin/bash
set -o pipefail

echo "$TRAVIS_BRANCH"

if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" != "true" ]
then
  echo "Deploying!" && \
  cp CNAME _site
  cd _site && \
  git config --global user.email "travis@bq.com"
  git config --global user.name "TRAVIS-CI"  
  git init && \
  git add . && \
  git commit -m "deploy" && \
  git push --force --quiet "https://${GH_OAUTH_TOKEN}@github.com/bq/penguin-doc" master:gh-pages > /dev/null 2>&1
fi