/** How many questions the quiz owner answers (and every friend gets). */
export const QUIZ_LENGTH = 10;

/** Max characters in a display name (matches the varchar(15) columns). */
export const NAME_MAX = 15;

/** A friend scoring below this is flagged as a "fake friend". */
export const FAKE_FRIEND_BELOW = 5;

/** localStorage key holding this browser's crypto.randomUUID(). */
export const VISITOR_KEY = "dbm.visitor-id.v1";

/** localStorage key listing quizzes this browser created (for the "your quizzes" shortcut). */
export const MY_QUIZZES_KEY = "dbm.my-quizzes.v1";
