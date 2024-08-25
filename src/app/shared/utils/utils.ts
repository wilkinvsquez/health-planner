/**
 * The function `hasEmptyFields` checks if an object has any empty fields (empty strings, empty arrays,
 * or nested objects with empty fields).
 * @param {any} obj - The `obj` parameter in the `hasEmptyFields` function is an object of type `any`
 * that contains key-value pairs. The function checks if any of the values in the object are empty
 * strings, empty arrays, or nested objects with empty fields.
 * @returns The function `hasEmptyFields` returns a boolean value - `true` if there are empty fields
 * (empty strings, empty arrays, or nested objects with empty fields) in the input object `obj`, and
 * `false` otherwise.
 */
export function hasEmptyFields(obj: any): boolean {
    const requiredFields = ['birthdate', 'email', 'name', 'lastname', 'identification', 'phoneNumber'];

    for (const key of requiredFields) {
        const value = obj[key];

        if (typeof value === 'string' && value.trim() === '') {
            return true;
        }
    }

    return false;
}