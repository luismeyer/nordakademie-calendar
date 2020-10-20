export const Logger = class Logger {
  max: number;
  progress: number;
  filename: string;

  constructor(max: number, filename: string) {
    this.max = max;
    this.progress = 1;
    this.filename = filename;
  }

  print(message: string) {
    console.info(
      `${this.progress}/${this.max}: ${this.filename} | ${message}\n`
    );
    this.progress += 1;
  }

  static print(message: string) {
    console.info(message, "\n");
  }
};
