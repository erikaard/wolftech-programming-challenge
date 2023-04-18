import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import departmentsData from 'src/department-data.json';

interface Department {
  OID: number;
  Title: string;
  Color : string,
  DepartmentParent_OID: number | null;
}

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})

export class DepartmentComponent {

  departments: Department[] = departmentsData;

  selectedDepartments: number[] = [];

  onDepartmentSelect($event: Event, department: Department): void {
    const isChecked = (<HTMLInputElement>$event.target).checked
    if (isChecked) {
      this.selectedDepartments.push(department.OID);
    } else {
      const index = this.selectedDepartments.indexOf(department.OID);
      if (index !== -1) {
        this.selectedDepartments.splice(index, 1);
      }
    }
  }

  isLeaf(department: Department): boolean {
    return !this.departments.some(d => d.DepartmentParent_OID === department.OID);
  }

  countLeafNodes(department: Department): number {
    if (this.isLeaf(department)) {
      return 1;
    } else {
      return this.departments.reduce((sum, d) => {
        if (d.DepartmentParent_OID === department.OID) {
          return sum + this.countLeafNodes(d);
        } else {
          return sum;
        }
      }, 0);
    }
  }

  countSelectedLeafNodes(department: Department): number {
    if (this.isLeaf(department)) {
      return this.selectedDepartments.includes(department.OID) ? 1 : 0;
    } else {
      return this.departments.reduce((sum, d) => {
        if (d.DepartmentParent_OID === department.OID) {
          return sum + this.countSelectedLeafNodes(d);
        } else {
        return sum;
        }
      }, 0);
    }
  }
  getLeafNodeCount(department: Department): string {
    const totalLeafNodes = this.countLeafNodes(department);
    const selectedLeafNodes = this.countSelectedLeafNodes(department);

    return `${selectedLeafNodes}/${totalLeafNodes}`;
  }

  getSubDepartments(department: Department) {
    return this.departments.filter(
      (d) => d.DepartmentParent_OID === department.OID
    );
  }
  handleClick($event: Event) {
  }
  
}

