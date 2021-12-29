#!/bin/sh
export CHAT_DB_HOST=localhost
export CHAT_DB_SCHEMA="chatapp"
export CHAT_DB_USERNAME="postgres"
export CHAT_DB_PASSWORD="root"
export CHAT_CLIENT_HOST="http://localhost" 
export SERVER_HOST=http://localhost
export SERVER_PROTOCOL=http
export MYSQL_ROOT_PASSWORD=root
export SERVER_PORT=4300
export CLIENT_PORT=4200
export JWT_SIGNING_KEY=A#@$BnJ
export NODE_ENV="development"
export CHAT_ADMIN_HOST="http://localhost"

cd dev_data
node createData