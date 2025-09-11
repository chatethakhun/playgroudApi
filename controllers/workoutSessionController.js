import WorkoutSession from "../models/WorkoutSession.js";

export const getListWorkoutSession = async (req, res) => {
  try {
    const { isCompleted } = req.query;

    let workoutSessions = [];

    if (isCompleted) {
      workoutSessions = await WorkoutSession.find({
        userId: req.user.id,
        endedAt: { $ne: null },
      });
    } else {
      workoutSessions = await WorkoutSession.find({
        userId: req.user.id,
        endedAt: null,
      });
    }

    res.status(200).json({
      workoutSessions,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const startWorkoutSession = async (req, res) => {
  try {
    const workoutSession = await new WorkoutSession({
      userId: req.user.id,
      title: req.body.title,
      focus: req.body.focus,
      startedAt: new Date(),
    }).save();

    res.status(201).json({
      workoutSession,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const endWorkoutSession = async (req, res) => {
  try {
    const workoutSession = await WorkoutSession.findById(req.params.id);

    if (!workoutSession) {
      res.status(404).send("Workout session not found");
      return;
    }

    workoutSession.endedAt = new Date();
    await workoutSession.save();

    res.status(200).json({
      workoutSession,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteWorkoutSession = async (req, res) => {
  try {
    const workoutSession = await WorkoutSession.findById(req.params.id);

    if (!workoutSession) {
      res.status(404).send("Workout session not found");
      return;
    }

    await workoutSession.remove();

    res.status(200).send("Workout session deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getSingleWorkoutSession = async (req, res) => {
  try {
    const workoutSession = await WorkoutSession.findById(req.params.id);

    if (!workoutSession) {
      res.status(404).send("Workout session not found");
      return;
    }

    res.status(200).json({
      workoutSession,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const addWorkoutSet = async (req, res) => {
  try {
    const workoutSession = await WorkoutSession.findById(req.params.id);

    if (!workoutSession) {
      res.status(404).send("Workout session not found");
      return;
    }

    const workoutSet = await new WorkoutSession.WorkoutSet({
      sessionId: workoutSession._id,
      workoutId: req.body.workoutId,
    }).save();

    res.status(201).json({
      workoutSet,
    });
  } catch (error) {
    console.log("error from addWorkoutSet", error);
    res.status(500).send(error);
  }
};

export const deleteWorkoutSet = async (req, res) => {
  try {
    const workoutSet = await WorkoutSession.WorkoutSet.findById(req.params.id);

    if (!workoutSet) {
      res.status(404).send("Workout set not found");
      return;
    }

    await workoutSet.remove();

    res.status(200).send("Workout set deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};
