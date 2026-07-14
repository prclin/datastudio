export interface CreateConfigCommand {
  name: string;
  kind: 0 | 1;
  configs?: string;
  artifacts?: File[];
}
