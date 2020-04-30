import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface TransactionDeleteDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: TransactionDeleteDTO): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const transaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new AppError('Transaction not found!', 404);
    }

    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
