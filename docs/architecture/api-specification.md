# API Specification

## GraphQL Schema (Excerpt)

```graphql
type Query {
  farm(id: ID!): Farm
  farms(ownerId: ID!): [Farm!]!
  field(id: ID!): Field
  fields(farmId: ID!): [Field!]!
  optimizeRotation(constraints: RotationConstraints!): RotationPlan!
  predictYield(fieldId: ID!, cropId: ID!, plantingDate: DateTime!): YieldPrediction!
  checkHerbicideRestrictions(fieldId: ID!, cropId: ID!): [RestrictionViolation!]!
}

type Mutation {
  createFarm(input: CreateFarmInput!): Farm!
  createField(input: CreateFieldInput!): Field!
  createTreatment(input: CreateTreatmentInput!): Treatment!
  plantCrop(fieldId: ID!, cropId: ID!, plantingDate: DateTime!): Season!
}

type Subscription {
  fieldUpdated(fieldId: ID!): Field!
  weatherAlert(farmId: ID!, severity: Severity!): WeatherAlert!
}
```
