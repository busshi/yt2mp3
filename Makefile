all:
	docker-compose up

build:
	docker-compose up --build

detach:
	docker-compose up -d

ps:
	docker-compose ps

log:
	docker-compose logs

stop:
	docker-compose stop
