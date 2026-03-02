// --- CURRENCY UTILITIES ---

/**
 * Converts a currency string (e.g., "1,550.75" or "49,100") into a float number.
 */
function parseCurrency(currencyString) {
    if (typeof currencyString !== 'string') return 0;
    const cleaned = currencyString.replace(/,/g, '');
    return parseFloat(cleaned) || 0;
}

/**
 * Converts a float number (e.g., 1550.75) into a formatted currency string (e.g., "1,550.75").
 */
function formatCurrency(number) {
    if (typeof number !== 'number' || isNaN(number)) return "0.00";
    const sign = number < 0 ? "-" : "";
    const absoluteNumber = Math.abs(number);
    return sign + absoluteNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


// --- INVESTMENT PLAN DEFINITIONS ---

const INVESTMENT_PLANS = [
    { id: 'plan_a', name: 'Starter Pack', min: 1000, max: 9999 },
    { id: 'plan_b', name: 'Regular Pack', min: 10000, max: 24999 },
    { id: 'plan_c', name: 'Gold Pack', min: 25000, max: 49999 },
    { id: 'plan_d', name: 'Ruby Pack', min: 50000, max: 100000 },
    { id: 'plan_e', name: 'Premium Pack', min: 200000, max: 1000000 }
];


// --- DATABASE INITIALIZATION ---

function initializeMockUsers() {
    const initialUsers = [
        { 
            email: "almightyrick8@gmail.com", 
            firstName: "Rick", 
            lastName: "Aguiar", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "49,100", 
            totalProfit: "49,100", 
            profitBalance: "49,100", 
            initialInvestment: "0.00", 
            returnOnInvestment: "49,100",
            investments: []
        },
        { 
            email: "larrylovato59@gmail.com", 
            firstName: "Larry", 
            lastName: "Lovato", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "39,000", 
            totalProfit: "39,000", 
            profitBalance: "39,000", 
            initialInvestment: "3,200.00", 
            returnOnInvestment: "39,000",
            investments: []
        },
        { 
            email: "mychaloh@gmail.com", 
            firstName: "Herron", 
            lastName: "Chaloh", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "18,800", 
            totalProfit: "18,800", 
            profitBalance: "18,800", 
            initialInvestment: "0.00", 
            returnOnInvestment: "18,800",
            investments: []
        },
    ];

    const existingUsersJSON = localStorage.getItem('mockUsers');
    const existingUsers = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];
    const userMap = new Map();

    // Preserve all existing users 
    existingUsers.forEach(user => {
        userMap.set(user.email.toLowerCase(), user); 
    });
    
    // Overwrite/Add mock users with fresh definitions
    initialUsers.forEach(mockUser => {
        const existingData = userMap.get(mockUser.email.toLowerCase());
        userMap.set(mockUser.email.toLowerCase(), { 
            ...mockUser, 
            investments: existingData ? (existingData.investments || []) : [] 
        }); 
    });

    const mergedUsers = Array.from(userMap.values());
    localStorage.setItem('mockUsers', JSON.stringify(mergedUsers));

    console.log("Mock data synchronized.");
}

initializeMockUsers();


// --- AUTHENTICATION & SESSION LOGIC ---

/**
 * Retrieves the current user from session and local storage.
 */
function getCurrentUser(redirectIfMissing = true) {
    const userEmail = sessionStorage.getItem('currentUserEmail');
    
    if (!userEmail) {
        if (redirectIfMissing) {
            window.location.href = '../index.html';
        }
        return null;
    }

    const storedUsersJSON = localStorage.getItem('mockUsers');
    if (!storedUsersJSON) return null;
    
    const users = JSON.parse(storedUsersJSON);
    const currentUser = users.find(user => user.email === userEmail.toLowerCase());

    if (!currentUser && redirectIfMissing) {
        logoutMock(); 
        return null;
    }
    
    return currentUser;
}

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
        initialInvestment: "0.00",
        investments: []
    };
    users.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(users));

    alert(`Registration successful! Welcome, ${newFirstName}. You can now log in.`);
    window.location.href = '../login.html'; 
}


function loginMock() {
    const loginEmail = document.getElementById('emailInput').value.trim();
    const loginPass = document.getElementById('passwordInput').value.trim();

    const normalizedLoginEmail = loginEmail.toLowerCase(); 
    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);
    const foundUser = users.find(user => user.email === normalizedLoginEmail);

    if (foundUser) {
        // Mock users (pass: null) bypass password check.
        const passwordMatches = foundUser.pass === loginPass || foundUser.pass === null;

        if (passwordMatches) {
            sessionStorage.setItem('currentUserEmail', foundUser.email);
            window.location.href = '../dashboard/index.html';
            return;
        } else {
            alert("Incorrect password.");
            return;
        }
    } 
    
    alert("Email not found. Please check your spelling or register.");
}


function logoutMock() {
    sessionStorage.removeItem('currentUserEmail'); 
    alert("You have been logged out.");
    window.location.href = '../index.html';
}


