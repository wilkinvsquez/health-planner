import {
  collection,
  deleteDoc,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
} from '@angular/fire/firestore';
import { inject, Injectable } from '@angular/core';
import { updateEmail, getAuth } from 'firebase/auth';

import { environment } from 'src/environments/environment';

// Interfaces
import { User } from '../../interfaces/User';
import { Response } from '../../interfaces/Response';

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
  async getUsers(): Promise<Response> {
    const users = await getDocs(
      collection(this.firestore, this.NAME_COLLECTION)
    );
    if (users.empty)
      return { success: false, data: [], message: 'No users found' };
    const userData = users.docs.map((doc) => doc.data());
    return { success: true, data: userData, message: 'Success' };
  }

  async getPatients(): Promise<Response> {
    try {
      const users = await getDocs(
        query(
          collection(this.firestore, this.NAME_COLLECTION),
          where('role', '==', 'user')
        )
      );
      if (users.empty)
        return { success: false, data: [], message: 'No patients found' };
      const userData = users.docs.map((doc) => doc.data());
      return { success: true, data: userData, message: 'Success' };
    } catch (error: any) {
      return { success: false, data: error.code, message: error.message };
    }
  }

  async getProfessionals(): Promise<Response> {
    try {
      const users = await getDocs(
        query(
          collection(this.firestore, this.NAME_COLLECTION),
          where('role', '==', 'admin')
        )
      );

      if (users.empty)
        return { success: false, data: [], message: 'No professionals found' };
      const userData = users.docs.map((doc) => doc.data());
      return { success: true, data: userData, message: 'Success' };
    } catch (error: any) {
      return { success: false, data: error.code, message: error.message };
    }
  }

  /**
   * Removes the user from the userRelations field of the current user and vice versa.
   * @param currentUser
   * @param userSelected
   * @returns An object with the success status, the updated user data, and a message.
   */
  async unlinkUsers(currentUser: User, userSelected: User): Promise<Response> {
    const removeFromCurrent = await this.unlinkUser(
      currentUser,
      userSelected.uid!
    );
    if (!removeFromCurrent.success) return removeFromCurrent;
    const removeFromSelected = await this.unlinkUser(
      userSelected,
      currentUser.uid!
    );
    if (!removeFromSelected.success) return removeFromSelected;
    return {
      success: true,
      data: { currentUser, userToRemove: userSelected },
      message: 'Success',
    };
  }

  /**
   * Removes a user from the 'userRelations' field of the current user.
   * @param user The user to unlink from the current user.
   * @param uid The UID of the user to unlink.
   * @returns A promise that resolves with the updated user data after the unlink operation has completed in the database.
   */
  async unlinkUser(user: User, uid: string): Promise<Response> {
    user.userRelations = user.userRelations?.filter(
      (item: any) => item.uid !== uid
    );
    return await this.updateUserDB(user);
  }

  /**
   * Retrieves user data from the Firestore database based on the provided user ID.
   *
   * @param id The ID of the user to retrieve.
   * @returns A promise that resolves with the user data matching the provided ID, or undefined if no user is found with the given ID.
   */
  async getUserById(id: string): Promise<Response> {
    return await getDoc(doc(this.firestore, this.NAME_COLLECTION, id))
      .then((res) => {
        return {
          success: true,
          data: res.data(),
          message: 'Success',
        };
      })
      .catch((error) => {
        return { success: false, data: error.code, message: error.message };
      });
  }

  /**
   * Retrieves user data from the Firestore database based on the provided identification (ID).
   *
   * @param id The identification (ID) of the user to retrieve.
   * @returns A promise that resolves with an array containing the user data matching the provided identification.
   */
  async getUserByCRId(id: string): Promise<Response> {
    try {
      const user = await getDocs(
        query(
          collection(this.firestore, this.NAME_COLLECTION),
          where('id', '==', id)
        )
      );
      if (user.empty)
        return { success: false, data: [], message: 'User not found' };
      const userData = user.docs.map((doc) => doc.data());
      return { success: true, data: userData, message: 'Success' };
    } catch (error: any) {
      return { success: false, data: error.code, message: error.message };
    }
  }

  /**
   * Updates user data in the Firestore database.
   * @param user
   * @returns
   */
  async updateUserDB(user: any, uid?: string): Promise<Response> {
    if (user.uid || uid) {
      return await updateDoc(
        doc(this.firestore, this.NAME_COLLECTION, user.uid ? user.uid : uid),
        user
      )
        .then(() => {
          return { success: true, data: user, message: 'Success' };
        })
        .catch((error) => {
          return { success: false, data: error.code, message: error.message };
        });
    }
    return { success: false, data: null, message: 'User ID not provided' };
  }
  /**
   * Updates a user document in the Firestore database. Also works for deactivate an user
   *
   * @param id The ID of the user to update.
   * @param data The updated user data. It should be an object representing the new values of the user properties.
   * @returns A promise that resolves with the updated user data after the update operation has completed in the database.
   */
  async updateUser(id: string, data: any) {
    // Update email in Firebase Authentication if email is provided
    const auth = getAuth();
    const authUser = auth.currentUser;
    if (data.email) {
      try {
        if (authUser) {
          const updateAuth: Response = await updateEmail(authUser, data.email)
            .then(() => {
              return { success: true, data: data, message: 'Success' };
            })
            .catch((error) => {
              return {
                success: false,
                data: error.code,
                message: error.message,
              };
            });

          if (!updateAuth.success) {
            return updateAuth;
          }

          return await this.updateUserDB(data, id);
        }
        return data;
      } catch (error) {
        return error;
      }
    }
  }

  /**
   * Deletes a user from the Firestore database based on the provided identification (ID).
   *
   * @param id The identification (ID) of the user to delete.
   * @returns A promise that resolves once the user document is successfully deleted from the database.
   */
  async deleteUser(id: string): Promise<Response> {
    const user = await (
      await getDoc(doc(this.firestore, this.NAME_COLLECTION, id))
    ).data();
    if (!user) return { success: false, data: null, message: 'User not found' };
    return await deleteDoc(doc(this.firestore, this.NAME_COLLECTION, id))
      .then(() => {
        return { success: true, data: user, message: 'Success' };
      })
      .catch((error) => {
        return { success: false, data: error.code, message: error.message };
      });
  }

  /**
   * Retrieves users whose 'userRelations' field contains a specific UID.
   *
   * @param uid The UID to search for in the 'userRelations' field of users.
   * @returns A promise that resolves with an array containing the data of users whose 'userRelations' field includes the provided UID.
   */
  async getUsersByListUID(uid: string): Promise<Response> {
    try {
      const usersSnapshot = await getDocs(
        collection(this.firestore, this.NAME_COLLECTION)
      );
      if (usersSnapshot.empty)
        return { success: false, data: [], message: 'No users found' };
      const matchingUsers = usersSnapshot.docs.filter((doc) => {
        const list = doc.data()['userRelations'];
        if (!list) return false;
        return list.some((item: any) => item.uid === uid);
      });
      if (matchingUsers.length === 0)
        return { success: false, data: [], message: 'No users found' };
      const userData = matchingUsers.map((doc) => doc.data());
      return { success: true, data: userData, message: 'Success' };
    } catch (error: any) {
      return {
        success: false,
        data: error.code ? error.code : error,
        message: error.message,
      };
    }
  }

  /**
   * Searches for users whose fields contain a specified value.
   *
   * @param value The search value to look for in the user fields.
   * @returns A promise that resolves with an array containing the data of users that contain the specified value in any of their fields.
   */
  async searchUsers(value: string): Promise<Response> {
    try {
      const usersSnapshot = await getDocs(
        collection(this.firestore, this.NAME_COLLECTION)
      );
      if (usersSnapshot.empty)
        return { success: false, data: [], message: 'No users found' };
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
      if (matchingUsers.length === 0)
        return { success: false, data: [], message: 'No users found' };
      const userData = matchingUsers.map((doc) => doc.data());
      return { success: true, data: userData, message: 'Success' };
    } catch (error: any) {
      return {
        success: false,
        data: error.code ? error.code : error,
        message: error.message,
      };
    }
  }
}
