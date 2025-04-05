export interface ISalaryBreakdown {
  id: string;
  basic: string;
  housing: string;
  transport: string;
  allowances: {
    type: string;
    percentage: string;
    id: string;
  }[];
}
