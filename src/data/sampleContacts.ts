
import { Contact } from "@/types/contact";

export const sampleContacts: Contact[] = [
  {
    id: "contact-1",
    name: "John Smith",
    company: "Acme Corp",
    email: "john.smith@acme.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    lastContact: "2023-12-02",
    tags: ["client", "tech"],
  },
  {
    id: "contact-2",
    name: "Sarah Johnson",
    company: "Globex",
    email: "sarah.j@globex.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    lastContact: "2023-12-05",
    tags: ["prospect", "healthcare"],
  },
  {
    id: "contact-3",
    name: "Michael Brown",
    company: "Wayne Enterprises",
    email: "m.brown@wayne.com",
    phone: "+1 (555) 456-7890",
    status: "lead",
    tags: ["lead", "finance"],
  },
  {
    id: "contact-4",
    name: "Jessica Lee",
    company: "Stark Industries",
    email: "jessica@stark.com",
    phone: "+1 (555) 234-5678",
    status: "inactive",
    lastContact: "2023-11-15",
    tags: ["previous-client", "manufacturing"],
  },
  {
    id: "contact-5",
    name: "Robert Chen",
    company: "Oscorp",
    email: "robert.chen@oscorp.com",
    phone: "+1 (555) 876-5432",
    status: "active",
    lastContact: "2023-12-01",
    tags: ["client", "biotech"],
  },
];
