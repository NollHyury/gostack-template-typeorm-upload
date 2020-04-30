import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  categoryString: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    categoryString,
  }: TransactionDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionRepository.getBalance();
    if (type === 'income' || type === 'outcome') {
      if (type === 'outcome' && balance.total < value) {
        throw new AppError(
          'value of outcome is most expensive than your income value!',
          400,
        );
      }
      const categoryRepository = getRepository(Category);

      const category = await categoryRepository.findOne({
        where: { title: categoryString },
      });
      const transaction = transactionRepository.create({
        title,
        value,
        type,
        category,
      });
      if (!category) {
        const newCategory = categoryRepository.create({
          title: categoryString,
        });
        await categoryRepository.save(newCategory);
        transaction.category = newCategory;
      }
      await transactionRepository.save(transaction);
      return transaction;
    }
    throw new AppError('Type of transaction is not valid', 400);
  }
}

export default CreateTransactionService;
