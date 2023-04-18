export interface Department {
    OID: number;
    Title: string;
    Color : string,
    DepartmentParent_OID: number | null;
    Children?: Department[];
  }