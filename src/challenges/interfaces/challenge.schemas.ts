import * as mongoose from 'mongoose'


export const ChallengeSchema = new mongoose.Schema({
  dateOfChallenge: { type: Date },
  status: { type: String },
  dateHourRequest: { type: Date },
  dateHourResponse: { type: Date },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  category: { type: String },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  matches: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
}, { timestamps: true, collection: 'challenges' })