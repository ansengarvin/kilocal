
# Test Setup for Local Development

So we don't send an excessive number of account creation requests to the actual firebase server, we need to set up a local emulator to run our tests on. The emulator initialization from [Firebase CLI Initialization](https://firebase.google.com/docs/cli#mac-linux-npm) and [Install, Configure and Integrate Local Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure) has already been configured for this repository, so the initial setup for local testing is super easy.

1. Install npm packages in the root directory

    ```
    npm install
    ```

    _Our packages contain firebase-tools, which is necessary to run the emulator._


2. Run the test shell command

    ```
    sh run.sh test
    ```

    _This shell command compiles the docker images, sets up the local database, starts the emulator and runs all tests. After the tests are complete, it takes down all of the docker images and takes down the emulator._

    _All docker and playwright outputs are logged inside of tests/logs/_