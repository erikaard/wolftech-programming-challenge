import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import departmentsData from 'src/department-data.json';
import { Department } from './test.interface';

interface FlatDepartment {
  expandable: boolean;
  Title: string;
  OID: number;
  level: number;
  Color: string;
  totalLeafs: number;
  selectedLeafs: number;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  @Input() departments: Department[] = [];
  @Input() preSelectedIds: number[] = [];
  @Output() selectedIds = new EventEmitter<number[]>();

  private _transformer = (node: Department, level: number): FlatDepartment => {
    const totalLeafs = this.countLeafNodes(node);
    const selectedLeafs = this.countSelectedLeafNodes(node);
    return {
      expandable: !!node.Children && node.Children.length > 0,
      Title: node.Title,
      OID: node.OID,
      level,
      Color: node.Color,
      totalLeafs,
      selectedLeafs
    };
  }

  treeControl = new FlatTreeControl<FlatDepartment>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.Children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnInit() {
    this.dataSource.data = this.departments;
  }

  countLeafNodes(department: Department): number {
    if (!department.Children || department.Children.length === 0) {
      return 1;
    }
    return department.Children.reduce((acc, child) => acc + this.countLeafNodes(child), 0);
  }
  
  countSelectedLeafNodes(department: Department): number {
    if (!department.Children || department.Children.length === 0) {
      return this.isSelected({ OID: department.OID } as FlatDepartment) ? 1 : 0;
    }
    return department.Children.reduce((acc, child) => acc + this.countSelectedLeafNodes(child), 0);
  }

  hasChild = (_: number, node: FlatDepartment) => node.expandable;

  toggleSelection(department: FlatDepartment) {
    const index = this.preSelectedIds.indexOf(department.OID);
    if (index === -1) {
      this.preSelectedIds.push(department.OID);
    } else {
      this.preSelectedIds.splice(index, 1);
    }
    this.selectedIds.emit(this.preSelectedIds);
  }


  isSelected(department: FlatDepartment): boolean {
    return this.preSelectedIds.includes(department.OID);
  }

}
