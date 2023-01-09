import stripe from "../config/stripeAuth";
import { Customer, SearchCustomerResponse } from "../types/stripeTypes";

// Search for a customer object in Stripe
// See https://stripe.com/docs/api/customers/search
const searchCustomer = async (query: string) => {
  const customer: SearchCustomerResponse = await stripe.customers.search({
    query,
  });
  return customer;
};

// Create a new customer object in Stripe
// See https://stripe.com/docs/api/customers/create
const createCustomer = async (name: string, metadata: any) => {
  const customer: Customer = await stripe.customers.create({
    name,
    metadata,
  });
  return customer;
};

// Search for a subscription object in Stripe
// See https://stripe.com/docs/api/subscriptions/search
const searchSubscription = async (query: string) => {
  const subscription = await stripe.subscriptions.search({
    query,
  });
  return subscription;
};

// Create a new subscription object in Stripe
// See https://stripe.com/docs/api/subscriptions/create
const createSubscription = async (
  customerId: string,
  priceId: string,
  metadata: any
) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata,
    cancel_at_period_end: false,
    currency: "usd",
    // default_payment_method: null,
    description: "Subscription for Slack app",
    payment_behavior: "allow_incomplete", // allow_incomplete | default_incomplete | error_if_incomplete | pending_if_incomplete
    trial_period_days: 7,
  });
  return subscription;
};

// Cancel a subscription in Stripe
// See https://stripe.com/docs/api/subscriptions/cancel
const cancelSubscription = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.del(subscriptionId);
  return subscription;
};

// Create a new customer and subscription object in Stripe
const createCustomerAndSubscription = async (
  id: string,
  name: string,
  idType: "teamId" | "enterpriseId"
) => {
  // Verify customer presence
  const query = `metadata[\'${idType}\']:\'${id}\'`;
  const customer = await searchCustomer(query);

  // If customer doesn't exist, create a new customer and a new subscription
  if (customer.data.length === 0 && process.env.STRIPE_PRICE_ID) {
    // Create a new customer in Stripe
    const customer = await createCustomer(name, {
      [idType]: id,
    });
    // Create a new subscription in Stripe
    await createSubscription(customer.id, process.env.STRIPE_PRICE_ID, {
      [idType]: id,
    });
  }

  // If customer exists, verify subscription presence
  if (customer.data.length > 0 && process.env.STRIPE_PRICE_ID) {
    // Search for the subscription in Stripe
    const subscription = await searchSubscription(query);

    // If subscription doesn't exist, create a new subscription
    if (subscription.data.length === 0) {
      // Create a new subscription in Stripe
      await createSubscription(
        customer.data[0].id,
        process.env.STRIPE_PRICE_ID,
        {
          [idType]: id,
        }
      );
    }
  }
};

// Search for a subscription id and cancel it
const searchSubscriptionAndCancel = async (id: string) => {
  // Search for the subscription in Stripe
  const query = `metadata[\'teamId\']:\'${id}\' OR metadata[\'enterpriseId\']:\'${id}\'`;
  const subscription = await searchSubscription(query);
  const subscriptionId = subscription.data[0]?.id;

  // Cancel the subscription
  await cancelSubscription(subscriptionId);
};

export {
  cancelSubscription,
  createCustomer,
  createCustomerAndSubscription,
  createSubscription,
  searchCustomer,
  searchSubscription,
  searchSubscriptionAndCancel,
};
