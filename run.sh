# Builds the database
function build () {
	docker compose -f docker-compose.yaml up --build -d
}

# Destroys the database
function destroy() {
	echo "Destroying DB. Remember to delete postgres-data."
	docker-compose down --volumes
}

function rebuild () {
	destroy
	build
	echo "Waiting 8 seconds for database to set up."
	sleep 8
}


## Environment for local testing with firebase emulator access
function up() {
	npx firebase emulators:start &
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml -f docker-compose.db.yaml up --build -d
	docker exec -i mssql //opt/mssql-tools18/bin/sqlcmd -S "tcp:mssql,1433" -U sa -P 'YourStrong!Passw0rd' -d master -i //docker-entrypoint-initdb.d/dev.sql -C
}

## Take down environment for local emulator testing
function down() {
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml -f docker-compose.db.yaml down
	# Find and kill firebase emulator process (windows)
    PID=$(netstat -ano | grep 9099 | grep LISTENING | awk '{print $5}' | head -1)
    if [ ! -z "$PID" ]; then
        echo "Stopping firebase emulator at PID $PID..."
        taskkill //PID $PID //F
		echo "Sleeping while process dies"
		sleep 2
    else
        echo "No Firebase emulator process found on port 9099"
    fi
}

## Shorthand for tearing down previous dev enviornment and setting up
function dev() {
	down
	up
}

## Run test suite locally
function test() {
	# Build docker images and run them in Docker Desktop
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml -f docker-compose.db.yaml up --build -d

	echo "Waiting 8 seconds for database setup..."
    sleep 8

	# Initialize the local database with tables and some test values
	docker exec -i mssql //opt/mssql-tools18/bin/sqlcmd -S "tcp:mssql,1433" -U sa -P 'YourStrong!Passw0rd' -d master -i //docker-entrypoint-initdb.d/dev.sql -C
    
    # Start emulator, run playwright tests, and stop emulator
    firebase emulators:exec --project ag-kilocal "npx playwright test | tee ./tests/logs/playwright/playwright.log"

	# Transfer all docker logs to local folder and stop running images
	docker logs frontend > ./tests/logs/docker/frontend.log
	docker logs backend > ./tests/logs/docker/backend.log
	docker logs mssql > ./tests/logs/docker/mssql.log
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml -f docker-compose.db.yaml down
}

#####
# Fake Prod:
# Starts a local instance for development, which connects to the real firebase server with a local database.
# Used in niche cases where we're working on tests and want to manually make sure that we didn't break prod firebase
####
function fakeprodup() {
	docker compose -f docker-compose.yaml -f docker-compose.db.yaml up --build -d
	docker exec -i mssql //opt/mssql-tools18/bin/sqlcmd -S "tcp:mssql,1433" -U sa -P 'YourStrong!Passw0rd' -d master -i //docker-entrypoint-initdb.d/dev.sql -C
}

function fakeproddown(){
	docker compose -f docker-compose.yaml -f docker-compose.db.yaml down
}

function fakeproddev() {
	fakeproddown
	fakeprodup
}

# Starts the database
function start() {
    echo "Starting App"
    docker compose -f docker-compose.yaml up --build -d
}

# Stops the database
function stop() {
    echo "Stopping App"
    docker-compose down
}

# Opens a postgres shell.
function psql() {
	start
	docker exec -it postgres psql -U dev -W kilocal_api
}

function psql_dump() {
	docker exec -t postgres pg_dump --dbname=postgresql://dev:dev@localhost:5432/kilocal_api --inserts > database/backups/dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
}

function scrape_func_names() {
	functions=($(grep -oE 'function[[:space:]]+[a-zA-Z_][a-zA-Z_0-9]*' ./run.sh | sed 's/function[[:space:]]*//'))
}

# if no command line args, just run the all function
if [ -z "$1" ]; then
	all
	exit 0
fi

# otherwise run the user specified command
scrape_func_names
for func in "${functions[@]}"; do
	# if the func exists in this file, and the first cmd line arg matches the func name, 
	# run the func
	if [ "$1" == "$func" ]; then
		$1 $2 # $2 and on are arguments passed into the $1 function
		exit 0
	fi
done

# if we get to this point, the command does not exist
echo "ERROR: command '$1' does not exist"
exit 1