// --- DATA DISPLAY AND INITIALIZATION ---

function loadDashboard() {
    const currentUser = getCurrentUser(); 
    if (!currentUser) return;

    // Update user name display
    const fullName = `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`;
    document.querySelectorAll('.user-greeting-name').forEach(el => el.textContent = fullName);
    document.getElementById('userEmail').textContent = currentUser.email;

    // Update financial metrics based on data-metric attributes
    document.querySelectorAll('.financial-metric').forEach(element => {
        const metricKey = element.getAttribute('data-metric');
        if (metricKey && currentUser[metricKey] !== undefined) {
            element.textContent = currentUser[metricKey]; 
        } else {
            element.textContent = "N/A";
        }
    });
}

/**
 * Initializes investment plans page with current balance and card constraints.
 */
function loadInvestmentPage() {
    const currentUser = getCurrentUser(false);
    if (!currentUser) return;

    // Update Balance Display
    const currentBalanceEl = document.getElementById('currentBalance');
    if (currentBalanceEl) {
        currentBalanceEl.textContent = currentUser.accountBalance;
    }

    // Initialize plan cards with min/max constraints
    INVESTMENT_PLANS.forEach(plan => {
        const rangeEl = document.getElementById(`range-${plan.id}`);
        const inputEl = document.getElementById(`amount-${plan.id}`);
        
        if (!rangeEl || !inputEl) return;

        rangeEl.innerHTML = `$${formatCurrency(plan.min)} <span class="text-secondary fw-normal">to</span> $${formatCurrency(plan.max)}`;
        inputEl.placeholder = `Enter amount ($${formatCurrency(plan.min)} - $${formatCurrency(plan.max)})`;
        inputEl.min = plan.min;
        inputEl.max = plan.max;
        inputEl.value = ''; 
    });
}


// --- INVESTMENT TRANSACTION LOGIC ---

/**
 * Handles the investment transaction, validating input and updating user balance.
 */
function handleInvestment(planId) {
    const userEmail = sessionStorage.getItem('currentUserEmail');
    if (!userEmail) {
        window.location.href = '../index.html'; 
        return;
    }
    
    const amountInput = document.getElementById(`amount-${planId}`);
    const investmentAmount = parseCurrency(amountInput.value);

    const plan = INVESTMENT_PLANS.find(p => p.id === planId);
    if (!plan) return alert("Invalid investment plan selected.");

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);
    const userIndex = users.findIndex(user => user.email.toLowerCase() === userEmail.toLowerCase());
    
    if (userIndex === -1) return alert("Account not found for transaction.");
    
    const currentUser = users[userIndex];
    const currentBalance = parseCurrency(currentUser.accountBalance);

    // 1. Input Validation (Positive)
    if (investmentAmount <= 0) return alert("Please enter an investment amount.");
    
    // 2. Input Validation (Range)
    if (investmentAmount < plan.min) return alert(`Amount too low. Minimum required: $${formatCurrency(plan.min)}.`);
    if (investmentAmount > plan.max) return alert(`Amount too high. Maximum allowed: $${formatCurrency(plan.max)}.`);

    // 3. Sufficient Balance
    if (currentBalance < investmentAmount) {
        return alert("Insufficient account balance. Please deposit funds.");
    }

    // --- TRANSACTION SUCCESS ---
    const newBalance = currentBalance - investmentAmount;
    const newInitialInvestment = parseCurrency(currentUser.initialInvestment) + investmentAmount;
    
    currentUser.accountBalance = formatCurrency(newBalance);
    currentUser.initialInvestment = formatCurrency(newInitialInvestment);
    
    // Add transaction record
    const investmentRecord = { planName: plan.name, amount: formatCurrency(investmentAmount), date: new Date().toLocaleDateString() };
    if (!currentUser.investments) currentUser.investments = [];
    currentUser.investments.push(investmentRecord); 
    
    users[userIndex] = currentUser;
    localStorage.setItem('mockUsers', JSON.stringify(users));

    // Success Feedback
    amountInput.value = '';
    loadInvestmentPage(); 
    alert(`Success! $${formatCurrency(investmentAmount)} invested in ${plan.name}.`);
}


// --- COPY FUNCTION ---
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


// -----------------------------------------------------------
// Expose functions globally for HTML event handlers
// -----------------------------------------------------------
window.handleInvestment = handleInvestment;
window.logoutMock = logoutMock;
window.registerMock = registerMock;
window.loginMock = loginMock;
window.loadDashboard = loadDashboard;
window.loadInvestmentPage = loadInvestmentPage;
window.copyText = copyText;


// --- INITIAL PAGE LOAD SETUP ---
document.addEventListener('DOMContentLoaded', () => {
    // Determine which page is loaded and run the correct initializer
    if (document.querySelector('#currentBalance')) {
        loadInvestmentPage();
    } else if (document.querySelector('.user-greeting-name')) {
        loadDashboard();
    }
});