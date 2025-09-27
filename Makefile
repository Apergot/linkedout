
MAKEFLAGS += --silent

# Default variables
container?=linkedout-node-api
env_file=docker.env
# Default variables

help: ## Shows this help message
	@echo 'usage: make [target]'
	@echo
	@echo 'targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

open: ## Starts docker dashboard app macOS (it starts daemon if not started already)
	open -a Docker

build: ## Builds every container
	docker-compose --env-file $(env_file) up -d --build

stop: ## Stops the containers
	docker-compose --env-file ${env_file} stop

run: ## Start the containers
	docker-compose --env-file ${env_file} up -d

enter: ## Starts interactive session at container, container by default node api container | container = name
	docker exec -it ${container} /bin/sh

migrations: ## Executes migrations at ./db/migrations using knex
	docker exec -it ${container} npx knex migrate:latest
