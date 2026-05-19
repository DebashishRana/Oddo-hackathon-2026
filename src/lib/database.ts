import { Pool } from 'pg'

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Export pool for use in other modules
export { pool }

export interface User {
  id: number
  google_id?: string | null
  email: string
  password_hash?: string | null
  name?: string
  image_url?: string
  credits: number
  created_at: Date
  updated_at: Date
  last_login: Date
  subscription_status: string
  stripe_customer_id?: string
  subscription_id?: string
  subscription_end_date?: Date
  email_verified?: boolean
  verification_code?: string | null
  verification_code_expires?: Date | null
}

export interface CreateUserData {
  google_id?: string | null
  email: string
  name?: string
  image_url?: string
}

export interface UpdateUserData {
  name?: string
  image_url?: string
  last_login?: Date
}

// Discount Code Interfaces
export interface DiscountCode {
  id: number
  code: string
  stripe_coupon_id?: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_uses?: number
  current_uses: number
  expires_at?: Date
  is_active: boolean
  created_by?: number
  created_at: Date
  updated_at: Date
}

export interface CreateDiscountCodeData {
  code: string
  stripe_coupon_id?: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_uses?: number
  expires_at?: Date | null
  created_by?: number | null
}

export interface UpdateDiscountCodeData {
  code?: string
  discount_type?: 'percentage' | 'fixed'
  discount_value?: number
  max_uses?: number
  expires_at?: Date | null
  is_active?: boolean
}

export interface DiscountValidationResult {
  is_valid: boolean
  discount_id?: number
  discount_type?: 'percentage' | 'fixed'
  discount_value?: number
  error_message?: string
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0] || null
  } finally {
    client.release()
  }
}

export async function createUserWithPassword(email: string, passwordHash: string, name?: string): Promise<User> {
  const client = await pool.connect()
  try {
    const query = `
      INSERT INTO users (email, password_hash, name, created_at, updated_at, last_login)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `
    const result = await client.query(query, [email, passwordHash, name])
    return result.rows[0]
  } finally {
    client.release()
  }
}

export async function getPasswordAuthSchemaStatus(): Promise<{
  hasPasswordHashColumn: boolean
  googleIdIsNullable: boolean | null
}> {
  const client = await pool.connect()
  try {
    const passwordHashColumn = await client.query(
      `
        SELECT EXISTS(
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'password_hash'
        ) as exists
      `
    )

    const googleIdNullable = await client.query(
      `
        SELECT is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = 'google_id'
        LIMIT 1
      `
    )

    const hasPasswordHashColumn = Boolean(passwordHashColumn.rows?.[0]?.exists)
    const isNullableRaw = googleIdNullable.rows?.[0]?.is_nullable
    const googleIdIsNullable = typeof isNullableRaw === 'string' ? isNullableRaw === 'YES' : null

    return { hasPasswordHashColumn, googleIdIsNullable }
  } finally {
    client.release()
  }
}

// Create or update user on login
export async function upsertUser(userData: CreateUserData): Promise<User> {
  const client = await pool.connect()
  
  try {
    // First try to find by email to handle linking
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [userData.email])
    
    if (existingUser.rows.length > 0) {
      // User exists, update google_id if missing (Link Account)
      const query = `
        UPDATE users 
        SET google_id = $1, 
            name = COALESCE(users.name, $2),
            image_url = COALESCE(users.image_url, $3),
            last_login = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE email = $4
        RETURNING *
      `
      const result = await client.query(query, [
        userData.google_id, 
        userData.name, 
        userData.image_url, 
        userData.email
      ])
      return result.rows[0]
    } else {
      // Create new Google user
      const query = `
        INSERT INTO users (google_id, email, name, image_url, last_login)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        RETURNING *
      `
      const result = await client.query(query, [
        userData.google_id, 
        userData.email, 
        userData.name, 
        userData.image_url
      ])
      return result.rows[0]
    }
  } finally {
    client.release()
  }
}

// Get user by Google ID
export async function getUserByGoogleId(googleId: string): Promise<User | null> {
  const client = await pool.connect()
  
  try {
    const query = 'SELECT * FROM users WHERE google_id = $1'
    const result = await client.query(query, [googleId])
    
    return result.rows[0] as User || null
  } finally {
    client.release()
  }
}



// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  const client = await pool.connect()

  try {
    const query = 'SELECT * FROM users WHERE id = $1'
    const result = await client.query(query, [id])

    return result.rows[0] as User || null
  } finally {
    client.release()
  }
}

// Update user's last login
export async function updateUserLastLogin(googleId: string): Promise<void> {
  const client = await pool.connect()
  
  try {
    const query = `
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE google_id = $1
    `
    await client.query(query, [googleId])
  } finally {
    client.release()
  }
}

// Get all users (for admin purposes)
export async function getAllUsers(): Promise<User[]> {
  const client = await pool.connect()
  
  try {
    const query = 'SELECT * FROM users ORDER BY created_at DESC'
    const result = await client.query(query)
    
    return result.rows as User[]
  } finally {
    client.release()
  }
}

// Get user statistics
export async function getUserStats() {
  const client = await pool.connect()
  
  try {
    const queries = await Promise.all([
      client.query('SELECT COUNT(*) as total_users FROM users'),
      client.query('SELECT COUNT(*) as active_today FROM users WHERE last_login >= CURRENT_DATE'),
      client.query('SELECT COUNT(*) as new_this_week FROM users WHERE created_at >= CURRENT_DATE - INTERVAL \'7 days\''),
      client.query('SELECT COUNT(*) as new_this_month FROM users WHERE created_at >= CURRENT_DATE - INTERVAL \'30 days\'')
    ])
    
    return {
      totalUsers: parseInt(queries[0].rows[0].total_users),
      activeToday: parseInt(queries[1].rows[0].active_today),
      newThisWeek: parseInt(queries[2].rows[0].new_this_week),
      newThisMonth: parseInt(queries[3].rows[0].new_this_month)
    }
  } finally {
    client.release()
  }
}

// Admin Functions

// Delete user by ID (admin only)
export async function deleteUserById(userId: number): Promise<boolean> {
  const client = await pool.connect()

  try {
    const query = 'DELETE FROM users WHERE id = $1'
    const result = await client.query(query, [userId])

    return (result.rowCount ?? 0) > 0
  } finally {
    client.release()
  }
}

// Delete user by Google ID (admin only)
export async function deleteUserByGoogleId(googleId: string): Promise<boolean> {
  const client = await pool.connect()

  try {
    const query = 'DELETE FROM users WHERE google_id = $1'
    const result = await client.query(query, [googleId])

    return (result.rowCount ?? 0) > 0
  } finally {
    client.release()
  }
}



// Get recent user activity (admin only)
export async function getRecentUserActivity(limit: number = 50): Promise<User[]> {
  const client = await pool.connect()

  try {
    const query = 'SELECT * FROM users ORDER BY last_login DESC LIMIT $1'
    const result = await client.query(query, [limit])

    return result.rows as User[]
  } finally {
    client.release()
  }
}

// Get users by date range (admin only)
export async function getUsersByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
  const client = await pool.connect()

  try {
    const query = `
      SELECT * FROM users
      WHERE created_at >= $1 AND created_at <= $2
      ORDER BY created_at DESC
    `
    const result = await client.query(query, [startDate, endDate])

    return result.rows as User[]
  } finally {
    client.release()
  }
}

// Search users by email or name (admin only)
export async function searchUsers(searchTerm: string): Promise<User[]> {
  const client = await pool.connect()

  try {
    const query = `
      SELECT * FROM users
      WHERE email ILIKE $1 OR name ILIKE $1
      ORDER BY created_at DESC
    `
    const result = await client.query(query, [`%${searchTerm}%`])

    return result.rows as User[]
  } finally {
    client.release()
  }
}

