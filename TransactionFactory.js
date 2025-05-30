export class Transaction {
    constructor(id, title, amount, category) {
        this.id = id;
        this.title = title;
        this.amount = parseFloat(amount);
        this.category = category;
        this.type = category;
    }
}

export class TransactionFactory {
    static createTransaction(title, amount, category) {
        return new Transaction(Date.now(), title, amount, category);
    }
}