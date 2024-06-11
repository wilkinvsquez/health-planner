import { Injectable } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private _storage: Storage) {}

  /**
   * Gets the file URL from the storage
   * @param path The path of the file in the storage
   * @returns The file URL
   */
  async getFileUrl(path: string) {
    const storageRef = ref(this._storage, path);
    return getDownloadURL(storageRef);
  }

  async uploadFile(file: File, path: string) {
    try {
      const storageRef = ref(this._storage, path);
      const savedFile = await uploadBytes(storageRef, file);
      return await getDownloadURL(savedFile.ref);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteFile(path: string) {
    const storageRef = ref(this._storage, path);
    return deleteObject(storageRef);
  }
}
