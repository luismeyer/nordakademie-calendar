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

export type MensaWeek = MensaDay[];

export type MensaDay = {
  date: string;
  main: {
    description: string;
    price: string;
  };
  second: {
    description: string;
    price: string;
  };
};
