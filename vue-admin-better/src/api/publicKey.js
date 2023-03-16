export function getPublicKey() {
  return {
    url: "/api/v1/common/public-key",
    method: "get",
  };
}
