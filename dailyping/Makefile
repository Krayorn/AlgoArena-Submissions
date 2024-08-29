# Makefile for X.com Mute/Block Extension

# Variables
ZIP_NAME = extension.zip
MANIFEST = manifest.json
CSS_FILES = $(wildcard *.css)
JS_FILES = $(wildcard *.js)
PNG_FILES = $(wildcard *.png)
HTML_FILES = $(wildcard *.html)

# Default target
all: build

# Build target
build: clean
	@echo "Building extension..."
	@zip -r $(ZIP_NAME) $(MANIFEST) $(HTML_FILES) $(JS_FILES) $(PNG_FILES) 

# Clean target
clean:
	@echo "Cleaning up..."
	@rm -f $(ZIP_NAME)

# Phony targets
.PHONY: all build clean