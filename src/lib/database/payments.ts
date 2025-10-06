import { ObjectId } from 'mongodb';
import { getDatabase } from '../mongodb';
import { PaymentDocument, convertPaymentDocument, toMongoId } from './types';
import { CreatePaymentData, Payment } from '@/types';

export class PaymentService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<PaymentDocument>('payments');
  }

  async create(data: CreatePaymentData): Promise<Payment> {
    const collection = await this.getCollection();
    const now = new Date();
    
    const document: Omit<PaymentDocument, '_id'> = {
      loanId: data.loanId,
      amount: data.amount,
      paymentDate: new Date(data.paymentDate),
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(document);
    
    return convertPaymentDocument({
      ...document,
      _id: result.insertedId,
    });
  }

  async findByLoanId(loanId: string): Promise<Payment[]> {
    const collection = await this.getCollection();
    const documents = await collection
      .find({ loanId })
      .sort({ paymentDate: -1 })
      .toArray();
    
    return documents.map(convertPaymentDocument);
  }

  async findById(id: string): Promise<Payment | null> {
    const collection = await this.getCollection();
    const document = await collection.findOne({
      _id: toMongoId(id),
    });

    if (!document) {
      return null;
    }

    return convertPaymentDocument(document);
  }

  async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: toMongoId(id) });
    return result.deletedCount > 0;
  }
}
