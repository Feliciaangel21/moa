export type RoomDraft = {
  tripName: string
  startDate: string
  endDate: string
  memberCount: string
  budgetRange: string
  responseDeadline: string
}

export type HardConstraintDraft = {
  budgetLimit: string
  includesFlight: boolean
  diet: string | null
  beliefs: string[]
  walkingDistanceKm: number | null
  mobilityNeeds: string[]
  noGoItems: string[]
}

export type SurveyDraft = {
  hardConstraints: HardConstraintDraft
  travelStyles: Record<string, number | null>
  activityScores: Record<string, number | null>
  mustDo: string
  avoid: string
}

export const createEmptyRoomDraft = (): RoomDraft => ({
  tripName: '',
  startDate: '',
  endDate: '',
  memberCount: '',
  budgetRange: '',
  responseDeadline: '',
})

export const createEmptySurveyDraft = (styleIds: string[], activityIds: string[]): SurveyDraft => ({
  hardConstraints: {
    budgetLimit: '',
    includesFlight: false,
    diet: null,
    beliefs: [],
    walkingDistanceKm: null,
    mobilityNeeds: [],
    noGoItems: [],
  },
  travelStyles: Object.fromEntries(styleIds.map((id) => [id, null])),
  activityScores: Object.fromEntries(activityIds.map((id) => [id, null])),
  mustDo: '',
  avoid: '',
})

export type SurveySubmissionPayload = SurveyDraft & {
  schemaVersion: 1
  destinationId: string
}

export type RoomSubmissionPayload = RoomDraft & {
  schemaVersion: 1
  destinationId: string
}

export const createRoomSubmissionPayload = (
  destinationId: string,
  draft: RoomDraft,
): RoomSubmissionPayload => ({
  schemaVersion: 1,
  destinationId,
  ...draft,
})

export const createSurveySubmissionPayload = (
  destinationId: string,
  draft: SurveyDraft,
): SurveySubmissionPayload => ({
  schemaVersion: 1,
  destinationId,
  ...draft,
})
