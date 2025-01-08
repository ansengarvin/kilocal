## Setting up backend in a fresh VPS

1. Clone the repository

        git clone https://github.com/ansengarvin/kilocal

2. Navigate to the backend directory

        cd backend

3. Add execute permissions to the shell file

        chmod +x ./init.sh

4. Run all functions in the shell file:

        ./init.sh npm
        ./init.sh docker
        ./init.sh nginx

        or

        ./init.sh all

5. Move the firebase service.json key into /etc/keys/service.json

6. Run the server

        docker compose up -d