all:
	docker-compose -f docker-compose.dev.yaml up

dev:
	docker-compose -f docker-compose.dev.yaml up --build -d

prod:
	docker-compose -f docker-compose.yaml up --build -d

ps:
	docker-compose -f docker-compose.dev.yaml ps
	docker-compose -f docker-compose.yaml ps

log:
	docker-compose -f docker-compose.dev.yaml logs
	docker-compose -f docker-compose.yaml logs

stop:
	docker-compose -f docker-compose.dev.yaml stop
	docker-compose -f docker-compose.yaml stop

stopDev:
	docker-compose -f docker-compose.dev.yaml stop

stopProd:
	docker-compose -f docker-compose.yaml stop

.PHONY: dev prod ps log stop
