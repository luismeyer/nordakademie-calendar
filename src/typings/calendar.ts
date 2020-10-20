export type Secrets = {
  bucket: string;
  token: string;
  chatId: number;
  domain: string;
  centuria: string;
  passphrase: string;
};

export type Batch = {
  filter: string;
  filename: string;
}[];