// Get detailed user statistics (admin only)
export async function getDetailedUserStats() {
  const client = await pool.connect()

  try {
    const queries = await Promise.all([
      client.query('SELECT COUNT(*) as total_users FROM users'),
      client.query('SELECT COUNT(*) as active_today FROM users WHERE last_login >= CURRENT_DATE'),
      client.query('SELECT COUNT(*) as active_week FROM users WHERE last_login >= CURRENT_DATE - INTERVAL \'7 days\''),
      client.query('SELECT COUNT(*) as active_month FROM users WHERE last_login >= CURRENT_DATE - INTERVAL \'30 days\''),
      client.query('SELECT COUNT(*) as new_today FROM users WHERE created_at >= CURRENT_DATE'),
      client.query('SELECT COUNT(*) as new_week FROM users WHERE created_at >= CURRENT_DATE - INTERVAL \'7 days\''),
      client.query('SELECT COUNT(*) as new_month FROM users WHERE created_at >= CURRENT_DATE - INTERVAL \'30 days\''),
      client.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM users
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `),
    ])

    return {
      totalUsers: parseInt(queries[0].rows[0].total_users),
      activeToday: parseInt(queries[1].rows[0].active_today),
      activeThisWeek: parseInt(queries[2].rows[0].active_week),
      activeThisMonth: parseInt(queries[3].rows[0].active_month),
      newToday: parseInt(queries[4].rows[0].new_today),
      newThisWeek: parseInt(queries[5].rows[0].new_week),
      newThisMonth: parseInt(queries[6].rows[0].new_month),
      dailySignups: queries[7].rows,
    }
  } finally {
    client.release()
  }
}

// Credit Management Functions

// Get user credits by Google ID
export async function getUserCredits(googleId: string): Promise<number> {
  const client = await pool.connect()

  try {
    const query = 'SELECT credits FROM users WHERE google_id = $1'
    const result = await client.query(query, [googleId])

    return result.rows[0]?.credits || 0
  } finally {
    client.release()
  }
}

// Deduct credits from user (for AI chat usage)
export async function deductCredits(googleId: string, amount: number = 1): Promise<{ success: boolean; newBalance: number }> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Get current credits
    const currentResult = await client.query('SELECT credits FROM users WHERE google_id = $1', [googleId])
    const currentCredits = currentResult.rows[0]?.credits || 0

    if (currentCredits < amount) {
      await client.query('ROLLBACK')
      return { success: false, newBalance: currentCredits }
    }

    // Deduct credits
    const newBalance = currentCredits - amount
    await client.query(
      'UPDATE users SET credits = $1, updated_at = CURRENT_TIMESTAMP WHERE google_id = $2',
      [newBalance, googleId]
    )

    await client.query('COMMIT')
    return { success: true, newBalance }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Add credits to user (admin function)
export async function addCredits(userId: number, amount: number): Promise<{ success: boolean; newBalance: number }> {
  const client = await pool.connect()

  try {
    const query = `
      UPDATE users
      SET credits = credits + $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING credits
    `
    const result = await client.query(query, [amount, userId])

    if (result.rows.length === 0) {
      return { success: false, newBalance: 0 }
    }

    return { success: true, newBalance: result.rows[0].credits }
  } finally {
    client.release()
  }
}

// Set user credits (admin function)
export async function setUserCredits(userId: number, credits: number): Promise<{ success: boolean; newBalance: number }> {
  const client = await pool.connect()

  try {
    const query = `
      UPDATE users
      SET credits = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING credits
    `
    const result = await client.query(query, [credits, userId])

    if (result.rows.length === 0) {
      return { success: false, newBalance: 0 }
    }

    return { success: true, newBalance: result.rows[0].credits }
  } finally {
    client.release()
  }
}

// Get credit statistics (admin function)
export async function getCreditStats() {
  const client = await pool.connect()

  try {
    const queries = await Promise.all([
      client.query('SELECT AVG(credits) as avg_credits FROM users'),
      client.query('SELECT SUM(credits) as total_credits FROM users'),
      client.query('SELECT COUNT(*) as users_with_zero_credits FROM users WHERE credits = 0'),
      client.query('SELECT COUNT(*) as users_with_low_credits FROM users WHERE credits <= 5'),
      client.query('SELECT MAX(credits) as max_credits FROM users'),
      client.query('SELECT MIN(credits) as min_credits FROM users'),
    ])

    return {
      averageCredits: Math.round(parseFloat(queries[0].rows[0].avg_credits) || 0),
      totalCredits: parseInt(queries[1].rows[0].total_credits) || 0,
      usersWithZeroCredits: parseInt(queries[2].rows[0].users_with_zero_credits) || 0,
      usersWithLowCredits: parseInt(queries[3].rows[0].users_with_low_credits) || 0,
      maxCredits: parseInt(queries[4].rows[0].max_credits) || 0,
      minCredits: parseInt(queries[5].rows[0].min_credits) || 0,
    }
  } finally {
    client.release()
  }
}

// Billing Functions

// Update user subscription status
export async function updateUserSubscription(
  userId: number,
  subscriptionData: {
    subscription_status: string
    stripe_customer_id?: string
    subscription_id?: string
    subscription_end_date?: Date
  }
): Promise<boolean> {
  const client = await pool.connect()

  try {
    const query = `
      UPDATE users
      SET subscription_status = $1,
          stripe_customer_id = $2,
          subscription_id = $3,
          subscription_end_date = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
    `
    const result = await client.query(query, [
      subscriptionData.subscription_status,
      subscriptionData.stripe_customer_id || null,
      subscriptionData.subscription_id || null,
      subscriptionData.subscription_end_date || null,
      userId
    ])

    return (result.rowCount ?? 0) > 0
  } finally {
    client.release()
  }
}

// Get user by Stripe customer ID
export async function getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | null> {
  const client = await pool.connect()

  try {
    const query = 'SELECT * FROM users WHERE stripe_customer_id = $1'
    const result = await client.query(query, [stripeCustomerId])

    return result.rows[0] as User || null
  } finally {
    client.release()
  }
}

// Get subscription statistics (admin function)
export async function getSubscriptionStats() {
  const client = await pool.connect()

  try {
    const queries = await Promise.all([
      client.query('SELECT COUNT(*) as total_users FROM users'),
      client.query('SELECT COUNT(*) as free_users FROM users WHERE subscription_status = \'free\''),
      client.query('SELECT COUNT(*) as pro_users FROM users WHERE subscription_status = \'pro\''),
      client.query('SELECT COUNT(*) as active_subscriptions FROM users WHERE subscription_status = \'pro\' AND (subscription_end_date IS NULL OR subscription_end_date > CURRENT_TIMESTAMP)'),
      client.query('SELECT SUM(CASE WHEN subscription_status = \'pro\' THEN 99 ELSE 0 END) as total_revenue FROM users'),
    ])

    return {
      totalUsers: parseInt(queries[0].rows[0].total_users),
      freeUsers: parseInt(queries[1].rows[0].free_users),
      proUsers: parseInt(queries[2].rows[0].pro_users),
      activeSubscriptions: parseInt(queries[3].rows[0].active_subscriptions),
      totalRevenue: parseInt(queries[4].rows[0].total_revenue) || 0,
    }
  } finally {
    client.release()
  }
}

// Check if user has active subscription
export async function hasActiveSubscription(userId: number): Promise<boolean> {
  const client = await pool.connect()

  try {
    const query = `
      SELECT subscription_status, subscription_end_date
      FROM users
      WHERE id = $1
    `
    const result = await client.query(query, [userId])

    if (result.rows.length === 0) return false

    const user = result.rows[0]
    if (user.subscription_status !== 'pro') return false

    // If no end date, it's active (one-time payment)
    if (!user.subscription_end_date) return true

    // Check if subscription hasn't expired
    return new Date(user.subscription_end_date) > new Date()
  } finally {
    client.release()
  }
}

// Analytics Functions

// Get comprehensive analytics data
export async function getAnalyticsData() {
  const client = await pool.connect()

  try {
    // User analytics
    const userQueries = await Promise.all([
      // Total users
      client.query('SELECT COUNT(*) as total FROM users'),
      // Users by subscription status
      client.query(`
        SELECT
          subscription_status,
          COUNT(*) as count
        FROM users
        GROUP BY subscription_status
      `),
      // New users by day (last 30 days)
      client.query(`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as count
        FROM users
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `),
      // New users by month (last 12 months)
      client.query(`
        SELECT
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as count
        FROM users
        WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
      `),
      // Active users (logged in last 30 days)
      client.query(`
        SELECT COUNT(*) as active_users
        FROM users
        WHERE last_login >= CURRENT_DATE - INTERVAL '30 days'
      `),
    ])

    // Revenue analytics
    const revenueQueries = await Promise.all([
      // Total revenue (Pro users * $99)
      client.query(`
        SELECT
          COUNT(*) as pro_users,
          COUNT(*) * 99 as total_revenue
        FROM users
        WHERE subscription_status = 'pro'
      `),
      // Revenue by month
      client.query(`
        SELECT
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as pro_signups,
          COUNT(*) * 99 as revenue
        FROM users
        WHERE subscription_status = 'pro'
          AND created_at >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
      `),
    ])

    // Credit analytics
    const creditQueries = await Promise.all([
      // Total credits in system
      client.query('SELECT SUM(credits) as total_credits FROM users'),
      // Average credits per user
      client.query('SELECT AVG(credits) as avg_credits FROM users'),
      // Credits distribution (simplified)
      client.query(`
        SELECT
          CASE
            WHEN credits = 0 THEN '0'
            WHEN credits <= 10 THEN '1-10'
            WHEN credits <= 50 THEN '11-50'
            WHEN credits <= 100 THEN '51-100'
            WHEN credits <= 500 THEN '101-500'
            WHEN credits <= 1000 THEN '501-1000'
            ELSE '1000+'
          END as credit_range,
          COUNT(*) as user_count
        FROM users
        GROUP BY
          CASE
            WHEN credits = 0 THEN '0'
            WHEN credits <= 10 THEN '1-10'
            WHEN credits <= 50 THEN '11-50'
            WHEN credits <= 100 THEN '51-100'
            WHEN credits <= 500 THEN '101-500'
            WHEN credits <= 1000 THEN '501-1000'
            ELSE '1000+'
          END
        ORDER BY user_count DESC
      `),
    ])

    return {
      users: {
        total: parseInt(userQueries[0].rows[0].total),
        byStatus: userQueries[1].rows,
        dailySignups: userQueries[2].rows,
        monthlySignups: userQueries[3].rows,
        activeUsers: parseInt(userQueries[4].rows[0].active_users),
      },
      revenue: {
        total: parseInt(revenueQueries[0].rows[0].total_revenue) || 0,
        proUsers: parseInt(revenueQueries[0].rows[0].pro_users),
        monthlyRevenue: revenueQueries[1].rows,
      },
      credits: {
        total: parseInt(creditQueries[0].rows[0].total_credits) || 0,
        average: parseFloat(creditQueries[1].rows[0].avg_credits) || 0,
        distribution: creditQueries[2].rows,
      },
    }
  } finally {
    client.release()
  }
}

// Get growth metrics
export async function getGrowthMetrics() {
  const client = await pool.connect()

  try {
    const queries = await Promise.all([
      // Growth rate (users this month vs last month)
      client.query(`
        SELECT
          COUNT(*) as current_month
        FROM users
        WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
      `),
      client.query(`
        SELECT
          COUNT(*) as last_month
        FROM users
        WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          AND created_at < DATE_TRUNC('month', CURRENT_DATE)
      `),
      // Conversion rate (pro users / total users)
      client.query(`
        SELECT
          COUNT(CASE WHEN subscription_status = 'pro' THEN 1 END) as pro_users,
          COUNT(*) as total_users
        FROM users
      `),
      // Retention (users who logged in this month that were created last month)
      client.query(`
        SELECT
          COUNT(*) as retained_users
        FROM users
        WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          AND created_at < DATE_TRUNC('month', CURRENT_DATE)
          AND last_login >= DATE_TRUNC('month', CURRENT_DATE)
      `),
    ])

    const currentMonth = parseInt(queries[0].rows[0].current_month)
    const lastMonth = parseInt(queries[1].rows[0].last_month)
    const proUsers = parseInt(queries[2].rows[0].pro_users)
    const totalUsers = parseInt(queries[2].rows[0].total_users)
    const retainedUsers = parseInt(queries[3].rows[0].retained_users)

    const growthRate = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0
    const conversionRate = totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0
    const retentionRate = lastMonth > 0 ? (retainedUsers / lastMonth) * 100 : 0

    return {
      growthRate: Math.round(growthRate * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100,
      retentionRate: Math.round(retentionRate * 100) / 100,
      currentMonth,
      lastMonth,
      proUsers,
      totalUsers,
      retainedUsers,
    }
  } finally {
    client.release()
  }
}

// Discount Code Functions

// Create a new discount code
export async function createDiscountCode(discountData: CreateDiscountCodeData): Promise<DiscountCode> {
  const client = await pool.connect()

  try {
    const query = `
      INSERT INTO discount_codes (
        code, stripe_coupon_id, discount_type, discount_value,
        max_uses, expires_at, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `

    const values = [
      discountData.code,
      discountData.stripe_coupon_id || null,
      discountData.discount_type,
      discountData.discount_value,
      discountData.max_uses || null,
      discountData.expires_at || null,
      discountData.created_by
    ]

    const result = await client.query(query, values)
    return result.rows[0] as DiscountCode
  } finally {
    client.release()
  }
}

// Get all discount codes (admin only)
export async function getAllDiscountCodes(): Promise<DiscountCode[]> {
  const client = await pool.connect()

  try {
    const query = `
      SELECT dc.*, u.email as created_by_email, u.name as created_by_name
      FROM discount_codes dc
      LEFT JOIN users u ON dc.created_by = u.id
      ORDER BY dc.created_at DESC
    `
    const result = await client.query(query)

    return result.rows.map(row => ({
      id: row.id,
      code: row.code,
      stripe_coupon_id: row.stripe_coupon_id,
      discount_type: row.discount_type,
      discount_value: row.discount_value,
      max_uses: row.max_uses,
      current_uses: row.current_uses,
      expires_at: row.expires_at,
      is_active: row.is_active,
      created_by: row.created_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
      // Additional fields for admin display
      created_by_email: row.created_by_email,
      created_by_name: row.created_by_name,
    })) as DiscountCode[]
  } finally {
    client.release()
  }
}

// Get discount code by ID
export async function getDiscountCodeById(id: number): Promise<DiscountCode | null> {
  const client = await pool.connect()

  try {
    const query = 'SELECT * FROM discount_codes WHERE id = $1'
    const result = await client.query(query, [id])

    return result.rows.length > 0 ? result.rows[0] as DiscountCode : null
  } finally {
    client.release()
  }
}

// Get discount code by code string
export async function getDiscountCodeByCode(code: string): Promise<DiscountCode | null> {
  const client = await pool.connect()

  try {
    const query = 'SELECT * FROM discount_codes WHERE code = $1'
    const result = await client.query(query, [code])

    return result.rows.length > 0 ? result.rows[0] as DiscountCode : null
  } finally {
    client.release()
  }
}

// Update discount code
export async function updateDiscountCode(id: number, updateData: UpdateDiscountCodeData): Promise<DiscountCode | null> {
  const client = await pool.connect()

  try {
    const fields = []
    const values = []
    let paramCount = 1

    if (updateData.code !== undefined) {
      fields.push(`code = $${paramCount}`)
      values.push(updateData.code)
      paramCount++
    }

    if (updateData.discount_type !== undefined) {
      fields.push(`discount_type = $${paramCount}`)
      values.push(updateData.discount_type)
      paramCount++
    }

    if (updateData.discount_value !== undefined) {
      fields.push(`discount_value = $${paramCount}`)
      values.push(updateData.discount_value)
      paramCount++
    }

    if (updateData.max_uses !== undefined) {
      fields.push(`max_uses = $${paramCount}`)
      values.push(updateData.max_uses)
      paramCount++
    }

    if (updateData.expires_at !== undefined) {
      fields.push(`expires_at = $${paramCount}`)
      values.push(updateData.expires_at)
      paramCount++
    }

    if (updateData.is_active !== undefined) {
      fields.push(`is_active = $${paramCount}`)
      values.push(updateData.is_active)
      paramCount++
    }

    if (fields.length === 0) {
      return await getDiscountCodeById(id)
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    const query = `
      UPDATE discount_codes
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await client.query(query, values)
    return result.rows.length > 0 ? result.rows[0] as DiscountCode : null
  } finally {
    client.release()
  }
}

// Delete discount code
export async function deleteDiscountCode(id: number): Promise<boolean> {
  const client = await pool.connect()

  try {
    const query = 'DELETE FROM discount_codes WHERE id = $1'
    const result = await client.query(query, [id])

    return (result.rowCount ?? 0) > 0
  } finally {
    client.release()
  }
}

// Validate discount code using database function
export async function validateDiscountCode(code: string): Promise<DiscountValidationResult> {
  const client = await pool.connect()

  try {
    const query = 'SELECT * FROM validate_discount_code($1)'
    const result = await client.query(query, [code])

    if (result.rows.length === 0) {
      return {
        is_valid: false,
        error_message: 'Invalid discount code'
      }
    }

    const row = result.rows[0]
    return {
      is_valid: row.is_valid,
      discount_id: row.discount_id,
      discount_type: row.discount_type,
      discount_value: row.discount_value,
      error_message: row.error_message
    }
  } finally {
    client.release()
  }
}

// Increment discount code usage
export async function incrementDiscountUsage(code: string): Promise<boolean> {
  const client = await pool.connect()

  try {
    const query = 'SELECT increment_discount_usage($1) as success'
    const result = await client.query(query, [code])

    return result.rows[0]?.success || false
  } finally {
    client.release()
  }
}

// Get discount code statistics
export async function getDiscountStats() {
  const client = await pool.connect()

  try {
    const query = 'SELECT * FROM get_discount_stats()'
    const result = await client.query(query)

    if (result.rows.length === 0) {
      return {
        totalCodes: 0,
        activeCodes: 0,
        expiredCodes: 0,
        usedCodes: 0,
        totalUsage: 0
      }
    }

    const row = result.rows[0]
    return {
      totalCodes: row.total_codes,
      activeCodes: row.active_codes,
      expiredCodes: row.expired_codes,
      usedCodes: row.used_codes,
      totalUsage: row.total_usage
    }
  } finally {
    client.release()
  }
}

// Get discount code usage analytics
export async function getDiscountAnalytics() {
  const client = await pool.connect()

  try {
    const queries = await Promise.all([
      // Most used discount codes
      client.query(`
        SELECT code, current_uses, max_uses, discount_type, discount_value
        FROM discount_codes
        WHERE current_uses > 0
        ORDER BY current_uses DESC
        LIMIT 10
      `),
      // Recent discount code usage (last 30 days)
      client.query(`
        SELECT
          DATE(updated_at) as date,
          COUNT(*) as codes_used
        FROM discount_codes
        WHERE current_uses > 0
          AND updated_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(updated_at)
        ORDER BY date DESC
      `),
      // Discount codes by type
      client.query(`
        SELECT
          discount_type,
          COUNT(*) as count,
          SUM(current_uses) as total_uses
        FROM discount_codes
        GROUP BY discount_type
      `),
    ])

    return {
      mostUsed: queries[0].rows,
      recentUsage: queries[1].rows,
      byType: queries[2].rows,
    }
  } finally {
    client.release()
  }
}

// =============================================================================
// EMAIL VERIFICATION
// =============================================================================

/**
 * Generate a random 6-digit OTP code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Store a verification code for a user (expires in 10 minutes)
 */
export async function setVerificationCode(email: string): Promise<string> {
  const client = await pool.connect()
  try {
    const code = generateVerificationCode()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await client.query(
      `UPDATE users
       SET verification_code = $1,
           verification_code_expires = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE email = $3`,
      [code, expires, email]
    )

    return code
  } finally {
    client.release()
  }
}

/**
 * Verify the OTP code for a user.
 * Returns true if valid, false otherwise.
 * Clears the code on success.
 */
export async function verifyEmailCode(email: string, code: string): Promise<boolean> {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `UPDATE users
       SET email_verified = TRUE,
           verification_code = NULL,
           verification_code_expires = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE email = $1
         AND verification_code = $2
         AND verification_code_expires > NOW()
       RETURNING id`,
      [email, code]
    )

    return result.rowCount !== null && result.rowCount > 0
  } finally {
    client.release()
  }
}

/**
 * Check if a user's email is verified.
 * Returns true if the email_verified column doesn't exist yet (migration not run).
 */
export async function isEmailVerified(email: string): Promise<boolean> {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT email_verified FROM users WHERE email = $1`, [email]
    )
    return result.rows[0]?.email_verified === true
  } catch (error) {
    const pgError = error as { code?: string }
    // Column doesn't exist yet — migration hasn't been run, allow sign-in
    if (pgError.code === '42703') {
      return true
    }
    throw error
  } finally {
    client.release()
  }
}

/**
 * Mark a user's email as verified (e.g., for Google OAuth users).
 * Silently skips if the email_verified column doesn't exist yet.
 */
export async function markEmailVerified(email: string): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query(
      `UPDATE users SET email_verified = TRUE, updated_at = CURRENT_TIMESTAMP WHERE email = $1`,
      [email]
    )
  } catch (error) {
    const pgError = error as { code?: string }
    // Column doesn't exist yet — migration hasn't been run, skip silently
    if (pgError.code === '42703') return
    throw error
  } finally {
    client.release()
  }
}

// Close the pool (for cleanup)
export async function closePool(): Promise<void> {
  await pool.end()
}
