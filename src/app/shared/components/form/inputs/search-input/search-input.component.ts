import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class SearchInputComponent implements OnInit {
  @Input() placeholder: string = 'Buscar...';
  @Output() searchInputChange = new EventEmitter<string>();
  searchTerm: string = '';

  constructor() { }

  ngOnInit() { }

  onInputChange() {
    this.searchInputChange.emit(this.searchTerm);
  }
}
