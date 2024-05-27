import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastService: ToastrService) {}

  options = {
    positionClass: 'toast-top-right',
    tapToDismiss: true,
    progressBar: true,
    // disableTimeOut: true,
  };

  showSuccess(message: string) {
    this.toastService.success(message, '', {
      ...this.options,
    });
  }

  showError(message: string) {
    this.toastService.error(message, '', {
      ...this.options,
    });
  }

  showWarning(message: string) {
    this.toastService.warning(message, '', {
      ...this.options,
    });
  }

  showInfo(message: string) {
    this.toastService.info(message, '', {
      ...this.options,
    });
  }
}
