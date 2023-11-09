const titleMd = (title: string, level: number) => `${'#'.repeat(level)} ${title}\n\n`;

export const titleMd1 = (title: string) => titleMd(title, 1);
export const titleMd2 = (title: string) => titleMd(title, 2);
export const titleMd3 = (title: string) => titleMd(title, 3);

export default titleMd;
