import { Component } from '@angular/core';
import { Department } from './test/test.interface';
import departmentsData from 'src/department-data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'wolftech-programming-challenge';

  departments: Department[] = departmentsData;

  preSelectedIds: number[] = [2,3]; // Add pre-selected department OIDs if needed

  selectedIds: number[] = []

  onSelectedIdsChanged(selectedIds: number[]) {
    this.selectedIds = selectedIds;
    console.log('Selected department OIDs:', selectedIds);
  }

  buildDepartmentHierarchy(departments: Department[]): Department[] {
    const departmentMap = new Map<number, Department>();
    const topLevelDepartments: Department[] = [];
  
    departments.forEach(department => {
      departmentMap.set(department.OID, department);
    });

    departments.forEach(department => {
      if (department.DepartmentParent_OID !== null) {
        const parent = departmentMap.get(department.DepartmentParent_OID);
        if (parent) {
          parent.Children = parent.Children || [];
          parent.Children.push(department);
        }
      } else {
        topLevelDepartments.push(department);
      }
    });
  
    return topLevelDepartments;
  }
}
