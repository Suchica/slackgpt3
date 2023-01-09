interface Customer {
  id: string; // cus_JZ9Z9Z9Z9Z9Z9Z
  object: string; // 'customer'
  address: string | null;
  balance: number; // 0
  created: number; // 1620000000, unix timestamp in seconds
  currency: string; // 'usd' | 'gbp' | 'eur' etc
  default_source: string | null;
  delinquent: boolean; // delinquent means the customer has an unpaid invoice
  description: string | null;
  discount: string | null;
  email: string | null;
  invoice_prefix: string; // DBD1588
  invoice_settings: {
    custom_fields: string | null;
    default_payment_method: string | null;
    footer: string | null;
    rendering_options: string | null;
  };
  livemode: boolean; // true if in production
  metadata: {
    [key: string]: string;
  };
  name: string | null; // 'John Doe'
  next_invoice_sequence: number; // 1
  phone: string | null;
  preferred_locales: string[] | null;
  shipping: string | null;
  tax_exempt: string; // 'none' | 'exempt' | 'reverse'
  test_clock: number | null;
}

interface SearchCustomerResponse {
  object: string; // search_result
  url: string; // /v1/customers/search
  has_more: boolean;
  data: Customer[];
}

interface SubscriptionItem {
  id: string; // si_N73m0vIRZ84lWo
  object: string; // 'subscription_item'
  billing_thresholds: string | null;
  created: number; // unix timestamp in seconds
  metadata: {
    [key: string]: string;
  };
  price: {
    id: string; // price_1LYibuF5IfL0eXz9otT6VcII
    object: string; // 'price'
    active: boolean;
    billing_scheme: string; // 'per_unit' | 'tiered' | 'volume'
    created: number; // unix timestamp in seconds
    currency: string; // 'usd' | 'gbp' | 'eur' etc
    custom_unit_amount: number | null;
    livemode: boolean; // true if in production
    lookup_key: string | null;
    metadata: {
      [key: string]: string;
    };
    nickname: string | null;
    product: string; // prod_MHHA5EGlYDRJPC
    recurring: {
      aggregate_usage: string | null;
      interval: string; // 'day' | 'week' | 'month' | 'year'
      interval_count: number; // 1
      usage_type: string; // 'licensed' | 'metered'
    };
    tax_behavior: string; // 'exclusive' | 'inclusive' | 'unspecified'
    tiers_mode: string | null; // 'graduated' | 'volume'
    transform_quantity: string | null; // 'divide_by' | 'set_to'
    type: string; // 'recurring' | 'one_time'
    unit_amount: number | null; // 1000
    unit_amount_decimal: string | null; // '1000'
  };
  quantity: number; // 1
  subscription: string; // sub_JZ9Z9Z9Z9Z9Z9Z
  tax_rates: string[] | null;
}

interface Subscription {
  id: string; // sub_JZ9Z9Z9Z9Z9Z9Z
  object: string; // 'subscription'
  application: string | null;
  application_fee_percent: number | null;
  automatic_tax: {
    enabled: boolean;
  };
  billing_cycle_anchor: number; // unix timestamp in seconds
  billing_thresholds: string | null;
  cancel_at: number | null; // unix timestamp in seconds
  cancel_at_period_end: boolean;
  canceled_at: number | null; // unix timestamp in seconds
  collection_method: string; // 'charge_automatically' | 'send_invoice'
  created: number; // unix timestamp in seconds
  currency: string; // 'usd' | 'gbp' | 'eur' etc
  current_period_end: number; // unix timestamp in seconds
  current_period_start: number; // unix timestamp in seconds
  customer: string; // cus_JZ9Z9Z9Z9Z9Z9Z
  days_until_due: number | null; // 30
  default_payment_method: string | null;
  default_source: string | null;
  default_tax_rates: string[] | null;
  description: string | null;
  discount: string | null;
  ended_at: number | null; // unix timestamp in seconds
  items: {
    object: string; // 'list'
    data: SubscriptionItem[];
    has_more: boolean;
    url: string; // /v1/subscription_items?subscription=sub_JZ9Z9Z9Z9Z9Z9Z
  };
  latest_invoice: string | null; // ino_1LYibvF5IfL0eXz9oZ9Z9Z9Z
  livemode: boolean; // true if in production
  metadata: {
    [key: string]: string;
  };
  next_pending_invoice_item_invoice: number | null; // unix timestamp in seconds
  on_behalf_of: string | null; // acct_1LYibvF5IfL0eXz9
  pause_collection: string | null;
  payment_settings: {
    payment_method_options: string | null;
    payment_method_types: string[] | null;
    save_default_payment_method: string | null;
  };
  pending_invoice_item_interval: string | null;
  pending_setup_intent: string | null;
  pending_update: object | null;
  schedule: string | null;
  start_date: number | null; // unix timestamp in seconds
  status: string; // 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
  test_clock: number | null;
  transfer_data: string | null;
  trial_end: number | null; // unix timestamp in seconds
  trial_start: number | null; // unix timestamp in seconds
}

export type { Customer, SearchCustomerResponse, Subscription };
