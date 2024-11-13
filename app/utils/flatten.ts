/**
 * Flattens a connection object by extracting nodes from edges or directly.
 * @param connection - The object containing edges or nodes
 * @returns An array of nodes
 */
export const flattenConnection = <T>(
  connection?: {
    edges?: { node: T }[];
    nodes?: T[];
  },
): T[] => {
  if (connection?.edges) {
    return connection.edges.map(({ node }) => node);
  }

  if (connection?.nodes) {
    return connection.nodes;
  }

  return [];
};
