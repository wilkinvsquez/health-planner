export function isFieldInvalid(form: any, field?: any) {
  return (
    form.get(field)?.invalid &&
    form.get(field)?.pristine === false &&
    form.get(field)?.errors!['required']
  );
}

export function isFormatInvalid(form: any, field?: any) {
  switch (field) {
    case 'email':
      return form.get(field)?.errors && form.get(field)?.errors!['email'];
    case 'identification':
      return form.get(field)?.errors && form.get(field)?.errors!['minlength'];
    case 'birthday':
      return form.get(field).errors &&  form.get(field).errors['pattern'];
  }
}
