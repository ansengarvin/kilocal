#############################
#    API Server Commands    #
#############################
function start() {
    sudo docker compose up -d
    mv_conf
    sudo nginx -c nginx.conf
}

function stop() {
    sudo docker compose down
    sudo nginx -s stop
}

function restart() {
    stop
    start
}

function mv_conf() {
    sudo cp -f proxy.conf /etc/nginx/conf.d/proxy.conf
}

############################
#    VPS Initialization    #
############################
function init_npm() {
    sudo apt-get update

    sudo apt-get install -y npm

    npm install
}

function init_docker() {
    # Add Docker's official GPG key:
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Update package
    sudo apt-get update

    # Install docker
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Verify that the installation is successful by running the hello-world image
    sudo docker run hello-world
}

function init_nginx() {
    # Update debian repository information
    sudo apt-get update

    # Install nginx
    sudo apt-get install -y nginx

    # Verify the installation
    sudo nginx -v

    # Move nginx config file to proper directory
    mv_conf
}

function verify_init() {
    echo "Verifying NPM:"
    npm -v
    echo "Verifying Docker:"
    docker -v
    sudo docker run hello-world
    echo "Verifying Nginx:"
    sudo nginx -v
}

function init_all() {
    init_npm
    init_docker
    init_nginx
    verify_init
}

###################################
#    Shell Script Functionality   #
###################################
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