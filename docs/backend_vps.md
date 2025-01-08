## Setting up backend in a fresh VPS

1. Clone the repository

        git clone https://github.com/ansengarvin/kilocal

2. Navigate to the backend directory

        cd backend

3. Run all functions in the shell file:

        ./init.sh install_npm
        ./init.sh get_docker
        ./init.sh get_nginx

        or

        ./init.sh all

4. Move the firebase service.json key into /etc/keys/service.json

5. Run the server

        docker compose up -d