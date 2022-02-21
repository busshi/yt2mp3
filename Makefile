all:
	docker-compose up -d

v:
	docker-compose up

build:
	docker-compose up --build

ps:
	docker-compose ps

log:
	docker-compose logs

stop:
	docker-compose stop

re:	stop build

.PHONY: v build ps log stop re
