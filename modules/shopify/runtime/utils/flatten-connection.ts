/**
 * Flattens a GraphQL connection object by extracting its nodes.
 * @param connection - The object containing edges or nodes
 * @returns An array of nodes
 */
export const flattenConnection = <T>(
  connection?: {
    edges?: { node: T }[]
    nodes?: T[]
  } | null,
): T[] => {
  if (Array.isArray(connection?.edges)) {
    return connection.edges.map(({ node }) => node)
  }

  if (Array.isArray(connection?.nodes)) {
    return connection.nodes
  }

  return []
}
