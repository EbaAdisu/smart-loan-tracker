import { ObjectId } from 'mongodb';
import { getDatabase } from '../mongodb';
import { LoanDocument, convertLoanDocument, toMongoId } from './types';
import { CreateLoanData, UpdateLoanData, Loan } from '@/types';

export class LoanService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<LoanDocument>('loans');
  }

  async findMany(userId: string): Promise<Loan[]> {
    const collection = await this.getCollection();
    const documents = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return documents.map(convertLoanDocument);
  }

  async findById(id: string, userId: string): Promise<Loan | null> {
    const collection = await this.getCollection();
    const document = await collection.findOne({
      _id: toMongoId(id),
      userId,
    });

    if (!document) {
      return null;
    }

    return convertLoanDocument(document);
  }

  async create(data: CreateLoanData & { userId: string }): Promise<Loan> {
    const collection = await this.getCollection();
    const now = new Date();
    
    const document: Omit<LoanDocument, '_id'> = {
      userId: data.userId,
      personName: data.personName,
      amount: data.amount,
      remainingAmount: data.amount,
      loanType: data.loanType,
      description: data.description,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(document);
    
    return convertLoanDocument({
      ...document,
      _id: result.insertedId,
    });
  }

  async update(id: string, userId: string, data: UpdateLoanData): Promise<Loan | null> {
    const collection = await this.getCollection();
    
    // Verify the loan belongs to the user
    const existingLoan = await collection.findOne({
      _id: toMongoId(id),
      userId,
    });

    if (!existingLoan) {
      return null;
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: toMongoId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return null;
    }

    return convertLoanDocument(result);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const collection = await this.getCollection();
    
    // Verify the loan belongs to the user
    const existingLoan = await collection.findOne({
      _id: toMongoId(id),
      userId,
    });

    if (!existingLoan) {
      return false;
    }

    const result = await collection.deleteOne({ _id: toMongoId(id) });
    return result.deletedCount > 0;
  }

  async updateRemainingAmount(id: string, newRemainingAmount: number): Promise<void> {
    const collection = await this.getCollection();
    
    await collection.updateOne(
      { _id: toMongoId(id) },
      {
        $set: {
          remainingAmount: Math.max(0, newRemainingAmount),
          status: newRemainingAmount <= 0 ? 'PAID' : 'ACTIVE',
          updatedAt: new Date(),
        },
      }
    );
  }
}
