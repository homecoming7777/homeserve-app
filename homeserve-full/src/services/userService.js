export const userService = {
  getAllUsers: () => JSON.parse(localStorage.getItem('users') || '[]'),
  getUserById: (id) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === id);
    if (user && user.wallet_balance === undefined) user.wallet_balance = 1000;
    return user;
  },
  updateUser: (id, updates) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
    const current = localStorage.getItem('currentUser');
    if (current && JSON.parse(current).id === id) {
      localStorage.setItem('currentUser', JSON.stringify(users[index]));
    }
    return users[index];
  },
  ensureWalletBalance: (user) => {
    if (user.wallet_balance === undefined) {
      return userService.updateUser(user.id, { wallet_balance: 1000 });
    }
    return user;
  }
};