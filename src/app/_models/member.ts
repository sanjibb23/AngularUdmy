import { Message } from "./messages"
import { UserPhoto } from "./UserPhoto"

export interface member {
    Id: number
    UserName: string
    DateOfBirth: Date
    Age: number
    KnownAs: string
    LastActive: Date
    Introduction: string
    Interest: string
    Gender: string
    LookingFor: string
    City: string
    Country: string
    UserPhotos: UserPhoto[]
    Email: string
    FirstName: string
    LastName: string
    MainPhotoUrl: string
    LikebyCurrentUser?: boolean
    IsOnline?: boolean
    Messages?: Message[]
  }
  
  