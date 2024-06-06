import { inject, Injectable, Injector } from '@angular/core';
import {
  collection,
  deleteDoc,
  DocumentReference,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';

import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { User } from '../../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore: Firestore = inject(Firestore);

  NAME_COLLECTION: string = environment.colletionName.users;

  constructor() {}

  /**
   * Retrieves all user data from the Firestore database.
   *
   * @returns A promise that resolves with an array containing the data of all users stored in the database.
   */
  async getUsers() {
    const users = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    return users.docs.map((doc: any) => doc.data());
  }

  /**
   * Removes a user from the 'userRelations' field of the current user.
   * @param user The user to unlink from the current user.
   * @param uid The UID of the user to unlink.
   * @returns A promise that resolves with the updated user data after the unlink operation has completed in the database.
   */
  async unlinkUser(user: User, uid: string) {
    user.userRelations?.forEach((user: any, index: number) => {
      if (user.uid === uid) {
        user.userRelations?.splice(index, 1);
      }
    });
    return await this.updateUser(user.uid!, user);
  }

  /**
   * Retrieves user data from the Firestore database based on the provided user ID.
   *
   * @param id The ID of the user to retrieve.
   * @returns A promise that resolves with the user data matching the provided ID, or undefined if no user is found with the given ID.
   */
  async getUserById(id: string) {
    const user = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    return user.docs.find((doc: any) => doc.data().uid === id)?.data();
  }

  /**
   * Retrieves user data from the Firestore database based on the provided identification (ID).
   *
   * @param id The identification (ID) of the user to retrieve.
   * @returns A promise that resolves with an array containing the user data matching the provided identification.
   */
  async getUserByCRId(id: string) {
    const user = await getDocs(
      query(
        collection(this.firestore, this.NAME_COLLECTION),
        where('arreglo', '==', id)
      )
    );
    return user.docs.map((doc: any) => doc.data());
  }

  /**
   * Updates a user document in the Firestore database. Also works for deactivate an user
   *
   * @param id The ID of the user to update.
   * @param data The updated user data. It should be an object representing the new values of the user properties.
   * @returns A promise that resolves with the updated user data after the update operation has completed in the database.
   */
  async updateUser(id: string, data: any) {
    const user = await getDocs(
      query(
        collection(this.firestore, this.NAME_COLLECTION),
        where('uid', '==', id)
      )
    );
    const updateduser: DocumentReference = user.docs[0].ref;
    return await updateDoc(updateduser, data).then(() => data);
  }

  /**
   * Deletes a user from the Firestore database based on the provided identification (ID).
   *
   * @param id The identification (ID) of the user to delete.
   * @returns A promise that resolves once the user document is successfully deleted from the database.
   */
  async deleteUser(id: string) {
    const user = await getDocs(
      query(
        collection(this.firestore, this.NAME_COLLECTION),
        where('identification', '==', id)
      )
    );
    const deletedUser: DocumentReference = user.docs[0].ref;
    return await deleteDoc(deletedUser);
  }

  /**
   * Retrieves users whose 'userRelations' field contains a specific UID.
   *
   * @param uid The UID to search for in the 'userRelations' field of users.
   * @returns A promise that resolves with an array containing the data of users whose 'userRelations' field includes the provided UID.
   */
  async getUsersByListUID(uid: string) {
    const usersSnapshot = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    const matchingUsers = usersSnapshot.docs.filter((doc) => {
      const list = doc.data()['userRelations'];
      if (!list) return false;
      return list.some((item: any) => item.uid === uid);
    });
    const userData = matchingUsers.map((doc) => doc.data());
    return userData;
  }

  /**
   * Searches for users whose fields contain a specified value.
   *
   * @param value The search value to look for in the user fields.
   * @returns A promise that resolves with an array containing the data of users that contain the specified value in any of their fields.
   */
  async searchUsers(value: string) {
    const usersSnapshot = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    const matchingUsers = usersSnapshot.docs.filter((doc) => {
      const userData = doc.data();
      for (const key in userData) {
        if (
          userData[key] &&
          userData[key].toString().toLowerCase().includes(value.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
    const userData = matchingUsers.map((doc) => doc.data());
    return userData;
  }
}
