/**
 * Flattens a connection object by extracting the nodes from its edges.
 * @param connection - The connection object containing edges with nodes.
 * @returns An array of nodes.
 */
export const flattenNodeConnection = <T>(connection?: { edges?: { node: T }[] }): T[] => {
  return connection?.edges?.map(({ node }) => node) ?? []
}

/**
 * Flattens an array of items by extracting the nodes.
 * @param item - The array containing objects with nodes.
 * @returns An array of nodes.
 */
export const flattenNodeItem = <T>(item?: { node: T }[]): T[] => {
  return item?.map(({ node }) => node) ?? []
}
