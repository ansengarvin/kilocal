
# Test Setup for Local Development

From: [Firebase CLI Initialization](https://firebase.google.com/docs/cli#mac-linux-npm) and [Install, Configure and Integrate Local Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)

## Set up firebase emulator

So we don't send an excessive number of account creation requests to the actual firebase server, we need to set up a local emulator to run our tests on.

1. Install npm packages

    ```
    npm install
    ```

    _Our packages contain firebase-tools, which is necessary to run the emulator._

2. Log into firebase
    ```
    > firebase login
    > n
    ```
    _When prompted, sign in through the browser._

4. Verify that ag-kilocal is in the project directory

    ```
    firebase projects:list
    ```

5. Start the emulator 

    ```
    firebase emulators:start
    ```

    _The emulator reads from .firebaserc and firebase.json to start_