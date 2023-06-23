#!/usr/bin/env bash

# Usage: gh_deploy.sh

dir="dist"
def_branch="main"
ghp_branch="gh-pages"

green="$(tput setaf 108;)"
red="$(tput setaf 1;)"
bold="$(tput bold;)"
rst="$(tput sgr0;)"

# date=$(date +%F_%H-%M)
# 2>>error_${date}.log

build_command() {
  [ -d "${dir}" ] && rm -rf "${dir}"
  mkdir -p ${dir}
  npm run build
}

check_err() {
  if [ $? -ne 0 ]; then
    echo "${red}An error has occured.${rst}" >&2
    exit 1
  else
    if [ -n "$1" ]; then
      echo -e "${green}${*}${rst}\n"
    fi
  fi
}

# Check if there are unstaged/uncommited changes
if git status | grep "modified:" >/dev/null; then
  echo "${bold}Important note:${rst} There are unstaged/uncomitted changes on the '${def_branch}' branch. Running this script will discard these local changes."
  echo "Do you want to continue? (y/N)"
  read -r input
  case $input in
    y|yes) echo -e "Continue running script...\n" ;;
    *) echo "Exit script" ; exit 1
  esac
fi

# Delete remote and local 'ghp_branch' if they exist
if git branch -r | grep "${ghp_branch}" >/dev/null; then
  echo "${green}Deleting remote '${ghp_branch}' branch...${rst}"
  git push origin --delete ${ghp_branch}
  check_err "Done."
fi

if git branch | grep ${ghp_branch} >/dev/null; then
  echo "${green}Deleting local '${ghp_branch}' branch...${rst}"
  if git worktree list | grep ${ghp_branch} >/dev/null; then
    git worktree remove -f "${dir}"
  fi
  git branch -D "${ghp_branch}"
  check_err "Done."
fi

# Delete old 'dir' folder if it exists
if [ -d $dir ] ; then
  echo "${green}Deleting old '${dir}/' folder...${rst}"
  rm -rfv "${dir}"
  check_err "Done."
fi

# Set up new 'ghp_branch'
echo "${green}Setting up new '${ghp_branch}' branch...${rst}"
git checkout --orphan "${ghp_branch}"
check_err
git reset --hard
git commit --allow-empty -m "Init"
git checkout "${def_branch}"
check_err "Done."

# Mount 'ghp_branch' as a subdirectory
echo "${green}Checking out '${ghp_branch}' branch...${rst}"
git worktree add dist "${ghp_branch}"
check_err "Done."

# Generate site
echo "${green}Generating site...${rst}"
build_command
check_err "Done."

# Deploy 'ghp_branch'
echo "${green}Deploying '${ghp_branch}' branch...${rst}"
builtin cd "${dir}" || exit 1
git add --all
git commit -m "Deploy updates"
git push origin "${ghp_branch}"
check_err "Done."

# Remove 'dir' folder
echo "${green}Cleaning up...${rst}"
git worktree remove "${dir}"
builtin cd .. || exit 1
check_err "Done."

# Rebuild 'dir' folder
echo "${green}Rebuilding '${dir}' folder...${rst}"
build_command
check_err "Done."

echo "${green}Successfully deployed website.${rst}"
