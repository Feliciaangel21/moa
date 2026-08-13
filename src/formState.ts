export type AvailabilityDraft = {
  availableDates: string[]
  unavailableDates: string[]
  preferredNights: '1' | '2' | '3' | '4+' | null
  nightFlexibility: 'fixed' | 'plus-minus-one' | null
  weekdayFlexibility: 'weekends' | 'friday-pto' | 'weekdays' | null
  flightTimeFlexibility: 'early-morning' | 'morning-onward' | 'any-time' | null
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
  availability: AvailabilityDraft
  hardConstraints: HardConstraintDraft
  travelStyles: Record<string, number | null>
  activityScores: Record<string, number | null>
  mustDo: string
  avoid: string
}

export const createEmptySurveyDraft = (styleIds: string[], activityIds: string[]): SurveyDraft => ({
  availability: {
    availableDates: [],
    unavailableDates: [],
    preferredNights: null,
    nightFlexibility: null,
    weekdayFlexibility: null,
    flightTimeFlexibility: null,
  },
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

export type RoomSubmissionPayload = {
  schemaVersion: 1
  destinationId: string
}

export const createRoomSubmissionPayload = (destinationId: string): RoomSubmissionPayload => ({
  schemaVersion: 1,
  destinationId,
})

export const createSurveySubmissionPayload = (
  destinationId: string,
  draft: SurveyDraft,
): SurveySubmissionPayload => ({
  schemaVersion: 1,
  destinationId,
  ...draft,
})
