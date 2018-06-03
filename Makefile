SHELL := /bin/bash
BUNDLE := bundle
YARN := yarn
VENDOR_DIR = assets/vendor/
JEKYLL := $(BUNDLE) exec jekyll

PROJECT_DEPS := Gemfile package.json

.PHONY: all clean install update

all : serve

check:
	$(JEKYLL) doctor
	$(HTMLPROOF) --check-html \
		--http-status-ignore 999 \
		--internal-domains localhost:4000 \
		--assume-extension \
		_site

install: $(PROJECT_DEPS)
	$(BUNDLE) install --path vendor/bundler
	$(YARN) install

update: $(PROJECT_DEPS)
	$(BUNDLE) update
	$(YARN) upgrade

include-yarn-deps:
	mkdir -p $(VENDOR_DIR)
	cp node_modules/jquery/dist/jquery.min.js $(VENDOR_DIR)
	cp node_modules/jquery/dist/jquery.min.map $(VENDOR_DIR)
	cp node_modules/popper.js/dist/umd/popper.min.js $(VENDOR_DIR)
	cp node_modules/popper.js/dist/umd/popper.min.js.map $(VENDOR_DIR)
	cp node_modules/bootstrap/dist/js/bootstrap.min.js $(VENDOR_DIR)
	cp node_modules/bootstrap/dist/js/bootstrap.min.js.map $(VENDOR_DIR)
	cp node_modules/datatables.net-bs4/css/dataTables.bootstrap4.css $(VENDOR_DIR)
	cp node_modules/datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css $(VENDOR_DIR)
	cp node_modules/datatables.net/js/jquery.dataTables.js $(VENDOR_DIR)
	cp node_modules/datatables.net-bs4/js/dataTables.bootstrap4.js $(VENDOR_DIR)
	cp node_modules/datatables.net-buttons/js/dataTables.buttons.min.js $(VENDOR_DIR)
	cp node_modules/datatables.net-buttons/js/buttons.html5.min.js $(VENDOR_DIR)
	cp node_modules/datatables.net-buttons-bs4/js/buttons.bootstrap4.min.js $(VENDOR_DIR)

build: install include-yarn-deps
	$(JEKYLL) build

serve: install include-yarn-deps
	JEKYLL_ENV=production $(JEKYLL) serve
