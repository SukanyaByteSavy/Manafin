// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    document.getElementById('transaction-date').valueAsDate = new Date();
    document.getElementById('filter-month').value = new Date().toISOString().slice(0, 7);
    
    // Load saved transactions from localStorage
    loadTransactions();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update the dashboard
    updateDashboard();
    
    // Initialize and render chart
    renderExpenseChart();
});

// Global variables
let transactions = [];
const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#2FD1C5', '#C9CBCF', '#6C8893', '#8BBF9F',
    '#D6A2E8', '#F3A683', '#82CCDD', '#EA8685', '#B8E994'
];

// Setup all event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('transaction-form').addEventListener('submit', handleFormSubmit);
    
    // Transaction type change
    document.getElementById('transaction-type').addEventListener('change', handleTransactionTypeChange);
    
    // Filters change
    document.getElementById('filter-type').addEventListener('change', filterTransactions);
    document.getElementById('filter-month').addEventListener('change', filterTransactions);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const type = document.getElementById('transaction-type').value;
    const category = document.getElementById('transaction-category').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const date = document.getElementById('transaction-date').value;
    const description = document.getElementById('transaction-description').value || category;
    
    // Create new transaction object
    const transaction = {
        id: Date.now().toString(),
        type,
        category,
        amount,
        date,
        description
    };
    
    // Add to transactions array
    transactions.unshift(transaction);
    
    // Save to localStorage
    saveTransactions();
    
    // Update UI
    renderTransactionsList();
    updateDashboard();
    renderExpenseChart();
    
    // Reset form
    document.getElementById('transaction-form').reset();
    document.getElementById('transaction-date').valueAsDate = new Date();
}

// Handle transaction type change to filter categories
function handleTransactionTypeChange() {
    const type = document.getElementById('transaction-type').value;
    const incomeCategories = document.querySelectorAll('.income-category');
    const expenseCategories = document.querySelectorAll('.expense-category');
    
    if (type === 'income') {
        incomeCategories.forEach(option => option.style.display = 'block');
        expenseCategories.forEach(option => option.style.display = 'none');
        document.querySelector('.income-category').selected = true;
    } else {
        incomeCategories.forEach(option => option.style.display = 'none');
        expenseCategories.forEach(option => option.style.display = 'block');
        document.querySelector('.expense-category').selected = true;
    }
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Load transactions from localStorage
function loadTransactions() {
    const saved = localStorage.getItem('transactions');
    if (saved) {
        transactions = JSON.parse(saved);
        renderTransactionsList();
    } else {
        document.getElementById('no-transactions').classList.remove('hidden');
    }
}

// Render transactions list
function renderTransactionsList() {
    const tbody = document.getElementById('transactions-list');
    const noTransactions = document.getElementById('no-transactions');
    
    if (transactions.length === 0) {
        tbody.innerHTML = '';
        noTransactions.classList.remove('hidden');
        return;
    }
    
    noTransactions.classList.add('hidden');
    tbody.innerHTML = '';
    
    const filteredTransactions = getFilteredTransactions();
    
    if (filteredTransactions.length === 0) {
        tbody.innerHTML = '';
        noTransactions.classList.remove('hidden');
        return;
    }
    
    filteredTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.className = transaction.type === 'income' ? 'income-row' : 'expense-row';
        
        const formattedAmount = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(transaction.amount);
        
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.category}</td>
            <td>${transaction.description}</td>
            <td class="amount-${transaction.type}">${transaction.type === 'income' ? '+' : '-'}${formattedAmount}</td>
            <td>
                <button class="action-btn delete-btn" data-id="${transaction.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteTransaction);
    });
}

// Handle delete transaction
function handleDeleteTransaction(e) {
    const id = e.currentTarget.getAttribute('data-id');
    
    // Filter out the transaction
    transactions = transactions.filter(t => t.id !== id);
    
    // Save to localStorage
    saveTransactions();
    
    // Update UI
    renderTransactionsList();
    updateDashboard();
    renderExpenseChart();
}

// Filter transactions based on selected filters
function filterTransactions() {
    renderTransactionsList();
}

// Get filtered transactions based on selected filters
function getFilteredTransactions() {
    const filterType = document.getElementById('filter-type').value;
    const filterMonth = document.getElementById('filter-month').value;
    
    return transactions.filter(transaction => {
        // Filter by type
        if (filterType !== 'all' && transaction.type !== filterType) {
            return false;
        }
        
        // Filter by month
        if (filterMonth && !transaction.date.startsWith(filterMonth)) {
            return false;
        }
        
        return true;
    });
}

// Update dashboard summary
function updateDashboard() {
    const filteredTransactions = getFilteredTransactions();
    
    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;
    
    filteredTransactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }
    });
    
    const balance = totalIncome - totalExpenses;
    
    // Format amounts
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };
    
    // Update UI
    document.getElementById('total-income').textContent = formatAmount(totalIncome);
    document.getElementById('total-expenses').textContent = formatAmount(totalExpenses);
    document.getElementById('balance').textContent = formatAmount(balance);
    
    // Add color based on balance
    const balanceElement = document.getElementById('balance');
    if (balance < 0) {
        balanceElement.style.color = 'var(--secondary-color)';
    } else {
        balanceElement.style.color = 'var(--success-color)';
    }
}

// Render expense chart
function renderExpenseChart() {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    
    // Get filtered transactions
    const filteredTransactions = getFilteredTransactions();
    
    // Get expense categories and their total amounts
    const expensesByCategory = {};
    
    filteredTransactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            if (expensesByCategory[transaction.category]) {
                expensesByCategory[transaction.category] += transaction.amount;
            } else {
                expensesByCategory[transaction.category] = transaction.amount;
            }
        }
    });
    
    const categories = Object.keys(expensesByCategory);
    const amounts = Object.values(expensesByCategory);
    
    // Destroy previous chart if exists
    if (window.expenseChart) {
        window.expenseChart.destroy();
    }
    
    // Create new chart
    window.expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: colors.slice(0, categories.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Expense Breakdown',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initial transaction type setup
handleTransactionTypeChange();
