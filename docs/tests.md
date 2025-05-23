
# Test Setup

From: [Firebase CLI Initialization](https://firebase.google.com/docs/cli#mac-linux-npm) and [Install, Configure and Integrate Local Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)

## Firebase Local Emulator

So we don't send an excessive number of account creation requests to the actual firebase server, we need to set up a local emulator to run our tests on. The steps to do so are below.

1. Install firebase emulator

    ```
    npm install -g firebase-tools
    ```

2. Log into firebase and press n
    ```
    > firebase login
    > n
    ```

3. Log into the firebase project through the browser. Note: For CI to log into firebase, they need to use a token obtained through ```firebase login:ci```

4. Verify that ag-kilocal is in the project directory

    ```
    firebase projects:list
    ```



5. Initialize the firebase emulator

    ```
    firebase init emulators
    ```
    
6. Follow the menu

    | Step | Prompt | Input |
    | --- | --- | --- |
    | 1 | Are you ready to proceed? | **Y** |
    | 2 | Please select an option: | **Use an existing project** |
    | 3 | Select a default Firebase project for this directory: | **ag-kilocal** |
    | 4 | Which Firebase emulators do you want to set up? | **Authentication Emulator** |
    | 5 | Which port do you want to use for the auth emulator? | **9909** |
    | 6 | Would you like to enable the emulator UI? | **n** |
    | 7 | Would you like to download the emulators now? | **Y** |