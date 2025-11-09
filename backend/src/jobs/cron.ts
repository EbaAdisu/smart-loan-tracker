// Cron jobs for scheduled tasks
import cron from 'node-cron';
import loanService from '../services/loan.service';
import notificationService from '../services/notification.service';
import logger from '../utils/logger';

export class CronJobs {
  // Check for loans due soon (runs daily at 9 AM)
  static checkDueLoans = cron.schedule(
    '0 9 * * *',
    async () => {
      try {
        logger.info('Running cron job: Check due loans');

        const dueLoans = await loanService.getLoansDueSoon(3);

        for (const loan of dueLoans) {
          // Notify borrower
          const daysUntilDue = Math.ceil(
            (loan.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          await notificationService.notifyLoanDue(
            loan.borrowerUserId,
            loan.loanId,
            daysUntilDue
          );
        }

        logger.success(`Processed ${dueLoans.length} loans due soon`);
      } catch (error) {
        logger.error('Error in checkDueLoans cron job', error);
      }
    },
    {
      scheduled: false, // Will be started manually
      timezone: 'UTC',
    }
  );

  // Check for overdue loans (runs daily at 9 AM)
  static checkOverdueLoans = cron.schedule(
    '0 9 * * *',
    async () => {
      try {
        logger.info('Running cron job: Check overdue loans');

        const overdueLoans = await loanService.checkOverdueLoans();

        for (const loan of overdueLoans) {
          // Notify both borrower and lender
          await notificationService.notifyLoanOverdue(loan.borrowerUserId, loan.loanId);
          await notificationService.notifyLoanOverdue(loan.lenderUserId, loan.loanId);
        }

        logger.success(`Processed ${overdueLoans.length} overdue loans`);
      } catch (error) {
        logger.error('Error in checkOverdueLoans cron job', error);
      }
    },
    {
      scheduled: false,
      timezone: 'UTC',
    }
  );

  // Aggregate analytics (runs daily at 2 AM)
  static aggregateAnalytics = cron.schedule(
    '0 2 * * *',
    async () => {
      try {
        logger.info('Running cron job: Aggregate analytics');

        // This is a placeholder for analytics aggregation
        // In a production system, you might cache analytics data here
        // For now, we'll just log that the job ran

        logger.success('Analytics aggregation completed');
      } catch (error) {
        logger.error('Error in aggregateAnalytics cron job', error);
      }
    },
    {
      scheduled: false,
      timezone: 'UTC',
    }
  );

  // Start all cron jobs
  static startAll() {
    logger.info('Starting all cron jobs...');
    this.checkDueLoans.start();
    this.checkOverdueLoans.start();
    this.aggregateAnalytics.start();
    logger.success('All cron jobs started');
  }

  // Stop all cron jobs
  static stopAll() {
    logger.info('Stopping all cron jobs...');
    this.checkDueLoans.stop();
    this.checkOverdueLoans.stop();
    this.aggregateAnalytics.stop();
    logger.success('All cron jobs stopped');
  }
}

export default CronJobs;

