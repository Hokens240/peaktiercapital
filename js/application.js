// --- DATABASE INITIALIZATION ---
function initializeMockUsers() {
    const initialUsers = [
       { 
            email: "almightyrick8@gmail.com", 
            firstName: "Rick", 
            lastName: "Aguiar", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "1550.75", 
            totalProfit: "520.10", 
            profitBalance: "120.50", 
            initialInvestment: "1000.00", 
            returnOnInvestment: "4892.11"
        },
        { 
            email: "larrylovato59@gmail.com", 
            firstName: "Larry", 
            lastName: "Lovato", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "1550.75", 
            totalProfit: "520.10", 
            profitBalance: "120.50", 
            initialInvestment: "1000.00", 
            returnOnInvestment: "4892.11"
        },
        { 
            email: "mychaloh@gmail.com", 
            firstName: "Herron", 
            lastName: "Chaloh", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "1550.75", 
            totalProfit: "520.10", 
            profitBalance: "120.50", 
            initialInvestment: "1000.00", 
            returnOnInvestment: "4892.11"
        },
    ];

    if (!localStorage.getItem('mockUsers')) {
        localStorage.setItem('mockUsers', JSON.stringify(initialUsers));
        console.log("Initial mock database loaded.");
    }
}

initializeMockUsers();


// --- REGISTRATION FUNCTION ---
function registerMock() {
    const newEmail = document.getElementById('regEmail').value.trim();
    const newPass = document.getElementById('regPassword').value.trim();
    const newFirstName = document.getElementById('regFirstName').value.trim();
    const newLastName = document.getElementById('regLastName').value.trim();
    const newCountry = document.getElementById('regCountry').value;

    if (!newEmail || !newPass || !newFirstName || !newLastName || !newCountry) {
        alert("Please fill in all registration fields.");
        return;
    }

    const normalizedEmail = newEmail.toLowerCase(); 

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);

    const emailExists = users.some(user => user.email === normalizedEmail);
    if (emailExists) {
        alert("This email is already registered.");
        return;
    }

    const newUser = { 
        email: normalizedEmail, 
        firstName: newFirstName, 
        lastName: newLastName, 
        country: newCountry, 
        pass: newPass, 
        accountBalance: "0.00",
        totalProfit: "0.00",
        profitBalance: "0.00",
        returnOnInvestment: "0.00",
        initialInvestment: "0.00"
    };
    users.push(newUser);

    console.log(`[DEV LOG] New user registered:`, newUser);

    localStorage.setItem('mockUsers', JSON.stringify(users));

    alert(`Registration successful! Welcome, ${newFirstName}. You can now log in.`);
    window.location.href = '../login.html'; 
}


// --- LOGIN FUNCTION ---
function loginMock() {
    const loginEmail = document.getElementById('emailInput').value.trim();
    const loginPass = document.getElementById('passwordInput').value.trim();

    const normalizedLoginEmail = loginEmail.toLowerCase(); 

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);

    const foundUser = users.find(user => user.email === normalizedLoginEmail);

    if (foundUser) {
        
        if (foundUser.pass !== null) {
            if (foundUser.pass === loginPass) {
                sessionStorage.setItem('currentUserEmail', foundUser.email);
                window.location.href = '../dashboard/index.html';
                return;
            } else {
                alert("Incorrect password.");
                return;
            }
        } 
        
        else {
            sessionStorage.setItem('currentUserEmail', foundUser.email);
            window.location.href = '../dashboard/index.html';
            return;
        }
    } 
    
    alert("Email not found. Please check your spelling or register.");
}


// --- DASHBOARD AND LOGOUT ---

function loadDashboard() {
    const userEmail = sessionStorage.getItem('currentUserEmail');

    if (!userEmail) {
        window.location.href = '../login.html';
        return;
    }

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);
    
    const normalizedSessionEmail = userEmail.toLowerCase();
    const currentUser = users.find(user => user.email === normalizedSessionEmail);
    
    if (currentUser) {
        
        // --- PERSONAL DETAILS ---
        const firstName = currentUser.firstName ?? '';
        const lastName = currentUser.lastName ?? '';
        
        const greetingElements = document.getElementsByClassName('user-greeting-name');
        for (let i = 0; i < greetingElements.length; i++) {
            greetingElements[i].textContent = firstName + " " + lastName;
        }
        
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userCountry').textContent = currentUser.country;

        const status = currentUser.pass === null ? 'Existing Mock User' : 'Newly Registered User';
        document.getElementById('userStatus').textContent = status;

        // --- FINANCIAL DATA UPDATE ---
        document.getElementById('accountBalance').textContent = currentUser.accountBalance;
        document.getElementById('totalProfit').textContent = currentUser.totalProfit;
        document.getElementById('profitBalance').textContent = currentUser.profitBalance;
        document.getElementById('initialInvestment').textContent = currentUser.initialInvestment;
        document.getElementById('returnOnInvestment').textContent = currentUser.returnOnInvestment;
        
    } else {
        logoutMock();
    }
}

function logoutMock() {
    sessionStorage.removeItem('currentUserEmail'); 
    alert("You have been logged out.");
    window.location.href = '../index.html';
}


// Ensures dashboard elements are loaded after the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.user-greeting-name')) {
        loadDashboard();
    }
});

function copyText() {
    const input = document.getElementById("myInput");
    const message = document.getElementById("message");
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(input.value)
            .then(() => {
                message.textContent = "Copied to clipboard!";
                setTimeout(() => { message.textContent = ""; }, 3000);
            })
            .catch(err => {
                message.textContent = "Copy failed.";
                console.error('Copy Error:', err);
            });
    } else {
        message.textContent = "Feature unavailable";
    }
}
