
export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "lead";
  lastContact?: string;
  tags: string[];
}
