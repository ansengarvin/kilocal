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

function dev() {
	docker compose down
	docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build -d
	docker exec -i mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'YourStrong!Passw0rd' -d master -i /path/to/init.sql
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

function test_short() {
	python -m pytest -s --tb=short tests/*.py
}

function test() {
	destroy
	build
	echo "Waiting 8 seconds for database to set up."
	sleep 8
	test_short
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