import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class AddCategoriesComponent implements OnInit {
  searchTerm: string = '';
  items: string[] = [
    'Cardiología',
    'Dermatología',
    'Ginecología',
    'Odontología',
  ];
  filteredItems: string[] = [];
  selectedItems: string[] = [];
  constructor() {}

  ngOnInit() {}

  onSearch() {
    if (this.searchTerm) {
      this.filteredItems = this.items.filter((item) =>
        item.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      if (
        !this.items.includes(this.searchTerm) &&
        !this.filteredItems.includes(`Agregar "${this.searchTerm}"`)
      ) {
        this.filteredItems.push(`Agregar "${this.searchTerm}"`);
      }
    } else {
      this.filteredItems = [];
    }
  }

  addItem(item: string) {
    if (item.startsWith('Agregar "')) {
      const newItem = item.replace(/^Agregar "(.+)"$/, '$1');
      this.items.push(newItem);
      this.selectedItems.push(newItem);
    } else if (!this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
    }
    this.searchTerm = '';
    this.filteredItems = [];
  }

  removeItem(item: string) {
    this.selectedItems = this.selectedItems.filter(
      (selected) => selected !== item
    );
  }
}
