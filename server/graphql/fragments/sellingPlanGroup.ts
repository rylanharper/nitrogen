import { gql } from 'graphql-tag';
import { SELLING_PLAN_FRAGMENT } from './sellingPlan';

export const SELLING_PLAN_GROUP_FRAGMENT = gql`
  fragment SellingPlanGroup on SellingPlanGroup {
    name
    options {
      name
      values
    }
    sellingPlans(first:10) {
      edges {
        node {
          ...SellingPlan
        }
      }
    }
  }
  ${SELLING_PLAN_FRAGMENT}
`;
