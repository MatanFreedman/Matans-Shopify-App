import { Shopify } from "@shopify/shopify-api";

/*
  The app sends a mutation to Flow to start workflows that use a certain trigger.
  This query is used to tell Flow which trigger to run and supplies a properties argument
  that will be passed to the trigger at runtime.

  The flowTriggerReceive query uses a JSON string as "body" argument, which doesn't play very
  nicely with GraphQL, so we've split the main query into a constant string and used a triggerMutationBody
  function to populate the query parameters.
*/

const QR_CODE_TRIGGER_MUTATION = `
mutation flowTriggerMutation($body: String!) {
  flowTriggerReceive(body: $body) {
    userErrors {
      field,
      message
    }
  }
}`;

function triggerMutationBody(triggerId, triggerProperties) {
  return `{
    "trigger_id": "${triggerId}",
    "resources": [
      {
        "name": "Matans Test App Dev",
        "url": "https://matans-test-app-dev.com"
      }
    ],
    "properties": ${JSON.stringify(triggerProperties)}
  }`
}

export async function sendFlowTriggerMutation(req, res, triggerId, triggerProperties) {
  /* Instantiate a new GraphQL client to query the Shopify GraphQL Admin API */
  const session = await Shopify.Utils.loadCurrentSession(req, res, false);
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  /* Send mutation to the Shopify GraphQL Admin API */
  const adminData = await client.query({
    data: {
      query: QR_CODE_TRIGGER_MUTATION,
      variables: {
        body: triggerMutationBody(triggerId, triggerProperties)
      }
    },
  });
}