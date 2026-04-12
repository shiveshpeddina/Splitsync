import ExpenseCard from './ExpenseCard';
import EmptyState from '../common/EmptyState';

const ExpenseList = ({ expenses, members, onExpenseClick, onDeleteExpense }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="No expenses yet"
        description="Start adding expenses to track your group spending and settle up easily."
      />
    );
  }

  return (
    <div className="expense-list stagger-children">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          members={members}
          onClick={() => onExpenseClick?.(expense)}
          onDelete={onDeleteExpense}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
