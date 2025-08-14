import React from "react";
import { useQuery } from "@apollo/client";
import { PING } from "./graphql";

export default function TestGraphQL() {
  const { data, loading, error } = useQuery(PING);

  console.log(
    "[TestGraphQL] loading:",
    loading,
    "error:",
    error,
    "data:",
    data
  );

  if (loading) return <div>Running test query…</div>;
  if (error) {
    alert("GraphQL error: " + error.message);
    return (
      <div style={{ color: "crimson" }}>GraphQL error: {error.message}</div>
    );
  }

  alert("GraphQL query worked!");
  return (
    <div>
      <h3>GraphQL response:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
