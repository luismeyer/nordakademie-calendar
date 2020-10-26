export type MensaWeek = MensaDay[];

export type MensaDay = {
  date: Date;
  main: {
    description: string;
    price: string;
  };
  second: {
    description: string;
    price: string;
  };
};

export type MeetingData = {
  [module: string]: BasicMeeting | RegexMeeting | DayMeeting;
};

type BaseMeeting = {
  url: string;
  password?: string;
};

type BasicMeeting = BaseMeeting & {
  type: "BASIC";
};

type RegexMeeting = {
  values: (BaseMeeting & {
    regex: string;
  })[];
  type: "REGEX";
};

type DayMeeting = {
  [day: number]: BaseMeeting;
  type: "DAY";
};
