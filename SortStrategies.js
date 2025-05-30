export class SortContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(transactions) {
    return this.strategy.sort(transactions);
  }
}

// Strategii concrete
export class SortByAmount {
  sort(transactions) {
    return [...transactions].sort((a, b) => a.amount - b.amount);
  }
}

export class SortByDate {
  sort(transactions) {
    return [...transactions].sort((a, b) => a.id - b.id);
  }
}

export class SortByType {
  sort(transactions) {
    return [...transactions].sort((a, b) => 
      (a.type ?? '').localeCompare(b.type ?? '')
    );
  }
}
