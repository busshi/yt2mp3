dev:
	docker-compose -f docker-compose.dev.yaml up --build

prod:
	docker-compose -f docker-compose.yaml up --build -d

ps:
	docker-compose ps

log:
	docker-compose logs

stop:
	docker-compose -f docker-compose.dev.yaml stop
	docker-compose -f docker-compose.yaml stop

stopDev:
	docker-compose -f docker-compose.dev.yaml stop

stopProd:
	docker-compose -f docker-compose.yaml stop

.PHONY: dev prod ps log stop
