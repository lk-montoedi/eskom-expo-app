# Team 37 Mobile App

This is the mobile application for the Team 37 project, built with React Native and Expo.

## Installation

To get the mobile app running locally on an emulator or your device, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- A package manager like [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/):
    ```bash
    npm install -g expo-cli
    ```
- [Android Studio](https://developer.android.com/studio) for Android emulator, or [Xcode](https://developer.apple.com/xcode/) for iOS simulator.
- The Expo Go app on your physical device if you want to run it there.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>/team37-mobile
    ```

2.  **Install dependencies:**
    Run one of the following commands depending on your package manager:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```
    or
    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    This project may use a `.env` file for environment variables. If required, create a `.env` file in the `team37-mobile` directory and add the necessary variables.

4.  **Run the application:**
    ```bash
    npm start
    ```
    or
    ```bash
    expo start
    ```
    This will start the Metro bundler. You can then:
    -   Press `a` to open on an Android emulator.
    -   Press `i` to open on an iOS simulator.
    -   Scan the QR code with the Expo Go app on your phone.
