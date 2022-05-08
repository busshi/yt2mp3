CMD	= docker-compose -f src/docker-compose.yaml

all:
	$(CMD) up -d

v:
	$(CMD) up

build:
	$(CMD) --build

ps:
	$(CMD) ps

log:
	$(CMD) logs

stop:
	$(CMD) stop

re:	stop build

.PHONY: v build ps log stop re
