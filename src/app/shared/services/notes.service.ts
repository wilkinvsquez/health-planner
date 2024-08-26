import { Injectable, inject } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { Note } from 'src/app/core/interfaces/Note';
import { environment } from 'src/environments/environment';
import { generateUniqueId } from '../utils/generateUuid';
import { UserService } from 'src/app/core/services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private firestore: Firestore = inject(Firestore);
  private userService: UserService = inject(UserService);
  NAME_COLLECTION: string = environment.colletionName.notes;

  constructor() { }

  /**
   * Create a new note
   * @param note 
   * @param userId 
   * @returns 
   */
  async createNote(note: Note, userId: string): Promise<any> {
    const uid = generateUniqueId();
    return await setDoc(doc(this.firestore, this.NAME_COLLECTION, uid),
      { ...note, id: uid }).then(async () => {
        await this.asignNoteToUser(uid, userId);
        console.log('Note created: ', note);

        return { success: true, data: note, message: 'Success' };
      }).catch((error) => {
        return { success: false, data: error, message: 'Error' };
      });
  }

  /**
   * Get all notes
   * @param userId 
   * @returns 
   */
  async getNotesByUser(userId: string): Promise<any> {
    const user = await this.userService.getUserById(userId);
    if (!user.success) return { success: false, data: null, message: 'Error' };
    const notes = user.data.notes;
    if (notes.length === 0) return { success: true, data: notes, message: 'No notes found' }
    const notesData = (await Promise.all(notes.map(async (noteItem: any) => {
      const note = await this.getNotesById(noteItem.uid);
      if (note.success) return note.data;
      return null;
    }))).filter(note => note !== null);
    return { success: true, data: notesData, message: 'Success' };
  }

  /**
   *  Get note by id
   * @param noteId 
   * @returns 
   */
  async getNotesById(noteId: string): Promise<any> {
    return await getDoc(doc(this.firestore, this.NAME_COLLECTION, noteId))
      .then((doc) => { return { success: true, data: doc.data(), message: 'Success' }; })
      .catch((error) => { return { success: false, data: error, message: 'Error' }; });
  }

  /**
   * Asign note to user
   * @param noteId 
   * @param userId 
   * @returns 
   */
  async asignNoteToUser(noteId: string, userId: string): Promise<any> {
    const user = await this.userService.getUserById(userId);
    if (!user.success) return { success: false, data: null, message: 'Error' };
    user.data.notes.push({ uid: noteId });
    return await this.userService.updateUserDB({ ...user.data, userId });
  }
  async unasignNoteToUser(noteId: string, userId: string): Promise<any> {
    const user = await this.userService.getUserById(userId);
    if (!user.success) return { success: false, data: null, message: 'Error' };
    user.data.notes = user.data.notes.filter((note: any) => note.uid !== noteId);
    return await this.userService.updateUserDB({ ...user.data, userId });
  }

  async deleteNoteById(noteId: string, userId: string): Promise<any> {
    return await deleteDoc(doc(this.firestore, this.NAME_COLLECTION, noteId))
      .then(() => {
        this.unasignNoteToUser(noteId, userId);
        return { success: true, data: null, message: 'Success' };
      })
      .catch((error) => { return { success: false, data: error, message: 'Error' }; });
  }

  async updateNoteById(noteId: string, note: Note): Promise<any> {
    return await setDoc(doc(this.firestore, this.NAME_COLLECTION, noteId), note)
      .then(() => { return { success: true, data: note, message: 'Success' }; })
      .catch((error) => { return { success: false, data: error, message: 'Error' }; });
  }
}
