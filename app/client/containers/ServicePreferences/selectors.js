import { createSelectorCreator, defaultMemoize } from 'reselect'
import { isEqual, mapKeys } from 'lodash'

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

// create a "selector creator" that uses deep checking
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

const getPreferences = state => state.preferences
const getGuiPrefences = state => state.guiPreferences

export const getInitialValues = createDeepEqualSelector(
  [getPreferences, getGuiPrefences],
  (preferences, guiPreferences) => ({
    ...preferences,
    ...mapKeys(guiPreferences, (value, key) => 'gui' + capitalize(key)),
  })
)
