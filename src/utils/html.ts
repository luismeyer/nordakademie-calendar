import fetch from 'node-fetch';

export const isValidUrl = (url: string) =>
  fetch(url).then((res) => Math.floor(res.status / 100) === 2);

export const formatInnerHtml = (text: string) =>
  text.replace(/\s+/g, " ").trim();
