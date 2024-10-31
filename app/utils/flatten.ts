/**
 * Flattens a node connection object by extracting nodes from either edges or direct nodes.
 * @param connection - The connection object containing edges or nodes
 * @returns An array of nodes
 */
export const flattenNodeConnection = <T>(
  connection?: {
    edges?: { node: T }[];
    nodes?: T[];
  }
): T[] => {
  if (connection?.edges) {
    return connection.edges.map(({ node }) => node);
  }

  if (connection?.nodes) {
    return connection.nodes;
  }

  return [];
};
