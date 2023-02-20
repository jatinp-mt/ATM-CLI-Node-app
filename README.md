# ATM

## Available Scripts

In the project directory, you can run:

### `npm install`

Install all the dev dependency.

### `npm run start`

Runs the app in the development mode.\
Check the [Terminal](http://localhost:3000) to view CLI options.

## Problem Statement

You are asked to develop a Command Line Interface (CLI) to simulate an interaction of an ATM with a retail bank.

## Commands

- [x] `login [name]` - Logs in as this customer and creates the customer if not exist
- [x] `deposit [amount]` - Deposits this amount to the logged in customer
- [x] `withdraw [amount]` - Withdraws this amount from the logged in customer
- [x] `transfer [target] [amount]` - Transfers this amount from the logged in customer to the target customer
- [x] `logout` - Logs out of the current customer

## Example Session

Your console output should contain at least the following output depending on the scenario and commands. But feel free 
to add extra output as you see fit.

```bash
$ login Alice
Hello, Alice!
Your balance is $0

$ deposit 100
Your balance is $100

$ logout
Goodbye, Alice!

$ login Bob
Hello, Bob!
Your balance is $0

$ deposit 80
Your balance is $80

$ transfer Alice 50
Transferred $50 to Alice
your balance is $30

$ transfer Alice 100
Transferred $30 to Alice
Your balance is $0
Owed $70 to Alice

$ deposit 30
Transferred $30 to Alice
Your balance is $0
Owed $40 to Alice

$ logout
Goodbye, Bob!

$ login Alice
Hello, Alice!
Your balance is $280
Owed $40 from Bob

$ transfer Bob 30
Your balance is $250
Owed $10 from Bob

$ logout
Goodbye, Alice!

$ login Bob
Hello, Bob!
Your balance is $0
Owed $10 to Alice

$ deposit 100
Transferred $10 to Alice
Your balance is $90

$ logout
Goodbye, Bob!
```

## Learn More

You can learn more about Node check the [Node documentation](https://nodejs.org/en/).

To learn Readline, check out the [Readline](https://nodejs.org/api/readline.html).

## Note
I didn't use any storage as of now, I am managing this all with the help of one global variable which means the data get reset on every restart of the CLI application.
Also the users are identified with the help of name which is case sensitive.
