export interface Database {
  public: {
    Tables: {
      merchants: {
        Row: Merchant
        Insert: Omit<Merchant, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Merchant, 'id'>>
      }
      payment_links: {
        Row: PaymentLink
        Insert: Omit<PaymentLink, 'id' | 'created_at' | 'updated_at' | 'short_url'>
        Update: Partial<Omit<PaymentLink, 'id'>>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Transaction, 'id'>>
      }
      credits: {
        Row: Credit
        Insert: Omit<Credit, 'id' | 'created_at'>
        Update: Partial<Omit<Credit, 'id'>>
      }
      webhooks: {
        Row: Webhook
        Insert: Omit<Webhook, 'id' | 'created_at'>
        Update: Partial<Omit<Webhook, 'id'>>
      }
      api_keys: {
        Row: ApiKey
        Insert: Omit<ApiKey, 'id' | 'created_at'>
        Update: Partial<Omit<ApiKey, 'id'>>
      }
    }
    Functions: {
      generate_short_url: {
        Args: Record<string, never>
        Returns: string
      }
    }
  }
}

export interface Merchant {
  id: string
  user_id: string
  name: string
  provider: 'gopay' | 'bca' | 'dana' | 'ovo' | 'shopeepay' | 'linkaja' | 'other'
  account_name: string
  qr_image_url: string | null
  qr_data: string | null
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

export interface PaymentLink {
  id: string
  merchant_id: string
  title: string
  description: string | null
  amount: number | null
  currency: string
  expiry_at: string | null
  redirect_success_url: string | null
  redirect_failed_url: string | null
  status: 'active' | 'expired' | 'disabled'
  qr_image_url: string | null
  short_url: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  payment_link_id: string | null
  merchant_id: string
  external_id: string
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'expired'
  payer_name: string | null
  payer_note: string | null
  paid_at: string | null
  confirmed_by: string | null
  validation_method: 'manual' | 'auto' | 'polling'
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Credit {
  id: string
  user_id: string
  balance: number
  used: number
  plan: 'free' | 'starter' | 'pro' | 'business'
  created_at: string
}

export interface Webhook {
  id: string
  merchant_id: string
  url: string
  events: string[]
  secret: string
  active: boolean
  created_at: string
}

export interface ApiKey {
  id: string
  user_id: string
  name: string
  key_hash: string
  permissions: string[]
  last_used_at: string | null
  created_at: string
  expires_at: string | null
}
