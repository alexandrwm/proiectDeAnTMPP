export class TransactionDecorator {
  constructor(transaction) {
    this.transaction = transaction;
  }

  get title() {
    return this.transaction.title ?? '';
  }

  get amount() {
    return this.transaction.amount ?? 0;
  }

  get type() {
    return this.transaction.type ?? 'Necunoscut';
  }

  get id() {
    return this.transaction.id ?? 0;
  }

  get category() {
    return this.transaction.category ?? '-';
  }
}

export class WithVAT extends TransactionDecorator {
  get amount() {
    return this.transaction.amount * 1.20;
  }

  get title() {
    return this.transaction.title + " +TVA";
  }
}

export class WithDiscount extends TransactionDecorator {
  get amount() {
    return this.transaction.amount * 0.90;
  }

  get title() {
    return this.transaction.title + " -Discount";
  }
}

export function withTVA(transaction) {
  return new WithVAT(transaction);
}

export function withDiscount(transaction) {
  return new WithDiscount(transaction);
}