export const ERROR_MESSAGES = {
  ALREADY_EXISTS: (key: string) => `${key} already exists`,
  INCORRECT: (key: string) => `${key} is incorrect`,
  NOT_PRESENT: (key: string) => `${key} is not present`,
};

export const GEN_AI_CONFIGURATION_ERROR = `Google Generative AI is not configured properly.`;
export const NOT_FOLLOWING_ERROR = 'You are not following this user.';
export const ALREADY_FOLLOWING_ERROR = 'You are already following this user.';
export const SELF_ACTION_ERROR = 'You cannot perform this action on yourself.';
export const ARTICLE_NOT_FAVORITE_ERROR =
  'Article already removed from favorite articles';
export const ARTICLE_ALREADY_FAVORITED_ERROR =
  'Article already added to favorite articles';
export const ENABLE_BIOMETRIC_ERROR = (
  userId: number | string,
  deviceId: string,
) =>
  `Error occurred while enabling biometric for userId: ${userId} & deviceId: ${deviceId}`;
export const DISABLE_BIOMETRIC_ERROR = (
  userId: number | string,
  deviceId: string,
) =>
  `Error occurred while disabling biometric for userId: ${userId} & deviceId: ${deviceId}`;
export const BIOMETRIC_CHALLENGE_ERROR = (
  userId: number | string,
  deviceId: string,
) =>
  `Error occurred while getting biometric challenge for userId: ${userId} & deviceId: ${deviceId}`;
export const BIOMETRIC_VERIFICATION_FAILED = `Biometric verification failed.`;
export const ERROR_BIOMETRIC_VERIFICATION = `Error during Biometric verification.`;
