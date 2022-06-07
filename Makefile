#####################################################
# Makefile containing shortcut commands for project #
#####################################################

# MACOS USERS:
#  Make should be installed with XCode dev tools.
#  If not, run `xcode-select --install` in Terminal to install.

# WINDOWS USERS:
#  1. Install Chocolately package manager: https://chocolatey.org/
#  2. Open Command Prompt in administrator mode
#  3. Run `choco install make`
#  4. Restart all Git Bash/Terminal windows.

.PHONY: docker-build docker-clean docker-down docker-force docker-logs docker-start docker-stop docker-up

docker-build:
	docker-compose build

docker-clean:
	docker-compose down --rmi all --volumes

docker-down:
	docker-compose down --remove-orphans

docker-force:
	docker-compose up --force-recreate

docker-logs:
	docker-compose logs -f

docker-start:
	docker-compose start

docker-stop:
	docker-compose stop

docker-up:
	docker-compose up -d

.PHONY: python-fmt python-library-sort python-lint

python-check-fmt:
	python -m black --check .

python-check-library-sort:
	python -m isort --check-only --profile black --skip __init__.py --skip vendor --skip venv .

python-fmt:
	python -m black .

python-library-sort:
	python -m isort --profile black --skip __init__.py --skip vendor --skip venv .

python-lint:
	python -m pylint --ignore migration,vendor --exit-zero ckanext-basedosdados/ckanext/basedosdados
