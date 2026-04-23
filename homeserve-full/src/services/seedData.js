export const seedDatabase = () => {
  if (localStorage.getItem('users')) return;

  // Categories
  const categories = [
    { id: crypto.randomUUID(), name: 'Plumbing' },
    { id: crypto.randomUUID(), name: 'Electricity' },
    { id: crypto.randomUUID(), name: 'Cleaning' },
    { id: crypto.randomUUID(), name: 'Painting' },
    { id: crypto.randomUUID(), name: 'AC Repair' },
    { id: crypto.randomUUID(), name: 'Moving' },
    { id: crypto.randomUUID(), name: 'Carpentry' },
  ];
  localStorage.setItem('categories', JSON.stringify(categories));

  // Areas (Moroccan cities)
  const areas = [
    { id: crypto.randomUUID(), name: 'Casablanca' },
    { id: crypto.randomUUID(), name: 'Rabat' },
    { id: crypto.randomUUID(), name: 'Marrakech' },
    { id: crypto.randomUUID(), name: 'Tangier' },
    { id: crypto.randomUUID(), name: 'Agadir' },
    { id: crypto.randomUUID(), name: 'Fes' },
    { id: crypto.randomUUID(), name: 'Meknes' },
    { id: crypto.randomUUID(), name: 'Oujda' },
    { id: crypto.randomUUID(), name: 'Kenitra' },
    { id: crypto.randomUUID(), name: 'Tetouan' },
  ];
  localStorage.setItem('areas', JSON.stringify(areas));

  // Providers (10)
  const providers = [];
  const providerNames = [
    'FixIt Pro', 'Elite Electric', 'CleanMaster', 'PaintPerfect', 'CoolAir Experts',
    'MoveEasy', 'CarpentryPlus', 'PlumbFast', 'Sparky Electric', 'DeepClean Services'
  ];
  for (let i = 0; i < 10; i++) {
    providers.push({
      id: crypto.randomUUID(),
      name: providerNames[i],
      email: `provider${i+1}@example.com`,
      password: 'password123',
      role: 'provider',
      phone: `06${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: `Area ${i+1}, ${areas[i%areas.length].name}`,
      wallet_balance: 1000,
      createdAt: new Date().toISOString()
    });
  }

  // Clients (5)
  const clients = [
    { id: crypto.randomUUID(), name: 'John Doe', email: 'client@example.com', password: 'password123', role: 'client', phone: '0612345678', address: 'Casablanca', wallet_balance: 1000, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'client', phone: '0687654321', address: 'Rabat', wallet_balance: 1000, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Ahmed Alaoui', email: 'ahmed@example.com', password: 'password123', role: 'client', phone: '0699988777', address: 'Marrakech', wallet_balance: 1000, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Fatima Zahra', email: 'fatima@example.com', password: 'password123', role: 'client', phone: '0677778888', address: 'Fes', wallet_balance: 1000, createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Karim Tazi', email: 'karim@example.com', password: 'password123', role: 'client', phone: '0655554444', address: 'Tangier', wallet_balance: 1000, createdAt: new Date().toISOString() },
  ];
  const allUsers = [...providers, ...clients];
  localStorage.setItem('users', JSON.stringify(allUsers));


  // Add admin user
const admin = {
  id: crypto.randomUUID(),
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin',
  phone: '0612345678',
  address: 'Casablanca',
  wallet_balance: 0,
  createdAt: new Date().toISOString()
};
allUsers.push(admin);

// Add sample reviews
const reviews = [];
for (let i = 0; i < 10; i++) {
  const booking = bookings[i];
  if (booking.status === 'completed') {
    reviews.push({
      id: crypto.randomUUID(),
      booking_id: booking.id,
      client_id: booking.client_id,
      provider_id: booking.provider_id,
      rating: Math.floor(3 + Math.random() * 3),
      comment: 'Great service!',
      created_at: new Date().toISOString()
    });
  }
}
localStorage.setItem('reviews', JSON.stringify(reviews));
  // Services (30)
  const services = [];
  const titles = [
    'Emergency Repair', 'Full Installation', 'Annual Maintenance', 'Deep Cleaning', 'Quick Fix',
    'Painting Service', 'AC Gas Refill', 'Furniture Assembly', 'Leak Repair', 'Wiring Upgrade'
  ];
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];
    for (let j = 0; j < 3; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const area = areas[Math.floor(Math.random() * areas.length)];
      services.push({
        id: crypto.randomUUID(),
        provider_id: provider.id,
        category_id: category.id,
        area_id: area.id,
        title: `${titles[j % titles.length]} ${category.name}`,
        description: `Professional ${category.name.toLowerCase()} service by ${provider.name}. Fast and reliable.`,
        price: Math.floor(50 + Math.random() * 400),
        is_available: true,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
  }
  localStorage.setItem('services', JSON.stringify(services));

  // Bookings (20) with payment fields
  const bookings = [];
  const statuses = ['pending', 'accepted', 'rejected'];
  for (let i = 0; i < 20; i++) {
    const client = clients[i % clients.length];
    const service = services[Math.floor(Math.random() * services.length)];
    const provider = providers.find(p => p.id === service.provider_id);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentStatus = Math.random() > 0.7 ? 'paid' : 'pending';
    bookings.push({
      id: crypto.randomUUID(),
      client_id: client.id,
      service_id: service.id,
      provider_id: provider.id,
      booking_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      address: client.address,
      status: status,
      payment_method: paymentStatus === 'paid' ? (Math.random() > 0.5 ? 'card' : 'wallet') : null,
      payment_status: paymentStatus,
      payment_id: paymentStatus === 'paid' ? crypto.randomUUID() : null,
      paid_at: paymentStatus === 'paid' ? new Date().toISOString() : null,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  localStorage.setItem('bookings', JSON.stringify(bookings));

  // Notifications with title
  const notifications = [];
  for (let i = 0; i < 30; i++) {
    const booking = bookings[i % bookings.length];
    const user = allUsers.find(u => u.id === booking.client_id) || allUsers.find(u => u.id === booking.provider_id);
    notifications.push({
      id: crypto.randomUUID(),
      user_id: user.id,
      title: booking.status === 'accepted' ? 'booking_confirmed' : (booking.payment_status === 'paid' ? 'payment_received' : 'new_booking'),
      message: `Booking #${booking.id.slice(0,6)} is now ${booking.status}`,
      read: false,
      createdAt: new Date().toISOString()
    });
  }
  localStorage.setItem('notifications', JSON.stringify(notifications));
};