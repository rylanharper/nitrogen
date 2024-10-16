import { gql } from 'graphql-tag';
import { MONEY_FRAGMENT } from './money';

export const SELLING_PLAN_FRAGMENT = gql`
  fragment SellingPlan on SellingPlan {
    checkoutCharge {
      type
      value {
        ...Money
        ... on SellingPlanCheckoutChargePercentageValue {
          percentage
        }
      }
    }
    description
    id
    name
    options {
      name
      value
    }
    priceAdjustments {
      adjustmentValue {
        ... on SellingPlanFixedAmountPriceAdjustment {
          adjustmentAmount {
            ...Money
          }
        }
        ... on SellingPlanFixedPriceAdjustment {
          price {
            ...Money
          }
        }
        ... on SellingPlanPercentagePriceAdjustment {
          adjustmentPercentage
        }
      }
      orderCount
    }
    recurringDeliveries
  }
  ${MONEY_FRAGMENT}
`;
