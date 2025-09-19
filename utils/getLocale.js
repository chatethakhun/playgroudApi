import crypto from "crypto";

export const jsonETag = (obj) => {
  const str = JSON.stringify(obj);
  return '"' + crypto.createHash("sha1").update(str).digest("hex") + '"';
};
