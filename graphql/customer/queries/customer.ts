export const CUSTOMER = `#graphql
  query customer {
    customer {
      ...Customer
    }
  }
`

export const CUSTOMER_ORDERS = `#graphql
  query customerOrders($first: Int = 10) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          ...OrderSummary
        }
      }
    }
  }
`
