require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/auth.routes');
const groupRoutes = require('./routes/group.routes');
const expenseRoutes = require('./routes/expense.routes');
const balanceRoutes = require('./routes/balance.routes');
const currencyRoutes = require('./routes/currency.routes');
const receiptRoutes = require('./routes/receipt.routes');
const nudgeRoutes = require('./routes/nudge.routes');
const inviteRoutes = require('./routes/invite.routes');
const userRoutes = require('./routes/user.routes');
const friendRoutes = require('./routes/friend.routes');

// Start cron jobs
require('./jobs/currencyRefresh.job');
require('./jobs/recurringExpense.job');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'SplitWave API', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/receipt', receiptRoutes);
app.use('/api/nudge', nudgeRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 SplitWave API running on http://localhost:${PORT}`);
});

module.exports = app;
