export class BudgetManager {
    static instance;
    transactions = [];

    static getInstance() {
        if (!BudgetManager.instance) {
            BudgetManager.instance = new BudgetManager();
        }
        return BudgetManager.instance;
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
    }

    getTotals() {
        let totalIncome = 0;
        let totalExpense = 0;

        this.transactions.forEach(t => {
            if (t.type === "Venit") {
                totalIncome += parseFloat(t.amount);
            } else if (t.type === "Cheltuială") {
                totalExpense += parseFloat(t.amount);
            }
        });

        return { 
            income: totalIncome, 
            expense: totalExpense, 
            balance: totalIncome - totalExpense 
        };
    }

    getAll() {
        return this.transactions;
    }
}