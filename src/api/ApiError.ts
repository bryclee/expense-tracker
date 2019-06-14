export class ApiError extends Error {
  status: number
  data: JSON

  constructor(
    message: string,
    { status, data }: { status: number; data: JSON },
  ) {
    super(message)
    this.status = status
    this.data = data
  }
}
