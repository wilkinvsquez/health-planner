import { Component, Input, OnInit } from '@angular/core';
import { CustomInputComponent, } from '../form/inputs/custom-input/custom-input.component';
import { NotesService } from '../../services/notes.service';
import { Note } from 'src/app/core/interfaces/Note';
import { FormsModule } from '@angular/forms';
import { Response } from 'src/app/core/interfaces/Response';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  standalone: true,
  imports: [CustomInputComponent, FormsModule, CommonModule],
})
export class NotesComponent implements OnInit {
  @Input() userId: string = '';
  notes: Note[] = [];
  noteToEdit = {} as Note;
  noteValue: string = '';
  constructor(private noteService: NotesService, private toastService: ToastService) { }

  async ngOnInit() {
    if (!this.userId) {
      console.log('No user id provided');
    }
    const { data } = await this.noteService.getNotesByUser(this.userId);
    if (data) this.notes = data;
  }

  async createNote() {
    if (this.noteToEdit.id !== undefined) {
      this.updateNote();
      return;
    }
    const note: Note = {
      description: this.noteValue,
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'America/Costa_Rica' }),
      updatedAt: new Date().toLocaleString('en-US', { timeZone: 'America/Costa_Rica' }),
    };
    const response: Response = await this.noteService.createNote(note, this.userId);
    if (response.success) {
      this.toastService.showSuccess('Su nota ha sido creada.');
      this.notes.push(note);
      this.noteValue = '';
    } else {
      this.toastService.showError('Ha ocurrido un error al crear la nota.');
    }
  }

  async startNoteUpdate(note: Note) {
    this.noteToEdit = note;
    this.noteValue = note.description;
  }

  async updateNote() {
    const updatedNote: Note = {
      ...this.noteToEdit,
      description: this.noteValue,
      updatedAt: new Date().toLocaleString('en-US', { timeZone: 'America/Costa_Rica' }),
    };
    const response: Response = await this.noteService.updateNoteById(updatedNote.id!, updatedNote);
    if (response.success) {
      this.toastService.showSuccess('Su nota ha sido actualizada.');
      this.notes = this.notes.map((note) => {
        if (note.id === updatedNote.id) {
          return updatedNote;
        }
        return note;
      });
      this.noteValue = '';
      this.noteToEdit = {} as Note;
    } else {
      this.toastService.showError('Ha ocurrido un error al actualizar la nota.');
    }
  }

  async deleteNote(id: string) {
    const response: Response = await this.noteService.deleteNoteById(id, this.userId);
    if (response.success) {
      this.toastService.showSuccess('Su nota ha sido eliminada.');
      console.log('Note deleted: ', id);
      this.notes = this.notes.filter((note) => note.id !== id);
    } else {
      this.toastService.showError('Ha ocurrido un error al eliminar la nota.');
    }
  }
}
