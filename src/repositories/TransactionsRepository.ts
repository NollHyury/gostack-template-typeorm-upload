import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const totalIncome = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((acumulator, currentValue) => {
        return acumulator + currentValue.value;
      }, 0);

    const totalOutcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((acumulator, currentValue) => {
        return acumulator + currentValue.value;
      }, 0);

    const totalBalance: Balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };
    return totalBalance;
  }
}

export default TransactionsRepository;
