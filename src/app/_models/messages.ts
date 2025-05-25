export interface Message {
    Id: number
    SenderId: number
    ReceiverId: number
    Content: string
    Timestamp: Date
    IsRead: boolean
  }