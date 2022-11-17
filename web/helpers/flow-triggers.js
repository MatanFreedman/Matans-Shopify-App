import { Shopify } from "@shopify/shopify-api";

// Trigger 'QR Code Created' trigger
function triggerMutationBody(triggerId, properties) {
  return `{
    "trigger_id": "${triggerId}",
    "resources": [
      {
        "name": "Matans Test App Dev",
        "url": "https://matans-test-app-dev.com"
      }
    ],
    "properties": ${JSON.stringify(properties)}
  }`
}

const QR_CODE_TRIGGER_MUTATION = `
mutation flowTriggerMutation($body: String!) {
  flowTriggerReceive(body: $body) {
    userErrors {
      field,
      message
    }
  }
}`;

export async function sendFlowTriggerMutation(req, res, triggerId, properties) {
  /* 
  TODO: Make more flexible. Should include parameters:
    trigger_id: String!
    properties: [String]!
  */

  /* Instantiate a new GraphQL client to query the Shopify GraphQL Admin API */
  const session = await Shopify.Utils.loadCurrentSession(req, res, false);
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  /* Send mutation to the Shopify GraphQL Admin API */
  const adminData = await client.query({
    data: {
      query: QR_CODE_TRIGGER_MUTATION,
      variables: {
        body: triggerMutationBody(triggerId, properties)
      }
    },
  });
}