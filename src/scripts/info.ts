import { fetch, requestUrl } from '../telegram';
import { SECRETS } from '../utils/constants';
import { readJSON } from '../utils/json';

(async () => {
  const secrets = readJSON(SECRETS);

  const url = requestUrl(secrets.token, "getWebhookInfo");

  const res = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `https://${secrets.domain}/bot`,
    }),
  });
  console.info(res);
})();
