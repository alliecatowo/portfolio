export const useToastNotifications = () => {
  const toast = useToast()

  const showSuccess = (message: string, title = 'Success') => {
    toast.add({
      id: `success-${Date.now()}`,
      title,
      description: message,
      color: 'primary',
      icon: 'i-lucide-check-circle',
      timeout: 5000
    })
  }

  const showError = (message: string, title = 'Error') => {
    toast.add({
      id: `error-${Date.now()}`,
      title,
      description: message,
      color: 'error',
      icon: 'i-lucide-x-circle',
      timeout: 7000
    })
  }

  const showInfo = (message: string, title = 'Info') => {
    toast.add({
      id: `info-${Date.now()}`,
      title,
      description: message,
      color: 'info',
      icon: 'i-lucide-info',
      timeout: 5000
    })
  }

  const showWarning = (message: string, title = 'Warning') => {
    toast.add({
      id: `warning-${Date.now()}`,
      title,
      description: message,
      color: 'warning',
      icon: 'i-lucide-alert-triangle',
      timeout: 6000
    })
  }

  const showLoading = (message: string, title = 'Loading...') => {
    const id = `loading-${Date.now()}`
    toast.add({
      id,
      title,
      description: message,
      color: 'primary',
      icon: 'i-lucide-loader',
      timeout: 0, // Don't auto-dismiss loading toasts
      actions: [{
        label: 'Cancel',
        click: () => toast.remove(id)
      }]
    })
    return id
  }

  const updateToast = (id: string, updates: any) => {
    toast.update(id, updates)
  }

  const removeToast = (id: string) => {
    toast.remove(id)
  }

  const clearAll = () => {
    toast.clear()
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    updateToast,
    removeToast,
    clearAll
  }
}