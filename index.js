const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

// Define initial data
let data = [];
let loggedInUser = "";

const rl = readline.createInterface({ input, output });

// PrintOption
const printOption = () => {
    // Restart, re-print options
    console.log("---------------------------");
    console.log("");
    console.log("Choose an option:");
    console.log("1. Login");
    console.log("2. Deposit");
    console.log("3. Withdraw");
    console.log("4. Transfer");
    console.log("5. Check Balance");
    console.log("6. Logout");
    console.log("");
    console.log("---------------------------");
}

// Login user
const login = () => {
    if (loggedInUser) {

        // Print answer
        console.log(`You are already logged-In as a ${loggedInUser}`)
    } else {
        // Print question
        rl.question('Enter your name to Login: ', (answer) => {

            // Store the logged-In user in local variable.
            loggedInUser = answer;

            // Print the answer enter by user.
            console.log(`Hello, ${answer}!`);

            // Check the user is already available?
            const user = getCurrentUser(answer);

            if (!user) {
                // Print answer
                console.log(`Your balance is $0`);

                // Store the user with bank balance if user is new.
                data.push({
                    name: answer,
                    balance: 0,
                    owed: {
                        isOwed: false,
                        owedAmount: 0,
                        owedFrom: "",
                        owedTo: ""
                    }
                })
            } else {
                // Print answer
                console.log(`Your balance is $${user.balance}`);

                // Check is user owed?
                if (user?.owed?.isOwed) {
                    console.log(`Owed $${user?.owed?.owedAmount} from ${user?.owed?.owedFrom}`);
                }
            }
        });
    }
}

// Deposite amount
const deposit = () => {
    // ask user for deposit amount.
    rl.question('Enter deposit amount: ', (amount) => {
        // Find and add deposit amount to bank balance of the user.
        const user = getCurrentUser(loggedInUser);

        // Check is the depositer is owed to someone
        if (user?.owed?.isOwed) {
            // If the dpositer is an owed user
            depositIfOwedUser(user, amount);
        } else {
            // Calculate and update the balance
            user.balance = Number(user.balance) + Number(amount);

            // Print answer
            console.log(`Deposit successful. Your balance is now $${user.balance}`);
        }
    });
}

// WithDraw amount
const withDraw = () => {
    // ask user for withdraw amount.
    rl.question('Enter withdraw amount: ', (amount) => {
        // Find and add deposit amount to bank balance of the user.
        const user = getCurrentUser(loggedInUser);

        if (Number(user.balance) >= Number(amount)) {
            // Calculate and update the balance
            user.balance = Number(user.balance) - Number(amount);

            // Print answer
            console.log('Withdraw successfully done.')
            console.log(`Please collect the cash. Your balance is now $${user.balance}`);
        } else {
            // Print answer
            console.log('Insufficient balance!')
            console.log(`Your balance is now $${user.balance}`);
        }
    });
}

// Transfer amount
const transfer = () => {
    // ask user for deposit amount.
    rl.question('Enter user name to initiate transfer: ', (name) => {
        // Find and add deposit amount to bank balance of the user.
        const user = getCurrentUser(name);
        const loginUser = getCurrentUser(loggedInUser);

        if (!user) {
            console.log(`Sorry!, user not found!`);
        } else if (loginUser.balance === 0) {
            console.log(`Insufficient balance!`);
        } else {
            initialTransfer(user, loginUser, name);
        }
    });
}

// Check balance
const checkBalance = () => {
    // Find the user and check available balance.
    const user = getCurrentUser(loggedInUser);
    console.log(`Your balance is, ${user.balance}!`);
}

// Logout user
const logout = () => {
    // Print answer, logging out
    console.log(`Goodbye, ${loggedInUser}!`);
    loggedInUser = "";

    // print the options
    printOption();
}

// Find current user with all data
const getCurrentUser = (userName) => {
    return data.find(o => o.name === userName);
}

