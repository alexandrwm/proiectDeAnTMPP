// Interfață comună pentru Composite Pattern
export class CategoryComponent {
  getName() {}
  getTransactions() {}
}

// Clasa concretă pentru categorii (poate fi și leaf, și composite)
export class Category extends CategoryComponent {
  constructor(name) {
    super();
    this.name = name;
    this.children = [];
    this.transactions = [];
  }

  add(component) {
    this.children.push(component);
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  getName() {
    return this.name;
  }

  getTransactions() {
    let allTransactions = [...this.transactions];
    this.children.forEach(child => {
      allTransactions = allTransactions.concat(child.getTransactions());
    });
    return allTransactions;
  }

  getNames() {
    let names = [this.name];
    this.children.forEach(child => {
      if (typeof child.getName === 'function') {
        names.push(child.getName());
      }
    });
    return names;
  }
}