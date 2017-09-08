#!/usr/bin/env sh

#################################################################################
#                                                                               #
# Script to initialize an OS X box for local development with Goodrocket-Jekyll #
#                                                                               #
#################################################################################


#
# Make sure Command Line Tools are installed
#
echo "* Checking if Command Line Tools are installed..."
if type xcode-select >&- && xpath=$( xcode-select --print-path ) &&
   test -d "${xpath}" && test -x "${xpath}" ; then
   echo "* Command Line Tools are installed, skipping..."
else
   echo "* Command Line Tools are not installed. Installing Command Line Tools..."
   xcode-select --install
fi


#
# Make sure Homebrew is installed
#
echo "* Checking if Homebrew is installed..."
which -s brew
if [[ $? != 0 ]] ; then
  echo "* Homebrew is not installed. Installing Homebrew..."
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
  echo "* Homebrew is already installed. Updating Homebrew..."
  brew update
fi


#
# Make sure Git is installed
#
echo "* Checking if Git is installed..."
which -s git
if [[ $? != 0 ]] ; then
  echo "* Git is not installed. Installing Git..."
  brew install git
else
  echo "* Git is already installed. Skipping..."
fi


#
# Make sure Node.js is installed
#
echo "* Checking if Node is installed..."
which -s node
if [[ $? != 0 ]] ; then
  echo "* Node is not installed. Installing Node..."
  brew install node
else
  echo "* Node is installed, skipping..."
fi


#
# Make sure Bundler is installed
#
echo "* Checking if Bundler is installed..."
if [ "$(gem query -i -n bundler)" = "false" ]; then
  echo "* Bundler is not installed. Installing Bundler..."
  sudo gem install bundler
else
  echo "* Bundler is installed, skipping..."
fi


#
# Set up Ruby dependencies via Bundler
#
echo "* Installing Ruby dependencies..."
bundle install


#
# Setup Node.js dependencies via NPM
#
echo "* Installing Node.js dependencies..."
sudo npm install gulpjs/gulp-cli -g
sudo npm install


#
# Install graphicsmagic via NPM to resize images qith Gulp
#
echo "* Installing node-gyp..."
npm install -g node-gyp


#
# Notify about using the default repo
#
if [ "$(git config --get remote.origin.url)" = "git@github.com:ivanbabko/goodrocket-jekyll.git" ]; then
  echo "* NOTE: You're still on default repository git@github.com:ivanbabko/goodrocket-jekyll.git"
  echo "* To change this, use 'git remote rm origin' and then 'git remote add origin git@github.com:<user>/<repo>.git'"
fi
