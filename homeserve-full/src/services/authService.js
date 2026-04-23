import { seedDatabase } from './seedData';
import { userService } from './userService';

export const authService = {
  register: (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }
    const newUser = {
      ...userData,
      id: crypto.randomUUID(),
      wallet_balance: 1000,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    const token = crypto.randomUUID();
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { user: newUser, token };
  },

  registerOnly: (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }
    const newUser = {
      ...userData,
      id: crypto.randomUUID(),
      wallet_balance: 1000,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  },

  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    if (user.wallet_balance === undefined) {
      user = userService.updateUser(user.id, { wallet_balance: 1000 });
    }
    const token = crypto.randomUUID();
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { user, token };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

seedDatabase();