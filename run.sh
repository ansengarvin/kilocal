# Builds the database
function build () {
	docker compose up --build -d
}

# Destroys the database
function destroy() {
	echo "Destroying DB. Remember to delete postgres-data."
	docker-compose down --volumes
}

# Starts the database
function start() {
    echo "Starting DB"
    docker-compose up -d
}

# Stops the database
function stop() {
    echo "Stopping DB"
    docker-compose down
}

# Opens a postgres shell.
function psql() {
	start
	docker exec -it postgres psql -U dev -W kilocal_api
}

function test_basic() {
	python -m pytest -s tests/*.py
}

function test() {
	destroy
	build
	sleep 5
	test_basic
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