// Initiate transfer
const initialTransfer = (user, loginUser, name) => {
    // Ask the amount to be transfered.
    rl.question('Please enter amount: ', (amount) => {
        if (loginUser.balance < amount && !loginUser?.owed?.isOwed) {
            // Owed amount 
            const owedAmount = Number(amount) - Number(loginUser.balance);

            // transferd amount
            const transferedAount = Number(amount) - Number(owedAmount);

            // First deduct the amount from the logged-in user from bank balance.
            loginUser.balance = 0;

            // Owed amount, to user and from user to the depositer 
            loginUser.owed.isOwed = true;
            loginUser.owed.owedAmount = owedAmount;
            loginUser.owed.owedTo = name;
            loginUser.owed.owedFrom = loggedInUser;

            // Owed amount, to user and from user to the receiver
            user.owed.isOwed = true;
            user.owed.owedAmount = owedAmount;
            user.owed.owedTo = name;
            user.owed.owedFrom = loggedInUser;

            // Add the amount to the receiver bank balance.
            user.balance = Number(user.balance) + Number(amount)

            // Print answer
            console.log(`Transferred $${transferedAount} to ${name}`);
            console.log(`Your Balance is $${loginUser.balance}`);
            console.log(`Owed $${owedAmount} to ${name}`);
        } else {
            if (loginUser.owed.isOwed) {
                // Update the balance
                loginUser.balance = Number(loginUser.balance) - Number(amount);
                user.balance = !user.owed.isOwed ? Number(user.balance) + Number(amount) : 0;

                // update the owed amount
                const owedAmount = Number(loginUser.owed.owedAmount) - Number(amount);
                loginUser.owed.owedAmount = owedAmount;
                user.owed.owedAmount = owedAmount;

                // Print answer
                console.log(`Transferred $${amount} to ${name}`);
                console.log(`Your Balance is $${loginUser.balance}`);
                console.log(`Owed $${owedAmount} from ${user.name}`);
            } else {
                // First deduct the amount from the logged-in user from bank balance.
                loginUser.balance = Number(loginUser.balance) - Number(amount);

                // Add the amount to the receiver bank balance.
                user.balance = Number(user.balance) + Number(amount)

                // Print answer
                console.log(`Transferred $${amount} to ${name}`);
                console.log(`Your Balance is $${loginUser.balance}`);
            }
        }
    })
}

// Deposite if the depositer is owed
const depositIfOwedUser = (user, amount) => {
    // Find the owed to user.
    const owedToUser = data.find(o => o?.name !== user?.owed?.owedFrom);

    // Check the deposite amount is smaller then current balance
    if (user.balance < amount) {

        if (Number(user?.owed?.owedAmount) < Number(amount)) {

            // First deduct the amount from the logged-in user from bank balance.
            user.owed.isOwed = false;
            user.balance = Number(amount) - Number(user?.owed?.owedAmount);
            user.owed.owedAmount = 0;

            // Print answers
            console.log(`Transferred $${Number(amount) - Number(user?.balance)} to ${owedToUser.owed.owedTo}`);
            console.log(`Your Balance is $${user.balance}`);

        } else {
            // Owed amount 
            const owedAmount = Number(user?.owed?.owedAmount) > Number(amount) ? Number(user?.owed?.owedAmount) - Number(amount) : Number(amount) - Number(user?.owed?.owedAmount);

            // First deduct the amount from the logged-in user from bank balance.
            user.owed.isOwed = true;
            user.balance = 0;
            user.owed.owedAmount = owedAmount;

            // Update the receiver user
            owedToUser.owed.owedAmount = owedAmount;

            // Add the amount to the receiver bank balance.
            owedToUser.balance = Number(owedToUser.balance) + Number(amount)

            // Print answers
            console.log(`Transferred $${amount} to ${owedToUser.owed.owedTo}`);
            console.log(`Your Balance is $${user.balance}`);
            console.log(`Owed $${owedAmount} to ${owedToUser.owed.owedFrom}`);
        }
    }
}

// Display welcome message and available options
printOption();



// Listen for user input
rl.on('line', (input) => {
    switch (input) {
        case '1':
            // Called the login function to make the user logged-in.
            login();
            break;
        case '2':
            // Called the deposit function to deposit amount.
            deposit();
            break;
        case '3':
            // Called the withdraw function.
            withDraw();
            break;
        case '4':
            // Called the transfer function to send money.
            transfer();
            break;
        case '5':
            // Called the check balance function.
            checkBalance();
            break;
        case '6':
            // Called the logout function.
            logout();
            break;
        default:
            console.log('Invalid option');
            break;
    }
});
