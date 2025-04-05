export interface IPayGroup {
  id: string;
  name: string;
  pay_schedule_id: string;
  apply_nhf: boolean;
  apply_pension: boolean;
  apply_paye: boolean;
  apply_additional: boolean;
  payFrequency: string;
  createdAt: string;
}
