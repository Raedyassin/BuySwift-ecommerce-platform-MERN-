class AppError extends Error{
  constructor(status, statusText, message) {
    super()
    this.status = status
    this.statusText = statusText
    this.message = message
  }
}

export default AppError;