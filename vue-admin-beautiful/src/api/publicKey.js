export function getPublicKey() {
  return {
    url: "/sys/publicKey",
    method: "get",
  };
}
