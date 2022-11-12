init:
	docker network create --subnet=172.11.8.0/16 miniator_auth_network
	docker build -t miniator_auth:1.0.0 .
	docker-compose up -d

build:
	docker build -t miniator_auth:1.0.0 .

server_up:
	docker-compose up -d

db_up:
	docker-compose up -d

server_down:
	docker-compose down -d

net_create:
	docker network create --subnet=172.11.8.0/16 miniator_auth_network
