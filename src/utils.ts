// Formatting utility for Indian Rupees or customized enterprise currency
export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatShortCurrency(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toLocaleString('en-IN', { maximumFractionDigits: 1 })}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function generateId(prefix: string): string {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Download/Print simulation helper
export function triggerPrint() {
  window.print();
}
