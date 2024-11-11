// Importing the readline module for reading input from the terminal
const readline = require('readline');

// List of common passwords
const commonPasswords = ["password", "12345", "qwerty", "admin", "welcome", "12345678"];

// FR1: Function to evaluate password strength
function evaluatePasswordStrength(password, username) {
    let score = 0;
    let feedback = '';

    // Length Check
    if (password.length > 8) {
        score += 3;
    } else if (password.length === 8) {
        score += 2;
    } else {
        feedback += "Password should be at least 8 characters long.\n";
    }

    // Complexity Check
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
        score += 1;
    } else {
        feedback += "Password should contain at least one lowercase and uppercase letter.\n";
    }

    if (password.match(/([0-9])/)) {
        score += 1;
    } else {
        feedback += "Password should contain at least one digit.\n";
    }

    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
        score += 1;
    } else {
        feedback += "Password should contain at least one special character.\n";
    }

    // Avoid common words
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
        feedback += "Password shouldn't be a common word.\n";
    } else {
        score += 1;
    }

    // Uniqueness Check
    if (username && password.toLowerCase() === username.toLowerCase()) {
        feedback += "Password shouldn't be identical to the username.\n";
    } else {
        score += 1;
    }

    // FR2: Calculate strength score
    let strength = "Weak";
    if (score >= 8) {
        strength = "Strong";
    } else if (score >= 5) {
        strength = "Moderate";
    } else {
        strength = "Weak";
    }

    feedback += `Password Strength: ${strength}\n`;
    feedback += `Score: ${score}/10\n`;

    return feedback;
}

// Create an interface to read input and output to the terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt user for input and evaluate the password
function runPasswordEvaluation() {
    rl.question("Enter your username: ", function (username) {
        rl.question("Enter your password: ", function (password) {
            if (!password) {
                console.log("Error: Password can't be empty.");
                rl.close();
                return;
            }

            const feedback = evaluatePasswordStrength(password, username);

            // Output feedback to the user
            console.log(feedback);
            rl.close(); // Close the readline interface after evaluation
        });
    });
}

// Run the password evaluation
runPasswordEvaluation();
