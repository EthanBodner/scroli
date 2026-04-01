export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  if (hours === 0) {
    return `${mins}m`;
  }

  return `${hours}h ${mins}m`;
};

export const formatMoney = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};
