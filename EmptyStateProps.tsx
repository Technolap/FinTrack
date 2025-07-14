export interface EmptyStateProps {
  type: 'accounts' | 'transactions' | 'loans' | 'spending' | 'title' | 'description'; // Type of empty state
  title?: string; // Optional title to display
  message?: string; // Optional message to display
  description?: string; // Optional description to display
  buttonLabel?: string; // Optional label for the action button
  onAction: () => void;
}
