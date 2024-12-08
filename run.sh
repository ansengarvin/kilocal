function start() {
    echo "Starting DB"
    docker-compose up -d
}

function stop() {
    echo "Stopping DB"
    docker-compose down
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