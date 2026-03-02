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

// Baseline for current session to calculate growth
const SESSION_START_TIME = Date.now();
const INCREMENT_RATE_PER_SECOND = 0.05; // Adjust speed of profit growth here

function initializeMockUsers() {
    const initialUsers = [
        { 
            email: "danpats@comcast.net", 
            firstName: "Daniel", 
            lastName: "McAlpine", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "48.00", 
            totalProfit: "308,628.00", 
            profitBalance: "0.00", 
            initialInvestment: "4,048.00", 
            returnOnInvestment: "296,771.00",
            investments: []
        },
        { 
            email: "oarojas@aol.com", 
            firstName: "Oscar", 
            lastName: "Rojas", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "0.00", 
            totalProfit: "387,811.00", 
            profitBalance: "0.00", 
            initialInvestment: "0.00", 
            returnOnInvestment: "371,000.00",
            investments: []
        },
        { 
            email: "denisjules@gmail.com", 
            firstName: "Denis", 
            lastName: "Jules Guimond", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "42,060.03", 
            totalProfit: "42,060.03", 
            profitBalance: "42,060.03", 
            initialInvestment: "230.06", 
            returnOnInvestment: "42,060.03",
            investments: []
        },
        { 
            email: "jwstanley25@gmail.com", 
            firstName: "Jim", 
            lastName: "Stanley", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "10,000.00", 
            totalProfit: "10,000.00", 
            profitBalance: "10,000.00", 
            initialInvestment: "1350.00", 
            returnOnInvestment: "10,000.00",
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
}

/**
 * Applies temporal growth to a user object for display purposes.
 * This ensures financial metrics like Total Profit and ROI increment in real-time.
 */
function getCalculatedUser(user) {
    if (!user) return null;
    
    const secondsElapsed = (Date.now() - SESSION_START_TIME) / 1000;
    const increment = secondsElapsed * INCREMENT_RATE_PER_SECOND;

    // Create a copy to avoid mutating the original source data
    const updatedUser = { ...user };
    
    // Increment specific numeric metrics for visual effect in the UI
    updatedUser.totalProfit = formatCurrency(parseCurrency(user.totalProfit) + increment);
    updatedUser.returnOnInvestment = formatCurrency(parseCurrency(user.returnOnInvestment) + increment);
    
    // Increment profit balance at a slightly lower rate
    updatedUser.profitBalance = formatCurrency(parseCurrency(user.profitBalance) + (increment * 0.5));

    return updatedUser;
}

initializeMockUsers();


// --- AUTHENTICATION & SESSION LOGIC ---

/**
 * Retrieves the current user and applies real-time growth calculations.
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
    
    // Return the user with real-time increments applied to financial metrics
    return getCalculatedUser(currentUser);
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
    const render = () => {
        const currentUser = getCurrentUser(); 
        if (!currentUser) return;

        const fullName = `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`;
        document.querySelectorAll('.user-greeting-name').forEach(el => el.textContent = fullName);
        document.getElementById('userEmail').textContent = currentUser.email;

        // Updates all elements with the financial-metric class with the incrementing values
        document.querySelectorAll('.financial-metric').forEach(element => {
            const metricKey = element.getAttribute('data-metric');
            if (metricKey && currentUser[metricKey] !== undefined) {
                element.textContent = currentUser[metricKey]; 
            } else {
                element.textContent = "N/A";
            }
        });
    };

    render();
    // Refresh display every second to show increasing numbers
    setInterval(render, 1000);
}

function loadInvestmentPage() {
    const renderBalance = () => {
        const currentUser = getCurrentUser(false);
        if (!currentUser) return;
        const currentBalanceEl = document.getElementById('currentBalance');
        if (currentBalanceEl) {
            currentBalanceEl.textContent = currentUser.accountBalance;
        }
    };

    renderBalance();
    setInterval(renderBalance, 1000);

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

    if (investmentAmount <= 0) return alert("Please enter an investment amount.");
    if (investmentAmount < plan.min) return alert(`Amount too low. Minimum required: $${formatCurrency(plan.min)}.`);
    if (investmentAmount > plan.max) return alert(`Amount too high. Maximum allowed: $${formatCurrency(plan.max)}.`);

    if (currentBalance < investmentAmount) {
        return alert("Insufficient account balance. Please deposit funds.");
    }

    const newBalance = currentBalance - investmentAmount;
    const newInitialInvestment = parseCurrency(currentUser.initialInvestment) + investmentAmount;
    
    currentUser.accountBalance = formatCurrency(newBalance);
    currentUser.initialInvestment = formatCurrency(newInitialInvestment);
    
    const investmentRecord = { planName: plan.name, amount: formatCurrency(investmentAmount), date: new Date().toLocaleDateString() };
    if (!currentUser.investments) currentUser.investments = [];
    currentUser.investments.push(investmentRecord); 
    
    users[userIndex] = currentUser;
    localStorage.setItem('mockUsers', JSON.stringify(users));

    amountInput.value = '';
    alert(`Success! $${formatCurrency(investmentAmount)} invested in ${plan.name}.`);
    window.location.reload(); 
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

window.handleInvestment = handleInvestment;
window.logoutMock = logoutMock;
window.registerMock = registerMock;
window.loginMock = loginMock;
window.loadDashboard = loadDashboard;
window.loadInvestmentPage = loadInvestmentPage;
window.copyText = copyText;

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#currentBalance')) {
        loadInvestmentPage();
    } else if (document.querySelector('.user-greeting-name')) {
        loadDashboard();
    }
});