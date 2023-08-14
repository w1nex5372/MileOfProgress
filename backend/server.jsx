const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const pool = require("./database/database.jsx");

const port = 3200;

// Import the authenticateToken middleware
const authenticateToken = require("./routes/authenticationToken.jsx");

// Include the registration router
const secretKey = "lukas";
const registrationRoute = require("./routes/register.jsx")(pool, secretKey);
app.use("/api/data", registrationRoute);
// //////////////////////////////////////////

// Include the login router
const authRoute = require("./routes/loginas.jsx")(pool);
app.use("/api/login", authRoute);
// //////////////////////////////////////////

const resetPasswordRouter = require("./routes/resetPassword.jsx");

app.use(resetPasswordRouter);
// ///////////////////////////////////////////////////////////////
const newPasswordRouter = require("./routes/newPassword.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use(newPasswordRouter);
// include the habit router
const setUserHabits = require("./routes/habitRoutes/setHabits.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use("/api/habits", setUserHabits);

// //////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////
const getUserHabits = require("./routes/habitRoutes/getHabits.jsx")(
  pool,
  authenticateToken(secretKey)
);

app.use("/api/getHabits", getUserHabits);
// /////////////////////////////////////////////////////////////////////////

// Include the username router
// /////////////////////////////////////////////////////////////////////////
const getUsernameRoute = require("./routes/username.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use("/api/username", getUsernameRoute);
// //////////////////////////////////////////

// includes the delete router
// /////////////////////////////////////////////////////////////////////////
const deleteHabit = require("./routes/habitRoutes/deleteHabit.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use(deleteHabit);
// /////////////////////////////////////////////////////////////////////////

// completed habit
// /////////////////////////////////////////////////////////////////////////
const completedHabit = require("./routes/habitRoutes/complete.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use(completedHabit);
// /////////////////////////////////////////////////////////////////////////

// includes the edit router
// /////////////////////////////////////////////////////////////////////////
const editHabit = require("./routes/habitRoutes/editHabit.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use(editHabit);
// //////////////////////////////////////////////////////////////

// for goals routes

// set goals
// /////////////////////////////////////////////////////////////////////////
const setGoals = require("./routes/goalRoutes/setGoal.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use("/api/goals", setGoals);
// ////////////////////////

// get goals
// /////////////////////////////////////////////////////////////////////////
const getGoals = require("./routes/goalRoutes/getGoals.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use("/api/getGoals", getGoals);
// /////////////////////////////////////////////////////////

// completeGoal
const completedGoal = require("./routes/goalRoutes/completeGoal.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use(completedGoal);
// /////////////////////////////////////////////////////////

// deleteGoal
// /////////////////////////////////////////////////////////////////////////
const deleteGoal = require("./routes/goalRoutes/deleteGoal.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use(deleteGoal);
// /////////////////////////////////////////////////////////////////////////

// edit Goals
// /////////////////////////////////////////////////////////////////////////
const editGoal = require("./routes/goalRoutes/editGoal.jsx")(
  pool,
  authenticateToken(secretKey)
);

app.use(editGoal);
// /////////////////////////////////////////////////////////////////////////

// task routes

// /////////////////////////////////////////////////////////////////////////
const setUsersTasks = require("./routes/taskRoutes/setTask.jsx")(
  pool,
  authenticateToken(secretKey)
);

app.use("/api/tasks", setUsersTasks);
// /////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////
const getUserTasks = require("./routes/taskRoutes/getTask.jsx")(
  pool,
  authenticateToken(secretKey)
);

app.use("/api/getTasks", getUserTasks);
// ////////////////////////////////////////////////////////////////

// complete user tasks
// /////////////////////////////////////////////////////////////////////////
const completedUserTask = require("./routes/taskRoutes/completeTask.jsx")(
  pool,
  authenticateToken(secretKey)
);

app.use(completedUserTask);
// /////////////////////////////////////////////////////////////////////////

// delete user tasks
const deleteUserTask = require("./routes/taskRoutes/deleteTask.jsx")(
  pool,
  authenticateToken(secretKey)
);

app.use(deleteUserTask);
// ///////////////////////////////////////////////////////////////////////////

// edit user tasks
const editUserTask = require("./routes/taskRoutes/editTask.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use(editUserTask);
// ///////////////////////////////////////////////////////////////////////////

const saveUserNotes = require("./routes/taskRoutes/SetSaveNotes.jsx")(
  pool,
  authenticateToken(secretKey)
);

app.use(saveUserNotes);
// ////////////////////////////////////////////////////////////////

const getSavedUserNotes = require("./routes/taskRoutes/getSavedNotes.jsx")(
  pool,
  authenticateToken(secretKey)
);
app.use(getSavedUserNotes);

//

const deleteSavedUserNotes = require("./routes/taskRoutes/deleteTaskNotes.jsx")(
  pool,
  authenticateToken(secretKey)
);

app.use(deleteSavedUserNotes);

const checkUsername = require("./routes/checkUsername.jsx")(pool);
app.use(checkUsername);

// ...........................
const setCalendarDay = require("./routes/setCalendar.jsx")(pool);
app.use(setCalendarDay);

const getCalendarDays = require("./routes/habitRoutes/getHabitCalendar.jsx")(
  pool
);
app.use(getCalendarDays);

// ////////////////////////////////////////////////////////////////////////////

// badges

// set user badges

const setUserBadget = require("./routes/badges/setUserBadges.jsx")(
  pool,
  authenticateToken(secretKey)
);

app.use(setUserBadget);

// get user badges

const getUserBadget = require("./routes/badges/getUserBadges.jsx")(
  pool,
  authenticateToken(secretKey)
);

app.use(getUserBadget);

// set badge is_shown value to true

const setUserIsShownBadge = require("./routes/badges/setBadgeIsShown.jsx")(
  pool,
  authenticateToken(secretKey)
);

app.use(setUserIsShownBadge);

// ///////////////////////////////////////////////////

// goal habit association

const setUsersGoalHabitAssoc =
  require("./routes/goalHabitAssociation/setGoalAssocation.jsx")(
    pool,
    authenticateToken(secretKey)
  );

app.use(setUsersGoalHabitAssoc);
// /////////////////////////////////////////////////

const getUsersGoalHabitAssoc =
  require("./routes/goalHabitAssociation/getgoalhabit.jsx")(pool);

app.use(getUsersGoalHabitAssoc);
//

const getUsersHabitData =
  require("./routes/goalHabitAssociation/getHabitsData.jsx")(pool);
app.use(getUsersHabitData);
// ///////////

const deleteAssociateHabit =
  require("./routes/goalHabitAssociation/deleteAssociateHabit.jsx")(
    pool,
    authenticateToken(secretKey)
  );

app.use(deleteAssociateHabit);

// add habit for associated goal with update

const updateAssociateHabit =
  require("./routes/goalHabitAssociation/updateAssociateHabits.jsx")(
    pool,
    authenticateToken(secretKey)
  );
app.use(updateAssociateHabit);

// geting associated habits calendar days

const getHabitsCalendarDays =
  require("./routes/HabitStatistics/gethabitsCalendarData.jsx")(pool);

app.use(getHabitsCalendarDays);
// ////////////////////////////////////////////////////

// pomodoro timer

const setPomodoroTotalTime =
  require("./routes/taskRoutes/pomodoroTotalTime.jsx")(
    pool,
    authenticateToken(secretKey)
  );

app.use(setPomodoroTotalTime);
//

const getPomodoroTotalTime =
  require("./routes/taskRoutes/getPomodoroTotalTime.jsx")(
    pool,
    authenticateToken(secretKey)
  );

app.use(getPomodoroTotalTime);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
