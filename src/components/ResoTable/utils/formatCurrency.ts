const formatCurrency = (amount: any) => {
  if (!isNaN(amount)) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }
  return '-';
};

export default formatCurrency;
